/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        // Корневые файлы
        "./dist/index.html",
        "./public/index.html",
        "./src/assets/css/main.css",
        "./src/App.vue",
        "./src/main.js",
        
        // Компоненты
        "./src/components/Home/HomeHeader.vue",
        "./src/components/Home/HomeFooter.vue",
        "./src/components/Home/HomeFAQ.vue",
        "./src/components/Home/HomeParticipation.vue",
        "./src/components/Home/HomePartners.vue",
        "./src/components/Home/HomeStart.vue",
        "./src/components/Profile/ProfileMain.vue",
        "./src/components/Quest/QuestBlocks.vue",
        "./src/components/Registration/TelegramLogin.vue",
        "./src/components/UI/BaseButton.vue",
        "./src/components/UI/QuestBlock.vue",
        "./src/components/Home/Features.vue",
        
        // Страницы/Представления
        "./src/views/HomeView.vue",
        "./src/views/PreviousView.vue",
        "./src/views/ProfileView.vue",
        "./src/views/QuestView.vue",
        "./src/views/RegistrationView.vue",
        "./src/App.vue",
        
        // Стили
        "./src/assets/css/main.css",
        "./src/assets/css/variables.css",
        "./src/assets/css/utilities.css",
        
        // Скрипты
        "./src/utils/helpers.js",
        "./src/store/index.js"
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }