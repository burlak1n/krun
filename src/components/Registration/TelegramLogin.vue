<template>
  <div class="telegram-login-wrapper">
    <!-- Сообщение об ошибке -->
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    
    <!-- Кнопка начала регистрации -->
    <button v-if="!showRegistrationForm" @click="startRegistration" class="register-button">
      {{ $t('telegramLogin.startRegistration') }}
    </button>
    
    <!-- Контейнер для виджета Telegram -->
    <div v-if="!showRegistrationForm" class="telegram-login-container">
      <div ref="telegramLogin"></div>
    </div>
    
    <!-- Форма завершения регистрации -->
    <div v-if="showRegistrationForm" class="registration-form-container">
      <form @submit.prevent="completeRegistration">
        <div class="form-group">
          <input type="text" id="full-name" v-model="fullName" :placeholder="$t('telegramLogin.fullName')" required>
        </div>
        
        <!-- Поля только для инсайдеров -->
        <div v-if="registrationType === 'insider'" class="insider-fields">
          <div class="form-group">
            <input type="text" id="student-organization" v-model="studentOrganization" :placeholder="$t('telegramLogin.studentOrganization') || 'Студенческая организация'" required>
          </div>
          <div class="form-group">
            <input type="text" id="geo-link" v-model="geoLink" :placeholder="$t('telegramLogin.geoLink') || 'Ссылка на 2ГИС'">
          </div>
        </div>
        
        <div class="button-container">
          <button type="submit" class="register-button">{{ $t('telegramLogin.register') }}</button>
        </div>
      </form>
    </div>
  </div>
</template>
  
<script>
export default {
  name: "TelegramLogin",
  data() {
    return {
      errorMessage: null,
      showRegistrationForm: false,
      fullName: '',
      studentOrganization: '',
      geoLink: '',
      telegramUserData: null,
      redirectUrl: null,
      registrationType: 'default'
    }
  },
  created() {
    // Получаем параметр redirect_url из URL, если он есть
    const urlParams = new URLSearchParams(window.location.search);
    this.redirectUrl = urlParams.get('redirect_url');
    
    // Проверяем, есть ли параметры авторизации Telegram в URL (при redirect)
    this.checkTelegramRedirect();
    
    // Проверяем сессию при загрузке компонента
    this.checkSession();
  },
  methods: {
    // Проверка параметров авторизации в URL после редиректа от Telegram
    checkTelegramRedirect() {
      // Ищем параметры авторизации Telegram в URL
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('id');
      const firstName = urlParams.get('first_name');
      const lastName = urlParams.get('last_name');
      const username = urlParams.get('username');
      const photoUrl = urlParams.get('photo_url');
      const authDate = urlParams.get('auth_date');
      const hash = urlParams.get('hash');
      
      // Если в URL есть все необходимые параметры, обрабатываем их
      if (id && firstName && authDate && hash) {
        const user = {
          id: parseInt(id, 10),
          first_name: firstName,
          last_name: lastName || null,
          username: username || null,
          photo_url: photoUrl || null,
          auth_date: parseInt(authDate, 10),
          hash: hash
        };
        
        // Обрабатываем данные пользователя
        this.onTelegramAuth(user);
      }
    },
    
    // Проверка существующей сессии
    async checkSession() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          // Если пользователь уже авторизован, перенаправляем на страницу redirect_url или в профиль
          if (this.redirectUrl) {
            window.location.href = this.redirectUrl;
          } else {
            this.$router.push('/profile');
          }
        }
      } catch (e) {
        // Если ошибка, просто продолжаем показ страницы регистрации
        console.log(this.$t('telegramLogin.noActiveSession'), e);
      }
    },
    
    // Отображение ошибкиd
    showError(message) {
      this.errorMessage = message;
      setTimeout(() => {
        this.errorMessage = null;
      }, 5000); // Скрываем ошибку через 5 секунд
    },
    
    // Начало регистрации (загрузка скрипта Telegram)
    startRegistration() {
      this.loadTelegramScript();
    },
    
    // Загрузка скрипта для виджета Telegram Login
    loadTelegramScript() {
      if (window.Telegram && window.Telegram.Login) {
        this.initTelegramWidget();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-widget.js?22";
      script.async = true;
      script.onload = this.initTelegramWidget;
      document.head.appendChild(script);
    },

    // Инициализация виджета Telegram Login
    initTelegramWidget() {
      if (!window.Telegram || !window.Telegram.Login) {
        this.showError(this.$t('telegramLogin.errorWidgetLoading'));
        return;
      }

      window.Telegram.Login.auth(
        {
          bot_id: process.env.VUE_APP_TELEGRAM_BOT_ID, // ID бота из переменных окружения
          request_access: "write",
          lang: this.$i18n?.locale || "ru",
          // Используем относительный URL для лучшей поддержки разных окружений
          return_to: window.location.origin + '/auth/telegram'
        },
        this.onTelegramAuth
      );
    },

    // Обработчик данных авторизации из Telegram
    async onTelegramAuth(user) {
      if (!user) {
        this.showError(this.$t('telegramLogin.errorUserData'));
        return;
      }
      
      console.log(`${this.$t('telegramLogin.loggedInAs')} ${user.first_name} ${user.last_name} (ID: ${user.id})`);
      this.telegramUserData = user;
      
      // Сохраняем URL фотографии в localStorage
      if (user.photo_url) {
        localStorage.setItem('telegramPhotoUrl', user.photo_url);
      }
      
      // Передаем данные пользователя родительскому компоненту
      this.$emit('auth', user);
      
      try {
        // Получаем параметры из URL
        const urlParams = new URLSearchParams(window.location.search);
        // Извлекаем код регистрации из параметров URL
        const registrationCode = urlParams.get('code');
        
        const res = await fetch('/api/auth/telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...user,
            registration_code: registrationCode
          })
        });
        
        const data = await res.json();
        
        if (!res.ok || !data.ok) {
          throw new Error(data.message || this.$t('telegramLogin.errorAuthentication'));
        }
        
        // Устанавливаем тип регистрации из ответа
        this.registrationType = data.registration_type || 'default';
        
        if (data.user.is_active) {
          // Если пользователь уже активен, перенаправляем в профиль или на указанный URL
          if (this.redirectUrl) {
            window.location.href = this.redirectUrl;
          } else {
            this.$router.push('/profile');
          }
        } else {
          // Иначе показываем форму для завершения регистрации
          this.showRegistrationForm = true;
        }
      } catch (error) {
        this.showError(error.message || this.$t('telegramLogin.errorDataProcessing'));
      }
    },
    
    // Завершение регистрации после заполнения формы
    async completeRegistration() {
      try {
        // Подготавливаем данные для отправки
        const registrationData = { full_name: this.fullName };
        
        // Если это инсайдер, добавляем дополнительные поля
        if (this.registrationType === 'insider') {
          registrationData.student_organization = this.studentOrganization;
          registrationData.geo_link = this.geoLink;
        }
        
        const res = await fetch('/api/auth/complete-registration', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(registrationData)
        });
        
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || this.$t('telegramLogin.errorCompleteRegistration'));
        }
        
        // Перенаправляем в профиль или на указанный URL после успешной регистрации
        if (this.redirectUrl) {
          window.location.href = this.redirectUrl;
        } else {
          this.$router.push('/profile');
        }
      } catch (error) {
        this.showError(error.message || this.$t('telegramLogin.errorCompleteRegistration'));
      }
    }
  }
};
</script>
  
<style scoped>
.telegram-login-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  padding: 0 10px;
}

.telegram-login-container {
  margin: 20px 0;
  width: 100%;
  display: flex;
  justify-content: center;
}

.register-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: #389ce9; /* Цвет Telegram */
  color: white;
  border: none;
  border-radius: 50px;
  padding: 12px 25px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
  max-width: 300px;
  box-sizing: border-box;
  margin: 0 auto;
}

.register-button:hover {
  background-color: #2d8ad9;
}

.button-container {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 20px;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 10px 15px;
  border-radius: 4px;
  margin-bottom: 15px;
  width: 100%;
  text-align: center;
  box-sizing: border-box;
}

.registration-form-container {
  width: 100%;
  max-width: 400px;
  box-sizing: border-box;
  padding: 0 15px;
}

.form-group {
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
}

.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
}

.form-group input::placeholder {
  color: #888;
}

.form-group input:focus {
  outline: none;
  border-color: #389ce9;
}

h2 {
  color: var(--hse-blue);
  margin-bottom: 20px;
  text-align: center;
}

.insider-fields {
  margin-bottom: 20px;
  width: 100%;
}

@media (max-width: 480px) {
  .registration-form-container {
    padding: 0 10px;
  }
  
  .form-group input {
    font-size: 14px;
  }
}
</style>
