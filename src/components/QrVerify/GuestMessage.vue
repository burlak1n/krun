<template>
  <div class="guest-message message-container info-message">
    <p v-html="formattedMessage"></p>
  </div>
</template>

<script>
export default {
  name: 'GuestMessage',
  props: {
    message: {
      type: String,
      required: true
    }
  },
  computed: {
    formattedMessage() {
      // Проверяем, есть ли в сообщении текст о перенаправлении с числом
      if (this.message.includes('Перенаправление в профиль через')) {
        // Извлекаем число секунд из сообщения
        const match = this.message.match(/через (\d+) секунд/);
        if (match && match[1]) {
          const seconds = parseInt(match[1]);
          const baseMessage = this.message.split('Перенаправление')[0].trim();
          const redirectPart = `<div class="redirect-info">
            <span>Перенаправление в профиль через</span>
            <span class="counter-badge counter-blue">${seconds}</span>
            <span>секунд</span>
          </div>`;
          return `${baseMessage} ${redirectPart}`;
        }
      }
      return this.message;
    }
  }
}
</script>

<style scoped>
@import '@/assets/styles/CommonStyles.css';

.guest-message {
  margin-bottom: 15px;
}

.redirect-info {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 6px;
}

.counter-blue {
  background-color: #0c5460;
  color: #fff;
}
</style> 