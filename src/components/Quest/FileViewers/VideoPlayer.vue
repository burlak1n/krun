<template>
  <video 
    v-if="fullSrc"
    controls 
    :src="fullSrc" 
    :style="playerStyle"
    :type="videoType"
  >
    Ваш браузер не поддерживает видео.
  </video>
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

const videoType = computed(() => {
  const extension = getExtension(props.filePath);
  return extension ? `video/${extension}` : 'video/mp4'; // Default to mp4 if unknown
});

const playerStyle = computed(() => {
  return `max-width: ${props.maxWidth}; ${props.additionalStyle}`;
});

</script>

<style scoped>
video {
  display: block; 
  width: 100%; /* Заполняет контейнер по ширине до maxWidth */
  border-radius: 5px;
}
</style> 