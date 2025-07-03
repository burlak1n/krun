<template>
  <div class="quest-block">
    <h3 class="quest-title">{{ title }}</h3>
    <div class="progress-bar">
      <div class="progress-fill" :style="{width: `${progress}%`}"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuestBlock',
  props: {
    title: {
      type: String,
      required: true
    },
    progress: {
      type: Number,
      default: 50
    }
  }
}
</script>

<style scoped>
.quest-block {
  background-color: #f3f3f3;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.quest-title {
  font-size: 20px;
  text-align: center;
  margin: 0 0 15px 0;
  color: #333;
  font-weight: 500;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #8ee3c0 0%, #6aaddb 50%, #8eb3e3 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}
</style> 