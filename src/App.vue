<template>
  <div id="app" :class="{ 'home-route': isHomePage }">
    <Toast />
    <router-view />
  </div>
</template>

<script>
import { RouterView } from 'vue-router';
import Toast from 'primevue/toast';

export default {
  name: 'App',
  components: {
    Toast
  },
  computed: {
    isHomePage() {
      console.log('Текущий путь:', this.$route.path);
      return this.$route.path === '/' || this.$route.path === '';
    }
  }
}
</script>

<style>
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #122937;
}

#app {
  padding: 0;
  margin: 0;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Минимальная высота на весь экран */
  max-width: 100vw; 
}

#app.home-route {
  background-image: none !important;
}

/* Для маршрутов, отличных от главной страницы */
.quest-route #app,
.profile-route #app,
.registration-route #app,
.previous-route #app,
.qrVerify-route #app {
  background-image: url('@/assets/images/registration.svg') !important;
}

/* ... остальные стили ... */

/* PrimeVue Toast Overrides */
.p-toast {
  /* Убедимся, что тосты имеют адекватную ширину и не слишком широкие на больших экранах */
  width: 90%; 
  max-width: 450px; 
  opacity: 0.95; /* Небольшая прозрачность */
}

.p-toast .p-toast-message {
  border-radius: 8px; 
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: #122937; /* Добавляем фон (почти белый) */
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.p-toast .p-toast-message .p-toast-message-content {
  padding: 1rem; 
}

.p-toast .p-toast-message .p-toast-summary {
  font-size: 1.1rem; 
  font-weight: 600;
  color: #333; /* Цвет текста */
}

.p-toast .p-toast-message .p-toast-detail {
  font-size: 1rem; 
  margin-top: 0.5rem;
  color: #555; /* Цвет текста */
  word-wrap: break-word; /* Перенос длинных сообщений */
}

/* Опционально: Более явные границы для severity */
.p-toast .p-toast-message-info {
   border-left: 5px solid #2196F3;
}
.p-toast .p-toast-message-success {
   border-left: 5px solid #4CAF50;
}
.p-toast .p-toast-message-warn {
    border-left: 5px solid #FFC107;
}
.p-toast .p-toast-message-error {
    border-left: 5px solid #F44336;
}
</style>
