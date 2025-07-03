// src/main.js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
// import store from "./store"; // Удаляем импорт Vuex store
import i18n from './i18n';
import { createPinia } from 'pinia';
import { useSecurityStore } from './stores/security'; // Импортируем security store
// import PrimeVue from 'primevue/config'; // Не используем глобально
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast'; // Импортируем Toast
import axios from 'axios';
import './input.css'
import '@/assets/styles/phonk-sans.css'; // <-- Импорт стилей шрифта

// Импортируем только нужные компоненты для лучшей оптимизации
import UI from "./components/UI/index"
import { 
  HomeHeader, 
  HomeStart, 
  HomeParticipation,
  HomeFAQ,
  HomePartners,
  HomeFooter 
} from "./components/Home";
import ProfileMain from "./components/Profile/ProfileMain.vue";
import BaseButton from "./components/UI/BaseButton.vue";
import QuestBlocks from "./components/Quest/QuestBlocks.vue";
import TelegramLogin from "./components/Registration/TelegramLogin.vue";
import Skeleton from 'primevue/skeleton';

// Импортируем стили в последнюю очередь для оптимизации загрузки
import '@/assets/styles/variables.css';
import '@/assets/styles/main.css';
import '@/assets/styles/fonts.css';

// Добавляем безопасные заголовки для защиты от XSS
const securityHeaders = {
  "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;",
  "X-Content-Type-Options": "nosniff",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

// Функция для безопасной обработки XSS
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Создаем приложение
const app = createApp(App);

const pinia = createPinia();

// Настраиваем плагины
app.use(i18n);
// app.use(store); // Удаляем использование Vuex
app.use(pinia); // Pinia уже используется
app.use(router);
app.use(UI);
app.use(ToastService);

// Вызываем получение CSRF токена при инициализации
// Нужно делать это после инициализации Pinia
const securityStore = useSecurityStore();
securityStore.fetchCSRFToken();

// Глобальная защита от XSS
app.config.globalProperties.$sanitize = sanitizeInput;

// Обработка ошибок Vue
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue Error:', err);
  console.info('Vue Component:', vm);
  console.info('Error Info:', info);
};

// Регистрируем глобальные компоненты
app.component('HomeHeader', HomeHeader);
app.component('HomeStart', HomeStart);
app.component('HomeParticipation', HomeParticipation);
app.component('HomeFAQ', HomeFAQ);
app.component('HomePartners', HomePartners);
app.component('HomeFooter', HomeFooter);
app.component('ProfileMain', ProfileMain);
app.component('BaseButton', BaseButton);
app.component('QuestBlocks', QuestBlocks);
app.component('TelegramLogin', TelegramLogin);
app.component('Skeleton', Skeleton);
app.component('Toast', Toast); // Регистрируем Toast

// Монтируем приложение
app.mount('#app');

