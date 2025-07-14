<template>
  <div class="quest-page">
    <LogoComponent />
    <div class="container">
      <div class="stats-bar">
        <button @click="router.back()" class="back-btn">Назад</button>
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
.container {
  display: flex;
  flex-direction: column;
  gap: 54 px;
  width: 100%;
  max-width: 700px;
  align-items: center;
  justify-content: center;
  padding: 0 30px;
}
.quest-page {
  font-family: 'Mont_R';
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0 0 30px 0;
  /* background-image: url('@/assets/images/registration.svg'); */
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
  padding: 0px;
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 54px;
}

.stats-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 48px;
  padding: 24px 48px;
  background-color: var(--white);
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: auto;
  flex-wrap: wrap;
}

.stats-item {
  font-size: 24px;
  font-weight: 500;
  color: var(--text-color);
  padding: 0;
  font-family: 'Mont_R';
  max-width: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;

}

.qr-btn {
  background-color: var(--croc-purple);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px 32px;
  cursor: pointer;
  font-size: 24px;
  transition: background-color 0.2s ease;
}

.qr-btn:hover {
  box-shadow: 0px 0px 10px 0px #FFF;
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

.back-btn {
  background-color: var(--croc-green);
  color: var(--text-color);
  border: none;
  border-radius: 12px;
  padding: 16px 32px;
  cursor: pointer;
  font-size: 24px;
  transition: background-color 0.2s ease;
  margin: 0;
  display: block;
}

.back-btn:hover {
  box-shadow: 0px 0px 10px 0px #FFF;
}

/* Адаптивность для мобильных устройств */
@media (max-width: 768px) {
  .stats-bar {
    align-items: center;
    gap: 8px;
    padding: 10px;
  }
  
  .logo {
    font-size: 32px;
  }
}

@media (max-width: 430px) {
  .container {
    gap: 20px;
  }
  .stats-bar {
    padding: 10px;

  }
  .stats-item {
    font-size: 15px;
    max-width: 60px;
  }
  .container {
    padding: 0 10px;
    gap: 36px;
  }
  .back-btn {
    font-size: 15px;
    padding: 10px 15px;
  }
  .qr-btn {
    font-size: 15px;
    padding: 10px 15px;
  }
  .logo {
    font-size: 28px;
  }
  .quest-page h2 {
    font-size: 20px;
  }
}

@font-face {
  font-family: 'Involve';
  src: url('@/assets/fonts/Involve-Medium.ttf') format('truetype');
  font-weight: 500;
  font-style: normal;
}
</style> 