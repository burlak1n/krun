import { defineStore } from 'pinia';
import { useErrorStore } from './error'; // Импортируем стор ошибок

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
  }),
  getters: {
    // Pinia автоматически создает геттеры для состояния,
    // но можно определить и кастомные, если нужна сложная логика
    currentUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated,
  },
  actions: {
    // Мутация setUser из Vuex становится действием в Pinia
    setUser(user) {
      this.user = user;
      this.isAuthenticated = !!user;
    },
    // Действие logout из Vuex
    async logout() {
      const errorStore = useErrorStore(); // Получаем доступ к стору ошибок
      try {
        // Сначала очищаем состояние локально для быстрого UI отклика
        this.setUser(null); 
        // Затем отправляем запрос на сервер
        await fetch('/api/auth/logout', { method: 'POST' });
        // Если пользователь разлогинен, очищаем предыдущие ошибки, связанные с сессией
        errorStore.clearError(); 
      } catch (error) {
        console.error('Ошибка при выходе из системы:', error);
        // Устанавливаем ошибку через стор ошибок
        errorStore.setError('Ошибка при выходе из системы. Попробуйте обновить страницу.'); 
        // Можно опционально откатить состояние, если запрос не удался,
        // но в случае logout это обычно не требуется.
      }
    },
  },
}); 