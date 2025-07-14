// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ProfileView from "@/views/ProfileView.vue";
import PreviousView from "@/views/PreviousView.vue";
import RegistrationView from "@/views/RegistrationView.vue";
import QuestView from "@/views/QuestView.vue";
import BlocksView from "@/views/BlocksView.vue";
import QrVerifyView from "@/views/QrVerifyView.vue";
import PreviousEventsListView from "@/views/PreviousEventsListView.vue";
import PreviousEventAnswersView from "@/views/PreviousEventAnswersView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: { title: "Культурно-исторический квест по Москве" }
  },
  {
     path: "/quest",
     name: "quest",
     component: QuestView,
     meta: { title: "Прохождение квеста" /*, requiresActiveEvent: true*/ }
   },
  {
    path: "/quest/:id",
    name: "questBlock",
    component: BlocksView,
    meta: { title: "Блок квеста" /*, requiresActiveEvent: true*/ }
  },
   {
     path: "/profile",
     name: "profile",
     component: ProfileView,
     meta: { title: "Профиль" }
   },
   {
    path: "/previous/:event_name/stats",
    name: "previousEventStats",
    component: PreviousView,
    meta: { title: "Статистика события" }
  },
  {
    path: "/previous/:event_name/answers",
    name: "previousEventAnswers",
    component: PreviousEventAnswersView,
    meta: { title: "Ответы на квест" }
  },
  {
    path: "/registration",
    name: "registration",
    component: RegistrationView,
    meta: { title: "Регистрация на квест" }
  },
  {
    path: "/auth/telegram",
    name: "telegramAuth",
    component: RegistrationView,
    meta: { title: "Авторизация через Telegram" }
  },
  {
    path: "/qr/verify",
    name: "qrVerify",
    component: QrVerifyView,
    meta: { title: "QR-код" }
  },
  {
    path: "/admin/stats",
    name: "adminStats",
    beforeEnter: async (to, from, next) => {
      try {
        // Проверяем права пользователя
        const response = await fetch('/api/auth/me');
        if (!response.ok) {
          return next('/profile');
        }
        
        const userData = await response.json();
        if (!userData.role || userData.role.name !== 'organizer') {
          alert('Доступ запрещен. Требуются права организатора.');
          return next('/profile');
        }
        
        // Если пользователь - организатор, перенаправляем на страницу статистики
        // Используем прямой редирект с сохранением cookies
        window.location.href = '/admin/stats';
        return; // Предотвращаем выполнение next()
      } catch (error) {
        console.error('Ошибка при проверке прав доступа:', error);
        next('/profile');
      }
    },
    meta: { title: "Аналитика", requiresOrganizer: true }
  },
  {
    path: "/previous",
    name: "previousEventsList",
    component: PreviousEventsListView,
    meta: { title: "Прошедшие квесты" }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Update page title and check event status
router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title || "HSE RUN - Культурно-исторический квест";
  
  // Если путь /qr/verify - добавим обработку чтобы фронтенд обрабатывал этот маршрут
  if (to.path === '/qr/verify') {
    return next();
  }
  
  // ЗАКОММЕНТИРОВАНО ДЛЯ РАЗРАБОТКИ: Проверяем, требуется ли активный квест для маршрута
  /*
  if (to.meta.requiresActiveEvent) {
    try {
      const response = await fetch('/api/auth/event/status');
      const data = await response.json();
      
      if (!data.is_active) {
        // Если квест не активен, перенаправляем на главную
        alert('Квест ещё не начался или уже закончился');
        return next('/');
      }
    } catch (error) {
      console.error('Ошибка при проверке статуса события:', error);
      // При ошибке также перенаправляем на главную
      return next('/');
    }
  }
  */
  
  // Проверка прав организатора теперь выполняется в beforeEnter для /admin/stats
  next();
});

export default router;
