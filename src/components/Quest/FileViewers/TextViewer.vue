<template>
  <div :style="viewerStyle" class="txt-content">
    <pre v-if="content">{{ content }}</pre>
    <div v-else-if="loading">Загрузка содержимого...</div>
    <div v-else-if="error">Ошибка загрузки: {{ error }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';

const props = defineProps({
  filePath: {
    type: String,
    required: true,
  },
  maxHeight: {
    type: String,
    default: '300px',
  },
   additionalStyle: {
    type: String,
    default: '',
  },
});

const content = ref(null);
const loading = ref(false);
const error = ref(null);

const fullSrc = computed(() => {
  if (!props.filePath) return null;
  return `/static/img/${props.filePath}`;
});

const viewerStyle = computed(() => {
  return `white-space: pre-wrap; overflow-x: auto; max-height: ${props.maxHeight}; overflow-y: auto; text-align: left; font-family: monospace; ${props.additionalStyle}`;
});

async function loadContent() {
  if (!fullSrc.value) return;
  
  loading.value = true;
  error.value = null;
  content.value = null;
  
  try {
    const response = await fetch(fullSrc.value);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    content.value = await response.text();
  } catch (err) {
    console.error("Error loading text file:", err);
    error.value = err.message || 'Не удалось загрузить файл';
  } finally {
    loading.value = false;
  }
}

// Загружаем при монтировании и при изменении пути
onMounted(loadContent);
watch(() => props.filePath, loadContent);

</script>

<style scoped>
.txt-content {
  padding: 10px;
  border: 1px solid #eee;
  background-color: #f9f9f9;
  border-radius: 5px;
}
pre {
  margin: 0; /* Убираем отступы по умолчанию у pre */
  font-family: inherit; /* Наследуем monospace из родителя */
}
</style> 