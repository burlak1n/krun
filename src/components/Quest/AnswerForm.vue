<template>
  <form @submit.prevent="onSubmit" class="answer-form">
    <input 
      v-model.trim="answerText" 
      :placeholder="$t('quest.answerForm.placeholder')"
      required 
      class="answer-input" 
      :disabled="disabled"
    >
    <button 
      type="submit" 
      class="submit-button" 
      :disabled="disabled || !answerText"
    >
      Ок
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  riddleId: {
    type: Number,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['submit-answer']);

const answerText = ref('');

const onSubmit = () => {
  if (!props.disabled && answerText.value) {
    emit('submit-answer', answerText.value);
    // Очищаем поле после отправки (можно сделать это в родительском компоненте при успехе)
    // answerText.value = ''; 
  }
};
</script>

<style scoped>
/* Стили скопированы из RiddleCard.vue */
.answer-form {
  display: flex;
  flex-direction: row;
  gap: 5px;
  width: 90%;
  max-width: 600px;
  align-items: center;
}

.answer-input {
  font-family: 'Involve', Arial, sans-serif;
  padding: 12px 4px; /* Устанавливаем верхний/нижний отступ 12px и левый/правый 4px */
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  width: 100%;
  text-align: center;
}

.answer-input::placeholder {
  font-size: clamp(8px, calc(1.5vw + 2.87px), 16px);
}

.answer-input:disabled {
   background-color: #eee;
}

.submit-button {
  font-family: 'Involve', Arial, sans-serif;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 15px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
  white-space: nowrap;
}

.submit-button:hover:not(:disabled) {
  background-color: #3367d6;
}

.submit-button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}
</style> 