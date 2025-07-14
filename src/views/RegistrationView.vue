<template>
  <div class="registration-container">
    <!-- <div class="background-image">
      <div class="color-overlay"></div>
    </div> -->
    <div class="registration-content">
      <!-- Логотип HSE Run -->
      <div class="logo">
        <LogoComponent />
      </div>
      
      <h1 class="registration-title">{{ $t('registration.title') }}</h1>
      <p class="registration-address">{{ $t('registration.address') }}</p>
      <TelegramLogin @auth="handleAuth" botName="hse_run_bot"/>
    </div>
  </div>
</template>

<script>
import TelegramLogin from "@/components/Registration/TelegramLogin.vue";
import LogoComponent from "@/components/UI/LogoComponent.vue";

export default {
  name: "RegistrationView",
  components: {
    TelegramLogin,
    LogoComponent
  },
  methods: {
    handleAuth(user) {
      console.log('Authenticated user:', user);
      // Сохраняем данные пользователя в локальное хранилище
      if (user) {
        // Сохраняем полные данные пользователя
        localStorage.setItem('telegramUser', JSON.stringify(user));
        
        // Сохраняем отдельные поля для удобства доступа
        localStorage.setItem('telegramUserId', user.id);
        localStorage.setItem('telegramUserName', user.first_name + (user.last_name ? ' ' + user.last_name : ''));
        
        if (user.photo_url) {
          localStorage.setItem('telegramPhotoUrl', user.photo_url);
        }
        
        // Можно добавить отображение процесса авторизации или другую логику
      }
    },
  }
};
</script>

<style scoped>
.registration-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  overflow: hidden;
  max-width: 100vw;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url('@/assets/images/registration.svg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 1;
  opacity: 1;
  margin: 0;
  padding: 0;
} 

.registration-content {
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  width: 100%;
  border-radius: 12px;
  padding: 48px;
  background-color: var(--white);
  gap: 48px;
}

.logo {
  margin: 0;
}

.registration-title {
  color: var(--text-color);
  font-size: 48px;
  font-weight: 300;
  text-align: center;
  font-family: 'Mont_SB';
  margin: 0;
}

.registration-address {
  color: var(--text-color);
  font-size: 24px;
  text-align: center;
  font-family: 'Mont_R';
  margin: 0;
}

:root {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

@media (max-width: 480px) {
  .registration-content {
    padding: 24px;
  }
  .registration-container {
    padding: 15px;
  }
  .img-logo {
    padding: 10px 25px;
    margin-bottom: 0;
  }

  .registration-title {
    font-size: 20px;
  }
  
  .registration-address {
    font-size: 20px;
  }
  
  .background-image {
    background-position: center;
    margin-left: 0;
    width: 100%;
  }
}
</style>