<template>
  <div class="participant-list">
    <h3>Участники команды "{{ commandName }}" ({{ participants.length }}/6)</h3>
    <ul>
      <li 
        v-for="(participant, index) in participants" 
        :key="participant.id"
        :class="{ 'scanned-user': participant.id === scannedUserId }"
      >
        <div class="copy-field" @click="copyToClipboard(participant.full_name)">
          <strong>{{ index + 1 }}.</strong> {{ participant.full_name }}
          <span v-if="index === 0" class="crown">👑</span>
          <span class="tooltip">{{ tooltipText }}</span>
        </div>
      </li>
    </ul>
    <div v-if="copySuccess" class="copy-notification">Скопировано!</div>
  </div>
</template>

<script>
import { QrVerifyFieldsMixin } from '@/mixins/QrVerifyFieldsMixin';

export default {
  name: 'ParticipantList',
  mixins: [QrVerifyFieldsMixin],
  props: {
    participants: {
      type: Array,
      required: true
    },
    scannedUserId: {
      type: Number,
      default: null
    },
    commandName: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
@import '@/assets/styles/CopyFieldStyles.css';

.participant-list {
  margin-bottom: 15px;
  position: relative;
}

.crown {
  color: gold;
  margin-left: 5px;
}

ul {
  list-style: none;
  padding-left: 0;
}

li {
  margin-bottom: 2px;
}

li.scanned-user {
  background-color: #e9f5ff;
  border-radius: 3px;
  padding-left: 5px;
  margin-left: -5px;
}
</style> 