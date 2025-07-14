<template>
  <div class="hint-main-container">
    <div class="hint-section">
      <button 
        @click="handleToggleClick"
        :class="['hint-button', {'active': riddle.has_hint}]"
        :id="`hint-button-${riddle.id}`"
        :disabled="questStore.requestingHint"
      >
        {{ $t('quest.hint.title') }}
      </button>
    </div>
    
    <!-- Используем v-show для управления видимостью через isHintVisible -->
    <div :id="`hint-container-${riddle.id}`" class="hint-container" v-show="isHintVisible">
      <!-- Отображаем контент подсказки, только если она есть (v-if) -->
       <template v-if="riddle.has_hint">
         <ImageViewer 
            v-if="getFileType(riddle.hint) === 'image'"
            :filePath="riddle.hint"
            maxWidth="100%"
            additionalStyle="border: 2px dashed #2196f3;"
            @image-click="emit('image-click', $event)" /> 
         <VideoPlayer
            v-else-if="getFileType(riddle.hint) === 'video'"
            :filePath="riddle.hint"
            maxWidth="100%"
            additionalStyle="border: 2px dashed #2196f3;" />
         <AudioPlayer
            v-else-if="getFileType(riddle.hint) === 'audio'"
            :filePath="riddle.hint"
            maxWidth="100%"
            additionalStyle="border: 2px dashed #2196f3;" />
         <TextViewer
            v-else-if="getFileType(riddle.hint) === 'txt'"
            :filePath="riddle.hint"
            additionalStyle="max-width: 100%; border: 2px dashed #2196f3;" />
         <GenericFileDownloader
            v-else
            :filePath="riddle.hint"
            maxWidth="100%"
            additionalStyle="border: 2px dashed #2196f3;" />
        </template>
        <!-- Если isHintVisible=true, но riddle.has_hint=false, значит идет загрузка -->
        <div v-else>Загрузка подсказки...</div>
    </div>

    <div :id="`hint-error-${riddle.id}`" class="hint-error"></div> <!-- Оставляем для ошибок запроса -->
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useQuestStore } from '@/stores/quest';
// Импортируем все FileViewer компоненты
import ImageViewer from './FileViewers/ImageViewer.vue'; 
import VideoPlayer from './FileViewers/VideoPlayer.vue';
import AudioPlayer from './FileViewers/AudioPlayer.vue';
import TextViewer from './FileViewers/TextViewer.vue'; 
import GenericFileDownloader from './FileViewers/GenericFileDownloader.vue';

const props = defineProps({
  riddle: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['image-click']); // Для проброса клика по картинке в подсказке

const questStore = useQuestStore();

const isHintVisible = ref(false); // Локальное состояние для видимости контейнера

// --- Логика Подсказок --- 

const requestHint = async () => {
  const riddleId = props.riddle.id;
  if (questStore.requestingHint) return; 
  
  // Показываем контейнер сразу (там будет "Загрузка...")
  isHintVisible.value = true;

  const hintButton = document.getElementById(`hint-button-${riddleId}`);
  if (hintButton) hintButton.disabled = true;

  try {
    const result = await questStore.requestHint(riddleId);
    if (result.ok && result.hint) {
      console.log(`Riddle ${riddleId}: Hint received!`);
      // isHintVisible уже true, контент обновится реактивно
    } else {
      // Если произошла ошибка (напр. нехватка монет), скрываем контейнер снова
      isHintVisible.value = false; 
      // Toast покажется из store
    }
  } catch (error) {
     isHintVisible.value = false; // Скрываем при ошибке
     // Toast покажется из store или requestHint
     console.error('Client-side error in requestHint:', error);
  } finally {
     if (hintButton) hintButton.disabled = false;
  }
};

// Функция toggleHint переименована в handleToggleClick для ясности
const handleToggleClick = () => {
  if (!props.riddle.has_hint) {
    if (confirm('Запросить подсказку? Это спишет монеты.')) {
        requestHint();
    }
  } else {
     // Если подсказка уже есть, просто переключаем видимость
     isHintVisible.value = !isHintVisible.value;
  }
};

// --- Логика Отображения файлов (getFileType) ---
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

// Следим за riddle.has_hint. Если подсказка появилась (после запроса),
// а контейнер еще не видим (на случай если пользователь его успел скрыть), показываем его.
watch(() => props.riddle.has_hint, (newValue) => {
  if (newValue && !isHintVisible.value) {
     isHintVisible.value = true;
  }
});

</script>

<style scoped>
/* Стили скопированы из RiddleCard.vue */
.hint-main-container { /* Добавлен контейнер для группировки */
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hint-section {
  margin:0;
  text-align: center;
  width: 100%;
}

.hint-button {
  font-family: 'Mont_SB';
  background-color: var(--croc-purple);
  color: var(--white);
  border: none;
  border-radius: 100px;
  padding: 16px 32px;
  cursor: pointer;
  font-size: 30px;
  transition: all 0.2s;
  width: 80%;
  max-width: 300px;
  margin: 0 auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 2px solid #e0e0e0;
}

.hint-button.active {
  background-color: var(--croc-deep-purple);
  color: var(--white);
}

.hint-button:hover:not(:disabled) {
  opacity: 0.9;
}

.hint-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.hint-container {
  /* display: none; больше не нужен, управляется v-show */
  margin: 10px auto;
  border-radius: 5px;
  width: 90%;
  max-width: 600px;
  /* Можно добавить стили для состояния загрузки, если нужно */
}

.hint-error {
  display: none;
  color: red;
  padding: 10px;
  border: 1px solid red;
  border-radius: 4px;
  margin: 10px 0;
  width: 90%;
  max-width: 600px;
  text-align: center;
}

@media (max-width: 430px) {
  .hint-button {
    font-size: 15px;
    padding: 12px 15px;
  }
  
}
</style> 