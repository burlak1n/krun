<template>
  <div class="command-info">
    <h3>Информация о команде</h3>
    <div 
      v-for="field in fields" 
      :key="field.key" 
      class="copy-field" 
      @click="copyToClipboard(getFieldValue(field, command))"
    >
      <strong>{{ field.label }}:</strong> {{ getFieldValue(field, command) }}
      <span class="tooltip">{{ tooltipText }}</span>
    </div>
    <div v-if="copySuccess" class="copy-notification">Скопировано!</div>
  </div>
</template>

<script>
import { QrVerifyFieldsMixin } from '@/mixins/QrVerifyFieldsMixin';

export default {
  name: 'CommandInfo',
  mixins: [QrVerifyFieldsMixin],
  props: {
    command: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      fields: [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Название' },
        { key: 'event_id', label: 'ID события' }
      ]
    };
  }
}
</script>

<style scoped>
@import '@/assets/styles/CopyFieldStyles.css';

.command-info {
  margin-bottom: 15px;
  position: relative;
}
</style> 