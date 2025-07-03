<template>
  <p id="status" :style="{ backgroundColor: statusColor }">{{ displayText }}</p>
</template>

<script>
export default {
  name: 'StatusDisplay',
  props: {
    statusText: {
      type: String,
      required: true
    },
    statusColor: {
      type: String,
      default: '#fff3cd' // Желтый фон по умолчанию
    }
  },
  computed: {
    displayText() {
      // Упрощаем отображаемый текст для стандартных состояний
      if (this.statusText.includes('Ошибка')) {
        return 'Ошибка';
      } else if (this.statusText.includes('успешно') || this.statusText.includes('Успешно')) {
        return 'Успешно';
      } else if (this.statusText.includes('Проверка')) {
        return 'Проверка...';
      } else if (this.statusText.includes('Присоединение')) {
        return 'Обработка...';
      }
      return this.statusText;
    }
  }
}
</script>

<style scoped>
#status {
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
  text-align: center;
  font-weight: bold;
}
</style> 