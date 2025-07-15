<template>
  <div 
    class="riddle-block"
    :class="{'insider-visited': riddle.has_insider_attempt}"
    :key="`riddle-${riddle.id}-${riddle.has_insider_attempt}-${riddle.has_additional_field}`"
  >
    
    <!-- Если загадка уже отвечена -->
    <template v-if="isAnswered(riddle)">
      <!-- Заголовок загадки -->
      <h3 class="riddle-title" v-html="riddle.title"></h3>
      <!-- Отображаем координаты с возможностью копирования -->
      <div 
        v-if="riddle.geo_answered" 
        class="copy-field riddle-text" 
        @click="copyToClipboard(riddle.geo_answered)"
      >
        <span v-html="riddle.geo_answered"></span> <!-- Координаты без ссылки -->
        <span class="tooltip">{{ tooltipText }}</span>
      </div>
      <!-- Используем ImageViewer для отвеченного изображения -->
      <ImageViewer 
        v-if="riddle.image_path_answered && getFileType(riddle.image_path_answered) === 'image'"
        :filePath="riddle.image_path_answered"
        maxWidth="100%"
        @image-click="openImageModal"
        class="riddle-image" />
      <!-- Используем VideoPlayer -->
      <VideoPlayer
        v-else-if="riddle.image_path_answered && getFileType(riddle.image_path_answered) === 'video'"
        :filePath="riddle.image_path_answered"
        maxWidth="100%"
        class="riddle-image" />
      <!-- Используем AudioPlayer -->
      <AudioPlayer
        v-else-if="riddle.image_path_answered && getFileType(riddle.image_path_answered) === 'audio'"
        :filePath="riddle.image_path_answered"
        maxWidth="100%"
        class="riddle-image" />
      <!-- Используем TextViewer -->
      <TextViewer
        v-else-if="riddle.image_path_answered && getFileType(riddle.image_path_answered) === 'document' && riddle.image_path_answered.endsWith('.txt')"
        :filePath="riddle.image_path_answered"
        additionalStyle="max-width: 100%;"
        class="riddle-image" />
      <!-- Используем GenericFileDownloader для остального -->
      <GenericFileDownloader
        v-else-if="riddle.image_path_answered"
        :filePath="riddle.image_path_answered"
        maxWidth="100%"
        class="riddle-image" />
      <!-- Контейнер для иконок-ссылок инсайдеров -->
      <div v-if="riddle.insiderLinks && riddle.insiderLinks.length > 0" class="insider-links-container">
        <!-- Отображаем до 2х иконок -->
        <a 
          v-for="(link, index) in riddle.insiderLinks.slice(0, 2)" 
          :key="index" 
          :href="link" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="insider-icon-link"
        >
          <img 
            :src="index === 0 ? require('@/assets/images/insider1.svg') : require('@/assets/images/insider2.svg')" 
            alt="Местоположение инсайдера"
            width="50" 
            height="50" 
          />
        </a>
      </div>
      <p class="riddle-text">{{ riddle.text_answered || 'Нет данных' }}</p>
      <!-- Уведомление о копировании -->
      <div v-if="copySuccess" class="copy-notification">Скопировано!</div>
    </template>
    
    <!-- Если загадка не отвечена -->
    <template v-else>
      <!-- Используем HintSection -->
      <HintSection :riddle="riddle" @image-click="openImageModal" />
      <!-- Основной контент загадки (FileViewers) -->
       <ImageViewer 
        v-if="riddle.image_path && getFileType(riddle.image_path) === 'image'"
        :filePath="riddle.image_path"
        maxWidth="100%"
        additionalStyle="display: block; margin: 0 auto 20px;"
        @image-click="openImageModal"
        class="riddle-image" />
       <VideoPlayer
        v-else-if="riddle.image_path && getFileType(riddle.image_path) === 'video'"
        :filePath="riddle.image_path"
        maxWidth="100%"
        additionalStyle="display: block; margin: 0 auto 20px;"
        class="riddle-image" />
       <AudioPlayer
        v-else-if="riddle.image_path && getFileType(riddle.image_path) === 'audio'"
        :filePath="riddle.image_path"
        maxWidth="100%"
        additionalStyle="display: block; margin: 0 auto 20px;"
        class="riddle-image" />
       <TextViewer
        v-else-if="riddle.image_path && getFileType(riddle.image_path) === 'txt'"
        :filePath="riddle.image_path"
        additionalStyle="max-width: 100%; display: block; margin: 0 auto 20px;"
        class="riddle-image" />
       <GenericFileDownloader
        v-else-if="riddle.image_path"
        :filePath="riddle.image_path"
        maxWidth="100%"
        additionalStyle="display: block; margin: 0 auto 20px;"
        class="riddle-image" />
      
      <AnswerForm 
        :riddleId="riddle.id" 
        :disabled="questStore.checkingAnswer"
        :class="{ 'wrong-answer': showWrongAnswer }"
        @submit-answer="handleRiddleSubmit"
      />
    </template>
    
    <!-- Поле ввода для дополнительных данных (показываем если нужно) -->
    <AnswerForm 
      v-if="shouldShowInput(riddle)"
      :riddleId="riddle.id" 
      :disabled="questStore.checkingAnswer"
      :isAdditional="true"
      :class="{ 'wrong-answer': showWrongAnswer }"
      @submit-answer="handleRiddleSubmit"
    />
    

    
    <div v-if="riddle.has_insider_attempt" class="insider-badge">
      {{ riddle.has_additional_field ? 'Дополнительная загадка решена' : 'Отсканировано инсайдером' }}
    </div>

    <!-- Модальное окно для просмотра изображений -->
    <div v-if="showImageModal" class="image-modal" @click="closeImageModal">
      <div class="modal-content">
        <span class="modal-close" @click="closeImageModal">&times;</span>
        <img :src="modalImageSrc" class="modal-image" @click="closeImageModal">
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, getCurrentInstance } from 'vue';
import { useQuestStore } from '@/stores/quest';
import ImageViewer from './FileViewers/ImageViewer.vue'; // Импортируем ImageViewer
import VideoPlayer from './FileViewers/VideoPlayer.vue'; // Импортируем VideoPlayer
import AudioPlayer from './FileViewers/AudioPlayer.vue'; // Импортируем AudioPlayer
import TextViewer from './FileViewers/TextViewer.vue'; // Импортируем TextViewer
import GenericFileDownloader from './FileViewers/GenericFileDownloader.vue'; // Импортируем GenericFileDownloader
import AnswerForm from './AnswerForm.vue'; // Импортируем AnswerForm
import HintSection from './HintSection.vue'; // Импортируем HintSection

const props = defineProps({
  riddle: {
    type: Object,
    required: true
  }
});

const instance = getCurrentInstance();
const questStore = useQuestStore();

const showImageModal = ref(false);
const modalImageSrc = ref('');
const showWrongAnswer = ref(false);

// --- Логика копирования в буфер ---
const copySuccess = ref(false);
const tooltipText = ref('Нажмите, чтобы скопировать');

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
    .then(() => {
      copySuccess.value = true;
      tooltipText.value = 'Скопировано!'; // Меняем текст тултипа
      setTimeout(() => {
        copySuccess.value = false;
        tooltipText.value = 'Нажмите, чтобы скопировать'; // Возвращаем текст тултипа
      }, 2000);
    })
    .catch(err => {
      console.error('Ошибка при копировании: ', err);
      tooltipText.value = 'Ошибка копирования'; // Сообщаем об ошибке
      setTimeout(() => {
         tooltipText.value = 'Нажмите, чтобы скопировать'; // Возвращаем текст тултипа
      }, 2000);
    });
};

// --- Логика модального окна изображений ---
// openImageModal вызывается событием @image-click от ImageViewer
const openImageModal = (imgSrc) => {
  modalImageSrc.value = imgSrc;
  showImageModal.value = true;
  document.body.style.overflow = 'hidden';
};

const closeImageModal = () => {
  showImageModal.value = false;
  document.body.style.overflow = '';
};

const handleKeyDown = (event) => {
  if (event.key === 'Escape' && showImageModal.value) {
    closeImageModal();
  }
};

onMounted(() => {
  // Удаляем старый обработчик кликов на документе
  document.addEventListener('keydown', handleKeyDown); // Обработчик Escape оставляем
});

onUnmounted(() => {
  // Удаляем старый обработчик кликов на документе
  document.removeEventListener('keydown', handleKeyDown);
});

// --- Логика Загадок ---

const handleRiddleSubmit = async (answer) => {
  const riddleId = props.riddle.id; // Получаем ID из props
  
  try {
    const result = await questStore.checkAnswer(riddleId, answer); // Вызываем action
    
    if (result.isCorrect) {
      // Принудительно обновляем компонент после изменения данных
      await nextTick();
    } else if (result.isCorrect === false) {
      // Неправильный ответ - показываем красную обводку
      showWrongAnswer.value = true;
      setTimeout(() => {
        showWrongAnswer.value = false;
      }, 2000);
    } else {
      // Показываем ошибку в интерфейсе
      showWrongAnswer.value = true;
      setTimeout(() => {
        showWrongAnswer.value = false;
      }, 2000);
    }
  } catch (error) {
    // Показываем ошибку в интерфейсе
    showWrongAnswer.value = true;
    setTimeout(() => {
      showWrongAnswer.value = false;
    }, 2000);
  }
};

const isAnswered = (riddle) => {
  // Используем props.riddle внутри компоненты
  return riddle.text_answered || riddle.image_path_answered || riddle.geo_answered || riddle.has_insider_attempt;
};

const shouldShowInput = (riddle) => {
  // Поле ввода показываем, если требуется дополнительный ввод или есть дополнительное поле
  // НО НЕ показываем, если есть попытка инсайдера
  const shouldShow = (riddle.needsAdditionalInput || riddle.has_additional_field) && !riddle.has_insider_attempt;
  return shouldShow;
};

// --- Логика отображения файлов ---
const getFileType = (filePath) => {
   if (!filePath) return 'unknown';
  const extension = filePath.split('.').pop().toLowerCase();
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
  const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi'];
  const audioExtensions = ['mp3', 'wav', 'ogg', 'aac'];
  const documentExtensions = ['pdf', 'doc', 'docx', 'rtf'];
  
  if (imageExtensions.includes(extension)) return 'image';
  if (videoExtensions.includes(extension)) return 'video';
  if (audioExtensions.includes(extension)) return 'audio';
  if (extension === 'txt') return 'txt';
  if (documentExtensions.includes(extension)) return 'document';
  return 'unknown';
};

</script>

<style scoped>
/* Импортируем стили для копируемого поля */
@import '@/assets/styles/CopyFieldStyles.css';

/* Стили скопированы из QuestBlocks.vue, относящиеся к .riddle-block и его содержимому */
.riddle-block {
  border-radius: 15px;
  overflow: hidden;
  background-color: var(--white);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
}

.insider-visited {
  border: 4px solid var(--croc-green);
}

.riddle-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--croc-purple);
  margin-top: 0;
  margin-bottom: 8px;
  text-align: center;
  width: 100%;
}

/* Стили для ссылок внутри заголовка */
.riddle-title :deep(a) {
  color: var(--secondary-color, #4285f4); /* Используем переменную или запасной цвет */
  text-decoration: none; /* Оставляем подчеркивание для ясности */
}

.riddle-title :deep(a:hover) {
  /* Можно добавить стили для hover, например, изменение яркости */
  filter: brightness(0.8);
}

.riddle-text {
  margin: 5px 0;
  text-align: center;
  width: 100%;
}

.riddle-image {
  text-align: center;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  margin: 10px 0;
}

.riddle-image img {
  max-width: 90%;
  margin: 0 auto;
  border-radius: 8px;
}

.insider-badge {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 12px;
  margin-top: 10px;
  text-align: center;
  color: var(--croc-green);
  background-color: rgba(76, 175, 80, 0.1);
  border: 1px solid var(--croc-green);
}

.wrong-answer :deep(.answer-input) {
  border-color: #dc3545;
  background-color: #fff5f5;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}

/* Стили для иконки-ссылки инсайдера (одиночной или в контейнере) */
.insider-icon-link {
  display: inline-block; /* Изменяем на inline-block для размещения в flex */
  transition: transform 0.2s ease; /* Добавляем плавный переход для hover */
  padding: 4px 0; /* Объединенный отступ сверху и снизу */
}

/* Добавляем стиль для hover */
.insider-icon-link:hover {
  transform: scale(1.1); /* Немного увеличиваем иконку при наведении */
}

/* Стиль для изображения внутри ссылки инсайдера */
.insider-icon-link img {
  display: block; /* Убедимся, что отступ применяется корректно */
}

/* Новый контейнер для ссылок */
.insider-links-container {
  display: flex; /* Ставим иконки в ряд */
  justify-content: center; /* Центрируем по горизонтали */
  gap: 15px; /* Добавляем отступ между иконками */
  width: 100%; /* Занимаем всю ширину для центрирования */
}

/* Стили для модального окна изображения */
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Должно быть выше других элементов */
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes zoomIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.modal-content {
  position: relative;
  background-color: transparent;
  max-width: 90%;
  max-height: 90%;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: zoomIn 0.3s ease;
}

.modal-close {
  position: absolute;
  top: -40px; /* Позиционирование может потребовать подстройки */
  right: -40px;
  color: white;
  font-size: 36px;
  font-weight: bold;
  cursor: pointer;
  z-index: 1001;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
}

.modal-image {
  max-width: 100%;
  max-height: 90vh;
  width: auto;
  height: auto;
  object-fit: contain;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

/* Стили для уведомления о копировании (можно настроить) */
.copy-notification {
  margin-top: 10px;
  padding: 8px 12px;
  background-color: #e8f5e9; /* Светло-зеленый фон */
  color: #2e7d32; /* Темно-зеленый текст */
  border-radius: 4px;
  text-align: center;
  font-size: 14px;
  animation: fadeIn 0.3s, fadeOut 0.5s 1.5s; /* Анимация появления/исчезновения */
}

/* Анимации для уведомления */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

@media (max-width: 430px) {
  .riddle-block{
    padding: 10px 20px;
  }
}

</style> 