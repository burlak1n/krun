<template>
  <button @click="$emit('toggle')" class="edit-btn">
    <transition name="fade" mode="out-in">
      <img 
        v-if="!isEditing" 
        key="edit" 
        src="@/assets/images/edit-button-84380.svg" 
        alt="Редактировать" 
        class="edit-icon"
      >
      <img 
        v-else 
        key="verify" 
        src="@/assets/images/verification.svg" 
        alt="Подтвердить" 
        class="edit-icon"
      >
    </transition>
  </button>
</template>

<script>
export default {
  name: 'EditButton',
  props: {
    isEditing: {
      type: Boolean,
      default: false
    }
  },
  emits: ['toggle']
};
</script>

<style scoped>
.edit-btn {
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
}

.edit-icon {
  width: 20px;
  height: 20px;
  transition: all 0.2s ease;
}

.edit-btn:hover {
  transform: scale(1.1);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style> 