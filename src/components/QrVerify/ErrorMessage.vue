<template>
  <div class="error-container message-container error-message">
    <p class="error-text">{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: 'ErrorMessage',
  props: {
    message: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
@import '@/assets/styles/CommonStyles.css';

.error-text {
  margin: 0;
}
</style> 