<template>
  <div class="user-info">
    <h3 class="user-info-header">
      <span>Информация о пользователе</span>
      <RoleBadge :role="user.role" />
    </h3>
    <div 
      v-for="field in fields" 
      :key="field.key" 
      class="copy-field" 
      @click="copyToClipboard(getFieldValue(field, user))"
    >
      <strong>{{ field.label }}:</strong> {{ getFieldValue(field, user) }}
      <span class="tooltip">{{ tooltipText }}</span>
    </div>
    <div v-if="copySuccess" class="copy-notification">Скопировано!</div>
  </div>
</template>

<script>
import { QrVerifyFieldsMixin } from '@/mixins/QrVerifyFieldsMixin';
import RoleBadge from './RoleBadge.vue';

export default {
  name: 'UserInfo',
  mixins: [QrVerifyFieldsMixin],
  components: {
    RoleBadge
  },
  props: {
    user: {
      type: Object,
      required: true
    },
    scannerRole: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      fields: [
        { key: 'id', label: 'ID' },
        { key: 'full_name', label: 'Имя' },
        { key: 'telegram_id', label: 'Telegram ID' },
        { key: 'telegram_username', label: 'Telegram Username', defaultValue: 'Не указано' }
      ]
    };
  }
}
</script>

<style scoped>
@import '@/assets/styles/CopyFieldStyles.css';

.user-info {
  margin-bottom: 15px;
  position: relative;
}

/* Стили для заголовка, чтобы разнести текст и значок */
.user-info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px; /* Восстанавливаем отступ снизу */
  border-radius: 4px; /* Слегка скругляем углы */
  transition: background-color 0.3s, color 0.3s; /* Плавный переход */
}

/* Удаляем стили для значка роли, т.к. они теперь в RoleBadge.vue */
/*
.role-badge {
  ...
}
.role-ctc { 
  ...
}
.role-organizer {
  ...
}
.role-default {
  ...
}
*/
</style> 