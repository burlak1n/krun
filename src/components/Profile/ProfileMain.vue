<template>
  <div class="profile-main">
    <div v-if="isDataLoaded" class="profile-card">
      <div class="profile-avatar">
        <img :src="require('@/assets/images/default-avatar.png')" class="default-avatar" alt="Default Avatar">
        <img v-if="showUserAvatar" :src="userAvatar" class="user-avatar" alt="User Avatar">
      </div>
      
      <div class="profile-details">
        <h3 class="profile-name">{{ userName }}</h3>
        <p class="profile-username">@{{ userUsername }}</p>
        <p class="profile-team">{{ teamName }}</p>
      </div>
      
      <div id="qr-code-container" class="profile-qr" @click="showQrModal = true" v-if="qrCodeData">
        <img :src="'data:image/png;base64,' + qrCodeData.qr_image" alt="QR код">
      </div>
    </div>

    <div v-else class="loading-state">
      {{ $t('profile.error') }}...
    </div>
    
    <div class="qr-modal" v-if="showQrModal && qrCodeData" @click="showQrModal = false">
      <div class="qr-modal-content" @click.stop>
        <button class="close-btn" @click="showQrModal = false">&times;</button>
        <img :src="'data:image/png;base64,' + qrCodeData.qr_image" alt="QR код (увеличенный)">
        <p class="qr-modal-description">{{ $t('profile.qrdescription') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfileMain',
  props: {
    userData: {
      type: Object,
      required: true
    },
    qrCodeData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      showQrModal: false,
      isDataLoaded: false,
      telegramPhotoUrl: null,
      showUserAvatar: false
    };
  },
  computed: {
    
    userName() {
      return this.userData?.full_name || this.$t('profile.notSpecified');
    },
    userUsername() {
      return this.userData?.telegram_username || '';
    },
    userAvatar() {
      if (this.telegramPhotoUrl) {
        return this.telegramPhotoUrl;
      }
      if (this.userData?.avatar) {
        return this.userData.avatar;
      }
      return require('@/assets/images/default-avatar.png');
    },
    teamName() {
      if (this.userData?.role?.name === 'ctc') {
        return 'СтС';
      }
      if (this.userData?.role?.name === 'insider') {
        return this.$t('profile.insiderStatus') || 'Инсайдер';
      }
      if (this.userData?.commands && this.userData.commands.length > 0) {
        return this.userData.commands[0].name;
      }
      return this.$t('profile.noTeamShort');
    }
  },
  watch: {
    userData: {
      immediate: true,
      handler(newValue) {
        this.isDataLoaded = !!newValue && Object.keys(newValue).length > 0;
      }
    }
  },
  mounted() {
    // Проверяем наличие данных при монтировании
    this.isDataLoaded = !!this.userData && Object.keys(this.userData).length > 0;
    
    // Получаем URL фотографии из localStorage
    this.telegramPhotoUrl = localStorage.getItem('telegramPhotoUrl');
    
    // Проверяем доступность фото Telegram
    if (this.telegramPhotoUrl) {
      const img = new Image();
      img.onload = () => {
        // Фото загружено успешно - показываем аватар
        this.showUserAvatar = true;
      };
      img.onerror = () => {
        // Ошибка загрузки - сбрасываем URL
        console.log('Ошибка загрузки фото из Telegram');
        this.telegramPhotoUrl = null;
      };
      img.src = this.telegramPhotoUrl;
    } else if (this.userData?.avatar) {
      const img = new Image();
      img.onload = () => {
        // Фото из userData загружено успешно
        this.showUserAvatar = true;
      };
      img.onerror = () => {
        console.log('Ошибка загрузки фото из userData');
      };
      img.src = this.userData.avatar;
    }
  }
};
</script>

<style scoped>
@import './ProfileStyles.css';

/* Специфичные стили только для этого компонента */
.profile-main {
  margin: 0;
  display: inline;
}

.profile-card {
  display: flex;
  align-items: center;
  gap: 25px;
  margin: 0;
}

.profile-avatar {
  width: 150px;
  height: 150px;
  border-radius: 8%;
  overflow: hidden;
  position: relative;
  aspect-ratio: 1/1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-avatar .default-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}

.profile-avatar .user-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.profile-details {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 22px;
}

.profile-name {
  font-size: 22px;
  font-weight: 500;
  color: #333;
  margin: 0;
  white-space: normal;
  word-wrap: break-word;
  max-width: 350px;
}

.profile-username {
  font-size: 16px;
  color: var(--hse-blue);
  margin: 0;
}

.profile-team {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.profile-qr {
  max-width: 150px;
  max-height: 150px;
  min-width: 120px;
  min-height: 120px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.profile-qr img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.qr-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.qr-modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.qr-modal-description {
  margin-top: 15px;
  color: #666;
}

.loading-state {
  text-align: center;
  padding: 20px;
  color: #666;
}

@media (max-width: 768px) {
  .profile-card {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }
  
  .profile-avatar {
    width: 120px;
    height: 120px;
    min-width: 100px;
    min-height: 100px;
    border-radius: 20%;
    margin-right: 0;
    margin-bottom: 0;
  }

  .profile-name {
    font-size: 18px;
    white-space: wrap;
  }

  .profile-username {
    font-size: 16px;
  }
  
  .profile-details {
    margin-bottom: 15px;
    margin-top: 15px;
  }
  
  .profile-qr {
    max-width: 120px;
    max-height: 120px;
    min-width: 100px;
    min-height: 100px;
  }
}
</style>