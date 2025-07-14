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
    
    // ДИАГНОСТИКА: Проверяем переменные окружения
    console.log('=== ДИАГНОСТИКА ПЕРЕМЕННЫХ ОКРУЖЕНИЯ ===');
    console.log('process.env.VUE_APP_TELEGRAM_BOT_ID:', process.env.VUE_APP_TELEGRAM_BOT_ID);
    console.log('process.env.NODE_ENV:', process.env.NODE_ENV);
    console.log('window.location.origin:', window.location.origin);
    console.log('window.location.href:', window.location.href);
    console.log('==========================================');
    
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
    
    // Проверка доступности бота
    async checkBotAvailability() {
      const botId = process.env.VUE_APP_TELEGRAM_BOT_ID;
      if (!botId) {
        console.error('Bot ID не определен');
        return false;
      }
      
      try {
        // Проверяем доступность бота через Telegram API
        const response = await fetch(`https://api.telegram.org/bot${botId}/getMe`);
        const data = await response.json();
        
        if (data.ok) {
          console.log('Бот доступен:', data.result);
          return true;
        } else {
          console.error('Бот недоступен:', data);
          return false;
        }
      } catch (error) {
        console.error('Ошибка проверки бота:', error);
        return false;
      }
    },
    
    // Начало регистрации (загрузка скрипта Telegram)
    async startRegistration() {
      console.log('=== ОТЛАДКА TELEGRAM LOGIN ===');
      console.log('process.env.VUE_APP_TELEGRAM_BOT_ID:', process.env.VUE_APP_TELEGRAM_BOT_ID);
      console.log('window.location.origin:', window.location.origin);
      console.log('window.location.href:', window.location.href);
      console.log('==============================');
      
      // Проверяем доступность бота
      const botAvailable = await this.checkBotAvailability();
      if (!botAvailable) {
        this.showError('Бот недоступен. Обратитесь к администратору.');
        return;
      }
      
      this.loadTelegramScript();
    },
    
    // Загрузка скрипта для виджета Telegram Login
    loadTelegramScript() {
      console.log('Загрузка скрипта Telegram...');
      console.log('VUE_APP_TELEGRAM_BOT_ID:', process.env.VUE_APP_TELEGRAM_BOT_ID);
      
      if (window.Telegram && window.Telegram.Login) {
        console.log('Telegram API уже загружен');
        this.initTelegramWidget();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-widget.js?22";
      script.async = true;
      script.onload = () => {
        console.log('Скрипт Telegram загружен');
        this.initTelegramWidget();
      };
      script.onerror = (error) => {
        console.error('Ошибка загрузки скрипта Telegram:', error);
        this.showError('Ошибка загрузки скрипта Telegram. Попробуйте обновить страницу.');
      };
      
      // Добавляем таймаут для случая, когда скрипт зависает
      setTimeout(() => {
        if (!window.Telegram || !window.Telegram.Login) {
          console.error('Таймаут загрузки скрипта Telegram');
          this.showError('Таймаут загрузки скрипта Telegram. Проверьте интернет-соединение.');
        }
      }, 10000); // 10 секунд
      
      document.head.appendChild(script);
    },

    // Инициализация виджета Telegram Login
    initTelegramWidget() {
      console.log('Инициализация виджета Telegram...');
      console.log('window.Telegram:', window.Telegram);
      console.log('window.Telegram.Login:', window.Telegram?.Login);
      
      if (!window.Telegram || !window.Telegram.Login) {
        console.error('Telegram API не доступен');
        this.showError(this.$t('telegramLogin.errorWidgetLoading'));
        return;
      }

      const botId = process.env.VUE_APP_TELEGRAM_BOT_ID;
      // Используем текущий URL как fallback, если origin не определен
      const returnUrl = window.location.origin 
        ? window.location.origin + '/auth/telegram'
        : window.location.protocol + '//' + window.location.host + '/auth/telegram';
      
      console.log('Bot ID:', botId);
      console.log('Return URL:', returnUrl);
      console.log('Current location:', window.location.href);

      try {
        window.Telegram.Login.auth(
          {
            bot_id: botId, // ID бота из переменных окружения
            request_access: "write",
            lang: this.$i18n?.locale || "ru",
            // Используем относительный URL для лучшей поддержки разных окружений
            return_to: returnUrl
          },
          this.onTelegramAuth
        );
        console.log('Виджет Telegram инициализирован успешно');
      } catch (error) {
        console.error('Ошибка инициализации виджета Telegram:', error);
        this.showError('Ошибка инициализации виджета Telegram: ' + error.message);
      }
    },

    // Обработчик данных авторизации из Telegram
    async onTelegramAuth(user) {
      console.log('Получены данные от Telegram:', user);
      
      if (!user) {
        console.error('Нет данных пользователя от Telegram');
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
  padding: 0;
}

.telegram-login-container {
  margin:0;
  width: 100%;
  display: flex;
  justify-content: center;
}

.register-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--croc-purple); /* Цвет Telegram */
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px 32px;
  font-size: 30px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
  box-sizing: border-box;
  margin: 0;
}

.register-button:hover {
  background-color: var(--croc-deep-purple);
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
  .register-button {
    padding: 10px 15px;
    font-size: 18px;
  }
}
</style>
