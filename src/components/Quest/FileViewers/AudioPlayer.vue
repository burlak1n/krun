<template>
  <audio 
    v-if="fullSrc"
    controls 
    :src="fullSrc" 
    :style="playerStyle"
    :type="audioType"
  >
    Ваш браузер не поддерживает аудио.
  </audio>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  filePath: {
    type: String,
    required: true,
  },
  maxWidth: {
    type: String,
    default: '100%',
  },
  additionalStyle: {
    type: String,
    default: '',
  },
});

const getExtension = (path) => path?.split('.').pop().toLowerCase() || '';

const fullSrc = computed(() => {
  if (!props.filePath) return null;
  return `/static/img/${props.filePath}`;
});

const audioType = computed(() => {
  const extension = getExtension(props.filePath);
  // Примерные типы, могут потребоваться дополнения
  if (extension === 'mp3') return 'audio/mpeg';
  if (extension === 'ogg') return 'audio/ogg';
  if (extension === 'wav') return 'audio/wav';
  if (extension === 'aac') return 'audio/aac';
  return 'audio/mpeg'; // Default 
});

const playerStyle = computed(() => {
  // Аудиоплеер обычно лучше растягивать на 100% ширины контейнера
  return `max-width: ${props.maxWidth}; width: 100%; ${props.additionalStyle}`;
});

</script>

<style scoped>
audio {
  display: block; 
  border-radius: 5px;
}
</style> 