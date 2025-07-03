import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { questAPI } from '@/api'; // Импортируем questAPI
import { useToast } from 'primevue/usetoast'; // Импортируем useToast

// Обновленный Helper для извлечения сообщения
const getErrorMessage = (err, defaultMessage) => {
  // 1. Приоритет: err.response.data.error.message (если есть вложенный объект error)
  if (err?.response?.data?.error?.message) {
    return err.response.data.error.message;
  }
  // 2. err.response.data.message (прямое сообщение в data)
  if (err?.response?.data?.message) {
    return err.response.data.message;
  }
  // 3. Стандартное сообщение axios
  if (err?.message) {
    return err.message;
  }
  // 4. Стандартное сообщение
  return defaultMessage || 'Произошла неизвестная ошибка';
};

export const useQuestStore = defineStore('quest', () => {
  const toast = useToast(); // Инициализируем Toast
  // --- State ---
  const blocks = ref([]);
  const currentBlock = ref(null); // Для хранения данных текущего открытого блока
  const teamScore = ref(0);
  const teamCoins = ref(0);
  const loading = ref(false);
  const error = ref(null);
  const checkingAnswer = ref(false); // Флаг для состояния проверки ответа
  const requestingHint = ref(false); // Флаг для состояния запроса подсказки

  // --- Getters (как computed свойства) ---
  const currentBlockId = computed(() => currentBlock.value?.id);
  const currentBlockTitle = computed(() => currentBlock.value?.title || '');
  const currentBlockRiddles = computed(() => currentBlock.value?.riddles || []);

  // --- Actions ---
  async function fetchQuestData() {
    loading.value = true;
    error.value = null;
    try {
      const response = await questAPI.getAllBlocks(); // Используем questAPI
      const data = response.data; // axios помещает ответ в data
      
      if (data.ok) {
        blocks.value = data.blocks || [];
        teamScore.value = data.team_score ?? 0;
        teamCoins.value = data.team_coins ?? 0;
      } else {
        throw new Error(data.message || 'Не удалось загрузить данные квеста');
      }
    } catch (err) {
      console.error('Ошибка в fetchQuestData:', err);
      const errorMessage = getErrorMessage(err, 'Произошла ошибка при загрузке данных квеста.');
      error.value = errorMessage;
      toast.add({ severity: 'error', summary: 'Ошибка загрузки', detail: errorMessage, life: 5000 });
    } finally {
      loading.value = false;
    }
  }

  async function fetchBlockData(blockId) {
    if (!blockId) {
      error.value = 'Не указан ID блока';
      return;
    }
    loading.value = true;
    error.value = null;
    // Не сбрасываем currentBlock здесь, чтобы избежать мерцания
    try {
      const response = await questAPI.getBlock(blockId); // Используем questAPI
      const data = response.data;
      
      if (data.ok) {
        currentBlock.value = data.block; 
        if (data.team_score !== undefined) teamScore.value = data.team_score;
        if (data.team_coins !== undefined) teamCoins.value = data.team_coins;
      } else {
         throw new Error(data.message || 'Не удалось загрузить блок');
      }
    } catch (err) {
      console.error(`Ошибка в fetchBlockData (ID: ${blockId}):`, err);
      const errorMessage = getErrorMessage(err, `Произошла ошибка при загрузке блока ${blockId}.`);
      error.value = errorMessage;
      currentBlock.value = null; // Сбрасываем блок только в случае ошибки
      toast.add({ severity: 'error', summary: 'Ошибка загрузки блока', detail: errorMessage, life: 5000 }); // Показываем Toast
    } finally {
      loading.value = false;
    }
  }
  
  // Действие для проверки ответа
  async function checkAnswer(riddleId, answer) {
    checkingAnswer.value = true;
    error.value = null; // Сбрасываем предыдущие ошибки
    let result = { ok: false, isCorrect: false, message: '' };
    try {
      const response = await questAPI.checkAnswer(riddleId, answer);
      result = response.data;

      if (result.ok) {
        // Обновляем счет/монеты напрямую
        if (result.team_score !== undefined) teamScore.value = result.team_score;
        if (result.team_coins !== undefined) teamCoins.value = result.team_coins;

        // Если ответ верный и есть обновленная загадка, обновляем ее в currentBlock
        if (result.isCorrect && result.updatedRiddle && currentBlock.value && currentBlock.value.riddles) {
          const riddleIndex = currentBlock.value.riddles.findIndex(r => r.id === riddleId);
          if (riddleIndex !== -1) {
            currentBlock.value.riddles[riddleIndex] = result.updatedRiddle;
          }
        }
      } else {
         // Ошибка, обработанная бэкендом (например, RewardAlreadyGivenException)
         result.message = result.message || 'Ошибка при проверке ответа';
         throw new Error(result.message);
      }
    } catch (err) {
      console.error(`Ошибка в checkAnswer (Riddle ID: ${riddleId}):`, err);
      const errorMessage = getErrorMessage(err, 'Произошла ошибка при проверке ответа.');
      result.message = errorMessage;
      // Показываем toast для серверных или бэкенд ошибок (не для "неверный ответ")
      if (!result.ok || err?.response?.status >= 500) { 
        toast.add({ severity: 'error', summary: 'Ошибка проверки ответа', detail: errorMessage, life: 5000 });
      }
    } finally {
      checkingAnswer.value = false;
    }
    return result; // Возвращаем результат для обработки в компоненте (например, показать alert)
  }
  
  // Действие для запроса подсказки
  async function requestHint(riddleId) {
     requestingHint.value = true;
     error.value = null;
     let result = { ok: false, hint: null, message: '' };
    try {
      const response = await questAPI.getHint(riddleId);
      result = response.data;
      
      if (result.ok) {
         // Обновляем счет/монеты
        if (result.team_score !== undefined) teamScore.value = result.team_score;
        if (result.team_coins !== undefined) teamCoins.value = result.team_coins;
        
         // Если подсказка получена и есть текущий блок, обновляем данные загадки
         if (result.hint && currentBlock.value && currentBlock.value.riddles) {
            const riddleIndex = currentBlock.value.riddles.findIndex(r => r.id === riddleId);
            if (riddleIndex !== -1) {
               // Обновляем флаг has_hint и саму подсказку
               currentBlock.value.riddles[riddleIndex].has_hint = true;
               currentBlock.value.riddles[riddleIndex].hint = result.hint;
            }
         }
      } else {
          // Обработанная бэкендом ошибка (напр. InsufficientCoinsException)
          result.message = result.message || 'Не удалось получить подсказку';
         throw new Error(result.message);
      }
    } catch (err) {
      console.error(`Ошибка в requestHint (Riddle ID: ${riddleId}):`, err);
      const errorMessage = getErrorMessage(err, 'Произошла ошибка при запросе подсказки.');
      result.message = errorMessage;
      toast.add({ severity: 'warn', summary: 'Не удалось получить подсказку', detail: errorMessage, life: 5000 }); // Используем warn, т.к. может быть нехватка монет
    } finally {
       requestingHint.value = false;
    }
    return result; // Возвращаем результат для обработки в компоненте
  }
  
  // --- Возвращаем state, getters и actions ---
  return {
    // State
    blocks,
    currentBlock,
    teamScore,
    teamCoins,
    loading,
    error,
    checkingAnswer, // Экспортируем новые флаги состояния
    requestingHint,
    // Getters (Computed)
    currentBlockId,
    currentBlockTitle,
    currentBlockRiddles,
    // Actions
    fetchQuestData,
    fetchBlockData,
    checkAnswer, // Экспортируем новые actions
    requestHint,
  };
}); 