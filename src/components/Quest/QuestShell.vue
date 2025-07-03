<template>
  <div class="quest-page">
    <LogoComponent />
    <div class="container">
      <div class="stats-bar">
        <div class="stats-item">Счёт: {{ teamScore }}</div>
        <div class="stats-item">Монеты: {{ teamCoins }}</div>
        <button @click="showQrCode" class="qr-btn" :disabled="isLoadingQr">
          {{ isLoadingQr ? 'Загрузка...' : 'QR-код' }}
        </button>
      </div>
      
      <!-- Содержимое компонента будет отображаться через слот -->
      <slot></slot>
    </div>

    <!-- Модальное окно для QR-кода -->
    <div class="qr-modal" v-if="isQrModalVisible" @click="closeQrCode">
      <div class="qr-modal-content" @click.stop>
        <img :src="qrImageSrc" alt="QR Code">
        <p class="qr-modal-description">Покажите этот QR инсайдеру, чтобы отметить посещение</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useQrCode } from '@/composables/useQrCode'; 
import LogoComponent from '@/components/UI/LogoComponent.vue';

const props = defineProps({
  teamScore: {
    type: Number,
    default: 0
  },
  teamCoins: {
    type: Number,
    default: 0
  }
});

const { 
  isQrModalVisible, 
  qrImageSrc, 
  isLoadingQr, 
  showQrCode, 
  closeQrCode 
} = useQrCode();
</script>

<style scoped>
.quest-page {
  font-family: 'Involve', Arial, sans-serif;
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0 0 30px 0;
  background-image: url('@/assets/images/quest_bg.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
}

h1 {
  font-size: 28px;
  text-align: center;
  margin: 20px 0 5px;
  color: #333;
}

h2 {
  font-size: 24px;
  text-align: center;
  margin: 15px 0;
  color: #333;
}

h3 {
  font-family: 'Involve', Arial, sans-serif;
}

.back-link {
  color: #5570ff;
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 15px;
  display: inline-block;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: #3a4db3;
}

.container {
  position: relative;
  padding: 0 15px;
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.stats-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  padding: 10px 15px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: auto;
  flex-wrap: wrap;
}

.stats-item {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  padding: 5px 0;
}

.qr-btn {
  background-color: #444;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.qr-btn:hover {
  background-color: #333;
}

.qr-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.qr-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.qr-modal-content {
  background-color: white;
  padding: 25px;
  border-radius: 10px;
  text-align: center;
  max-width: 300px;
  width: 80%;
}

.qr-modal-content img {
  max-width: 350px;
  margin-bottom: 15px;
}

.qr-modal-description {
  max-width: 80%;
  margin: 0 auto;
  color: #555;
  font-size: 14px;
}

.close-btn {
  background-color: #4285f4;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s ease;
}

.close-btn:hover {
  background-color: #3367d6;
}

/* Адаптивность для мобильных устройств */
@media (max-width: 768px) {
  .stats-bar {
    align-items: center;
    gap: 10px;
    padding: 15px;
  }
  
  .logo {
    font-size: 32px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 10px;
  }
  
  .logo {
    font-size: 28px;
  }
}

@font-face {
  font-family: 'Involve';
  src: url('@/assets/fonts/Involve-Medium.ttf') format('truetype');
  font-weight: 500;
  font-style: normal;
}
</style> 