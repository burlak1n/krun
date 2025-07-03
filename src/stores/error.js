import { defineStore } from 'pinia';

export const useErrorStore = defineStore('error', {
  state: () => ({
    appError: null, // Состояние для хранения текущей ошибки
  }),
  getters: {
    // Геттер для проверки наличия ошибки
    hasError: (state) => state.appError !== null,
    // Геттер для получения текста ошибки
    errorMessage: (state) => state.appError,
  },
  actions: {
    // Действие для установки новой ошибки (аналог мутации setError)
    setError(error) {
      this.appError = error;
      // Опционально: можно добавить логирование ошибки здесь
      console.error("Global Error Set:", error);
    },
    // Действие для очистки ошибки (аналог мутации clearError)
    clearError() {
      this.appError = null;
    },
  },
}); 