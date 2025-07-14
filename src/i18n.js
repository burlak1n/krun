import { createI18n } from 'vue-i18n'
import ru from './locales/ru.js'
import en from './locales/en.js'

const messages = {
  ru, en
}

// Обратите внимание на изменение настроек
const i18n = createI18n({
  legacy: true, // Используем режим совместимости с Vue 2 для простоты
  globalInjection: true, // Добавляем $t и другие методы глобально
  locale: 'ru', // Всегда используем русский язык
  fallbackLocale: 'ru', // Резервный язык тоже русский
  messages
})

export default i18n