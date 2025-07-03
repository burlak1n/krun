<template>
  <div :style="downloaderStyle">
    <a :href="fullSrc" target="_blank" class="download-link">
      <div class="icon">📄</div>
      <div class="text">Открыть файл: {{ fileName }}</div>
    </a>
  </div>
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

const fullSrc = computed(() => {
  if (!props.filePath) return null;
  return `/static/img/${props.filePath}`;
});

const fileName = computed(() => {
  return props.filePath?.split('/').pop() || props.filePath;
});

const downloaderStyle = computed(() => {
  return `max-width: ${props.maxWidth}; padding: 15px; border: 1px solid #ddd; border-radius: 5px; text-align: center; ${props.additionalStyle}`;
});

</script>

<style scoped>
.download-link {
  text-decoration: none; 
  color: #2196f3;
  display: inline-block;
}
.icon {
  font-size: 48px; 
  margin-bottom: 10px;
}
.text {
  font-size: 14px;
  word-break: break-all; /* Перенос длинных имен файлов */
}
</style> 