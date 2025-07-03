<template>
  <div class="action-buttons">
    <div class="button-group">
      <!-- Другие кнопки, если они есть -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'ActionButtons',
  props: {
    isOrganizer: {
      type: Boolean,
      default: false
    },
    commandName: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.action-buttons {
  margin: 15px 0;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9fa;
}

h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.action-btn {
  padding: 8px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background-color: #45a049;
}

.action-btn.danger {
  background-color: #e74c3c;
}

.action-btn.danger:hover {
  background-color: #c0392b;
}

@media (max-width: 480px) {
  .button-group {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
  }
}
</style> 