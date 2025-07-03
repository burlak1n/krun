import { defineStore } from 'pinia';

export const useSecurityStore = defineStore('security', {
  state: () => ({
    // xssProtection из Vuex был просто флагом, не использовался в действиях/геттерах,
    // поэтому пока не переносим. Если он нужен, его можно добавить.
    csrfToken: null, 
  }),
  getters: {
    // Геттер для токена
    getCSRFToken: (state) => state.csrfToken,
  },
  actions: {
    // Мутация setCSRFToken становится частью действия fetchCSRFToken
    // Действие fetchCSRFToken из модуля Vuex
    async fetchCSRFToken() {
      // Предотвращаем повторный запрос, если токен уже есть
      if (this.csrfToken) {
        return;
      }
      try {
        const response = await fetch('/api/csrf-token');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        this.csrfToken = data.token; // Прямое изменение состояния
      } catch (error) {
        console.error('Ошибка при получении CSRF-токена:', error);
        // Здесь можно вызвать setError из errorStore, если это критическая ошибка
        // import { useErrorStore } from './error';
        // const errorStore = useErrorStore();
        // errorStore.setError('Не удалось получить токен безопасности.');
      }
    },
  },
}); 