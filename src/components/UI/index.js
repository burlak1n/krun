import BaseButton from './BaseButton.vue'
import QuestBlock from './QuestBlock.vue'

// Автоматическая регистрация компонентов
export default {
  install(app) {
    app.component('BaseButton', BaseButton)
    app.component('QuestBlock', QuestBlock)
  }
}

// Экспорт для ручной регистрации
export {
  BaseButton
}