<template>
  <span 
    v-if="role !== undefined" 
    class="role-badge" 
    :class="badgeClass"
  >
    {{ badgeText }}
  </span>
</template>

<script>
export default {
  name: 'RoleBadge',
  props: {
    role: {
      type: String,
      default: null // Используем null, чтобы отличить от пустой строки, если нужно
    }
  },
  computed: {
    badgeText() {
      if (this.role === 'ctc') return 'СтС';
      if (this.role === 'organizer') return 'Организатор';
      if (this.role === 'guest') return 'Гость';
      if (this.role === null || this.role === '') return 'нет роли'; // Отображаем 'нет роли' если роль null или пустая
      return this.role; // Отображаем само значение роли, если оно другое
    },
    badgeClass() {
      return {
        'role-ctc': this.role === 'ctc',
        'role-organizer': this.role === 'organizer', // Используем тот же стиль, что и ctc
        'role-default': !this.role || (this.role !== 'ctc' && this.role !== 'organizer')
      };
    }
  }
}
</script>

<style scoped>
.role-badge {
  font-size: 12px;
  padding: 3px 8px;
  border-radius: 12px;
  color: white;
  margin-left: 10px;
  vertical-align: middle;
  display: inline-block; /* Чтобы margin работал корректно */
}

.role-ctc,
.role-organizer { /* Применяем одинаковый стиль для ctc и organizer */
  background-color: #6f42c1; /* Фиолетовый фон */
  color: #ffc107; /* Желтый текст */
}

.role-default {
  background-color: #6c757d; /* Серый фон */
  color: white;
}
</style> 