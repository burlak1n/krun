<template>
  <div class="answer-form-container">
    <form @submit.prevent="onSubmit" class="answer-form">
      <input 
        v-model.trim="answerText" 
        :placeholder="props.isAdditional ? $t('quest.answerForm.additionalPlaceholder') : $t('quest.answerForm.placeholder')"
        required 
        class="answer-input" 
        :class="{ 'error': showError }"
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
    <div v-if="showError" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
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
  isAdditional: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['submit-answer']);

const answerText = ref('');
const showError = ref(false);
const errorMessage = ref('');

const onSubmit = () => {
  if (!props.disabled && answerText.value) {
    showError.value = false; // Сбрасываем ошибку при новом ответе
    emit('submit-answer', answerText.value);
    // Очищаем поле после отправки (можно сделать это в родительском компоненте при успехе)
    // answerText.value = ''; 
  }
};

// Метод для показа ошибки (будет вызываться из родительского компонента)
const showAnswerError = (message) => {
  showError.value = true;
  errorMessage.value = message;
  // Скрываем ошибку через 3 секунды
  setTimeout(() => {
    showError.value = false;
  }, 3000);
};

// Экспортируем метод для использования в родительском компоненте
defineExpose({
  showAnswerError
});
</script>

<style scoped>
/* Стили скопированы из RiddleCard.vue */
.answer-form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.answer-form {
  display: flex;
  flex-direction: row;
  gap: 5px;
  width: 90%;
  max-width: 600px;
  align-items: center;
}

.answer-input {
  font-family: 'Mont_SB';
  padding: 16px 32px; /* Устанавливаем верхний/нижний отступ 12px и левый/правый 4px */
  border: 2px solid var(--croc-purple);
  border-radius: 12px;
  font-size: 30px;
  width: 100%;
  text-align: center;
}

.answer-input::placeholder {
  font-size: clamp(8px, calc(1.5vw + 2.87px), 16px);
}

.answer-input:disabled {
   background-color: #eee;
}

.answer-input.error {
  border-color: #dc3545;
  background-color: #fff5f5;
}

.error-message {
  color: #dc3545;
  font-size: 14px;
  margin-top: 8px;
  text-align: center;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.submit-button {
  font-family: 'Mont_SB';
  background-color: var(--croc-deep-purple);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px 32px;
  cursor: pointer;
  font-size: 30px;
  transition: background-color 0.2s;
  white-space: nowrap;
}

.submit-button:hover:not(:disabled) {
  background-color: #3367d6;
}

.submit-button:disabled {
  background-color: var(--croc-purple);
  cursor: not-allowed;
}

@media (max-width: 430px) {
  .answer-input {
    padding: 8px 12px;
    font-size: 15px;
  }
  .submit-button {
    padding: 9px 25px;
    font-size: 15px;
  }
}
</style> 