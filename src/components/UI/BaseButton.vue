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
      validator: value => ['primary', 'secondary', 'danger', 'success', 'outline'].includes(value)
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
  background-color: var(--hse-blue);
  color: #F3F3F3;
}

.base-button--primary:hover:not(:disabled) {
  background-color: #375890;
  color: #F3F3F3;
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

.base-button--success {
  background-color: #2ecc71;
  color: white;
}

.base-button--success:hover:not(:disabled) {
  background-color: #27ae60;
}

.base-button--outline {
  background-color: transparent;
  color: var(--hse-blue);
}

.base-button--outline:hover:not(:disabled) {
  background-color: rgba(67, 105, 172, 0.1);
}
</style> 