<template>
  <button 
    :type="type" 
    :class="[
      'base-button', 
      `base-button--${variant}`,
      { 'base-button--block': block }
    ]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: value => ['primary', 'secondary', 'danger', 'success', 'outline', 'register', 'start-quest'].includes(value)
    },
    type: {
      type: String,
      default: 'button'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    block: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.base-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.base-button--block {
  display: flex;
  width: 100%;
}

/* Варианты стилей кнопок */
.base-button--primary {
  background-color: var(--white);
  color: var(--text-color);
}

.base-button--primary:hover:not(:disabled) {
  background-color: #375890;
  color: #F3F3F3;
}

.base-button--primary:active:not(:disabled) {
  background-color: #2d4a73;
  transform: scale(0.98);
}

.base-button--secondary {
  background-color: #f3f3f3;
  color: #333;
}

.base-button--secondary:hover:not(:disabled) {
  background-color: #e5e5e5;
}

.base-button--danger {
  background-color: #e74c3c;
  color: white;
}

.base-button--danger:hover:not(:disabled) {
  background-color: #c0392b;
}

.base-button--register {
  background-color: var(--white);
  color: var(--text-color);
  border: none;
  border-radius: 12px;
  padding: 16px 32px;
  font-size: 30px;
  font-family: 'Mont_SB';
}

.base-button--register:hover:not(:disabled) {
  border-radius: 15px;
  box-shadow: 0px 0px 16px 0px #FFF;
}

.base-button--register:active:not(:disabled) {
  transform: scale(0.96);
  background-color: var(--croc-purple);
  color: var(--white);
}

.base-button--start-quest {
  background-color: var(--white);
  color: var(--text-color);
  border: none;
  border-radius: 12px;
  padding: 16px 32px;
  font-size: 30px;
  font-family: 'Mont_SB';
}

.base-button--start-quest:hover:not(:disabled) {
  border-radius: 15px;
  box-shadow: 0px 0px 16px 0px #FFF;
}

.base-button--start-quest:active:not(:disabled) {
  transform: scale(0.96);
  background-color: var(--croc-green);
}
@media (max-width: 480px) {
  .base-button--register {
  background-color: var(--white);
  color: var(--text-color);
  border: none;
  border-radius: 12px;
  padding: 10px 17px;
  font-size: 20px;
  font-family: 'Mont_SB';
}

.base-button--register:hover:not(:disabled) {
  border-radius: 15px;
  box-shadow: 0px 0px 16px 0px #FFF;
}

.base-button--register:active:not(:disabled) {
  transform: scale(0.96);
  background-color: var(--croc-purple);
  color: var(--white);
}

.base-button--start-quest {
  background-color: var(--white);
  color: var(--text-color);
  border: none;
  border-radius: 12px;
  padding: 10px 17px;
  font-size: 20px;
  font-family: 'Mont_SB';
}

.base-button--start-quest:hover:not(:disabled) {
  border-radius: 15px;
  box-shadow: 0px 0px 16px 0px #FFF;
}

.base-button--start-quest:active:not(:disabled) {
  transform: scale(0.96);
  background-color: var(--croc-green);
}
}
  

</style> 