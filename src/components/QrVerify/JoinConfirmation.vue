<template>
  <div class="confirmation-box">
    <h3>Присоединиться к команде?</h3>
    <p>Вы хотите присоединиться к команде "{{ commandName }}", капитан: {{ captainName }}?</p>
    <button @click="$emit('join')" :disabled="isJoining" class="btn btn-join">Да, присоединиться</button>
    <button @click="$emit('cancel')" :disabled="isJoining" class="btn btn-cancel">Отмена</button>
  </div>
</template>

<script>
export default {
  name: 'JoinConfirmation',
  props: {
    commandName: {
      type: String,
      required: true
    },
    captainName: {
      type: String,
      required: true
    },
    isJoining: {
      type: Boolean,
      default: false
    }
  },
  emits: ['join', 'cancel']
}
</script>

<style scoped>
.confirmation-box {
  margin-top: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 15px;
  animation: fadeIn 0.5s;
}
.btn {
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 10px 15px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}
.btn:hover {
  opacity: 0.9;
}
.btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  opacity: 0.7;
}
.btn-join {
  background-color: #4CAF50;
}
.btn-cancel {
  background-color: #f44336;
}

/* Адаптивность для мобильных устройств */
@media (max-width: 480px) {
  .btn {
    width: 100%;
    margin: 5px 0;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style> 