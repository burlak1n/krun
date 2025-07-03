<template>
  <img 
    v-if="fullSrc"
    :src="fullSrc" 
    :style="imageStyle" 
    alt="Riddle image"
    @click="handleClick"
  />
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

const emit = defineEmits(['image-click']);

const fullSrc = computed(() => {
  if (!props.filePath) return null;
  // Предполагаем, что файлы лежат в /static/img/
  // window.location.origin не всегда надежен, особенно при SSR или сложной конфигурации прокси.
  // Лучше использовать относительный путь, если baseURL API и статика настроены корректно.
  // Если префикс /static/img/ обязателен, убедитесь, что он доступен.
  return `/static/img/${props.filePath}`; 
});

const imageStyle = computed(() => {
  return `max-width: ${props.maxWidth}; cursor: pointer; ${props.additionalStyle}`;
});

const handleClick = () => {
  if (fullSrc.value) {
    emit('image-click', fullSrc.value);
  }
};
</script>

<style scoped>
img {
  display: block; /* Чтобы margin: auto работал, если нужно */
  /* Можно добавить базовые стили, если необходимо */
  border-radius: 5px; /* Пример */
}
</style> 