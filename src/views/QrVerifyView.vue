<template>
  <div class="qr-page">
    <LogoComponent />
    
    <div class="container">
      <StatusDisplay :status-text="statusText" :status-color="statusColor" />
      
      <!-- Контейнер с результатами, только для ролей с контентом внутри -->
      <div v-if="qrData && (isOrganizer || isCtc || isInsider)" class="result-container">

        <!-- Блоки действий (сразу после статуса) -->
        <!-- Отметка посещения инсайдером, организатором или ctc (если есть задачи) -->
        <InsiderAttendanceMarker 
          v-if="((isInsider || isOrganizer) || (isCtc && scannerTasks.length > 0)) && qrData.user && qrData.command"
          :scannedUserId="qrData.user.id"
          :scannedUserName="qrData.user.full_name"
          :scannedCommandId="qrData.command.id"
          :scannedCommandName="qrData.command.name"
        />

        <!-- Управление баллами (для ctc, organizer и insider) -->
        <ProgramScore 
          v-if="isCtc || isOrganizer" 
          :userId="qrData.user.id"
          :userName="qrData.user.full_name"
          :token="token"
          :initialScore="qrData.program?.total_score || 0"
          :role="qrData.scanner_role"
          @score-updated="updateScore"
          :user-role="qrData.user?.role"
        />

        <!-- Информационные блоки (ниже действий) -->
        <!-- Для организаторов, инсайдеров и ctc -->
        <ParticipantList 
          v-if="isOrganizer || isInsider || isCtc" 
          :participants="qrData.command.participants" 
          :scannedUserId="qrData.user.id"
          :commandName="qrData.command.name"
        />
        <!-- Информация о пользователе (только для организаторов) -->
        <UserInfo 
          v-if="isOrganizer" 
          :user="qrData.user" 
          :scanner-role="qrData.scanner_role"
        />
        
        <!-- Информация о команде (только для организаторов) -->
        <CommandInfo 
          v-if="isOrganizer" 
          :command="qrData.command" 
        />
      </div>
      
      <!-- Сообщение для гостя (не показываем инсайдерам и ctc) -->
      <GuestMessage 
        v-if="guestMessage && !isInsider && !isCtc" 
        :message="guestMessage" 
      />
      
      <!-- Подтверждение присоединения -->
      <JoinConfirmation 
        v-if="showJoinBox" 
        :command-name="qrData.command_name" 
        :captain-name="qrData.captain_name"
        :is-joining="isJoining"
        @join="joinTeam"
        @cancel="cancelJoin"
      />
      
      <!-- Сообщение об ошибке -->
      <ErrorMessage 
        v-if="errorMessage" 
        :message="errorMessage"
      />
    </div>
  </div>
</template>

<script>
import { qrAPI, teamAPI } from '@/api';
import UserInfo from '@/components/QrVerify/UserInfo.vue';
import CommandInfo from '@/components/QrVerify/CommandInfo.vue';
import ParticipantList from '@/components/QrVerify/ParticipantList.vue';
import ActionButtons from '@/components/QrVerify/ActionButtons.vue';
import JoinConfirmation from '@/components/QrVerify/JoinConfirmation.vue';
import ErrorMessage from '@/components/QrVerify/ErrorMessage.vue';
import GuestMessage from '@/components/QrVerify/GuestMessage.vue';
import StatusDisplay from '@/components/QrVerify/StatusDisplay.vue';
import LogoComponent from '@/components/UI/LogoComponent.vue';
import ProgramScore from '@/components/QrVerify/ProgramScore.vue';
import InsiderAttendanceMarker from '@/components/QrVerify/InsiderAttendanceMarker.vue';

export default {
  name: 'QrVerifyView',
  components: {
    UserInfo,
    CommandInfo,
    ParticipantList,
    ActionButtons,
    JoinConfirmation,
    ErrorMessage,
    GuestMessage,
    StatusDisplay,
    LogoComponent,
    ProgramScore,
    InsiderAttendanceMarker
  },
  data() {
    return {
      token: null,
      qrData: null,
      statusText: 'Проверка токена...',
      statusColor: '#fff3cd', // Желтый фон
      errorMessage: null,
      guestMessage: null,
      showJoinBox: false,
      isJoining: false,
      redirectTimeout: null,
      redirectCounter: 5,
      redirectInterval: null,
      scannerTasks: [] // Добавляем для хранения задач сканера (если ctc)
    }
  },
  computed: {
    isOrganizer() {
      return this.qrData && this.qrData.scanner_role === 'organizer';
    },
    isInsider() {
      return this.qrData && this.qrData.scanner_role === 'insider';
    },
    isCtc() {
      return this.qrData && this.qrData.scanner_role === 'ctc';
    }
  },
  created() {
    // Получаем токен из URL
    this.token = this.$route.query.token;
    if (!this.token) {
      this.statusText = 'Ошибка: Токен отсутствует';
      this.statusColor = '#f8d7da'; // Красный фон
      this.errorMessage = 'Токен не был найден в URL. Пожалуйста, убедитесь, что вы используете правильную ссылку или QR-код.';
    } else {
      this.verifyToken();
    }
  },
  beforeDestroy() {
    // Очищаем все таймеры при уничтожении компонента
    this.clearRedirectTimers();
  },
  methods: {
    // Очистка таймеров перенаправления
    clearRedirectTimers() {
      if (this.redirectTimeout) {
        clearTimeout(this.redirectTimeout);
        this.redirectTimeout = null;
      }
      
      if (this.redirectInterval) {
        clearInterval(this.redirectInterval);
        this.redirectInterval = null;
      }
    },
    
    async verifyToken() {
      if (!this.token) return;
      
      try {
        // Показываем состояние загрузки
        this.statusText = 'Проверка токена...';
        this.statusColor = '#fff3cd'; // Желтый фон
        this.errorMessage = null;
        this.guestMessage = null;
        this.showJoinBox = false;

        // Используем qrAPI для проверки токена
        const response = await qrAPI.verify(this.token);
        
        // В случае успешной верификации
        if (response.data.ok) {
          this.handleSuccessfulVerification(response.data);
        } else {
          // Проверяем сообщение об ошибке
          if (response.data.message === "Недостаточно прав для проверки QR-кода") {
            // Для гостевых пользователей делаем дополнительный запрос с простой структурой
            await this.handleGuestVerification(this.token);
          } else {
            // В случае других ошибок от сервера
            this.handleServerErrorMessage(response.data);
          }
        }
      } catch (error) {
        console.error('Произошла ошибка при выполнении запроса:', error);
        
        // Настраиваем отображение ошибки
        this.statusText = 'Ошибка';
        this.statusColor = '#f8d7da'; // Красный фон
        
        // Получаем данные ответа, если они есть
        const responseData = error.response?.data;
        
        // Если сообщение "Недостаточно прав для проверки QR-кода"
        if (responseData?.message === "Недостаточно прав для проверки QR-кода") {
          await this.handleGuestVerification(this.token);
          return;
        }
        
        // Если ошибка 403 - требуется авторизация
        if (error.response?.status === 403) {
          this.handleAuthRequired();
          return;
        }
        
        // Если ошибка 401 - недействительный QR-код
        if (error.response?.status === 401) {
          this.statusText = 'Ошибка QR-кода';
          this.errorMessage = responseData?.detail || 
            'Срок действия ссылки истек или QR-код недействителен. Пожалуйста, получите новую ссылку в профиле.';
          return;
        }
        
        // Если это 500 ошибка - серверная ошибка
        if (error.response?.status === 500) {
          this.errorMessage = 'Произошла ошибка на сервере. Пожалуйста, обратитесь к организаторам.';
          return;
        }
        
        // Для других ошибок
        this.errorMessage = 'Произошла ошибка при обработке запроса. Пожалуйста, попробуйте позже.';
      }
    },
    
    // Новый метод для обработки верификации гостевых пользователей
    async handleGuestVerification(token) {
      try {
        // Прямой запрос для получения данных без проверки ролей
        const response = await fetch('/api/auth/qr/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.ok) {
          // Заполняем необходимые данные для отображения приглашения
          this.qrData = {
            can_join: result.can_join,
            join_reason: result.join_reason,
            command_name: result.command_name,
            captain_name: result.captain_name,
            token: result.token,
            message: result.message
          };
          
          this.statusText = 'Успешно';
          this.statusColor = '#d4edda'; // Зеленый фон
          
          // Определяем тип отображения для гостя
          this.determineUserView();
        } else {
          this.handleServerErrorMessage(result);
        }
      } catch (error) {
        console.error('Ошибка при получении данных для гостя:', error);
        this.statusText = 'Ошибка';
        this.statusColor = '#f8d7da'; // Красный фон
        this.errorMessage = 'Произошла ошибка при обработке QR-кода. Пожалуйста, попробуйте позже.';
      }
    },
    
    handleSuccessfulVerification(result) {
      this.statusText = 'Успешно';
      this.statusColor = '#d4edda'; // Зеленый фон
      
      // Сохраняем результат
      this.qrData = result;
      
      // Определяем, какое отображение показать
      this.determineUserView();
      
      // Если сканер - ctc, загружаем его статус (задачи)
      if (this.isCtc) { // Используем computed property
        this.fetchScannerStatus(); // Вызываем переименованный метод
      }
      
      // Обработка для роли ctc
      if (result.scanner_role === 'ctc') {
        // Успешная верификация для ctc
        this.statusText = 'QR-код подтвержден';
        this.statusColor = '#d4edda'; // Зеленый фон
        
        // Обработка результата
        this.qrData = result;
      }
      
      // Проверяем наличие баллов для organizer
      if (result.scanner_role === 'organizer' && !result.program) {
        // Если данных о программе нет, добавляем пустой объект
        // Чтобы компонент ProgramScore мог корректно отображаться
        this.qrData.program = {
          total_score: 0,
          can_add_score: true
        };
      }
    },
    
    handleServerError(response) {
      this.statusText = 'Ошибка';
      this.statusColor = '#f8d7da'; // Красный фон
      
      this.errorMessage = 'Произошла ошибка на сервере. Пожалуйста, обратитесь к организаторам.';
    },
    
    async handleExpiredToken(response) {
      this.statusText = 'Ошибка';
      this.statusColor = '#f8d7da'; // Красный фон
      
      const result = response.data;
      this.errorMessage = result?.detail || 'Срок действия QR-кода или ссылки истек. Пожалуйста, получите новую ссылку в профиле.';
      
      const isQrExpiredError = 
        this.errorMessage.includes('QR') || 
        this.errorMessage.includes('qr') || 
        this.errorMessage.includes('истек') ||
        this.errorMessage.includes('Недействительный') ||
        this.errorMessage.includes('недействительный') ||
        this.errorMessage.includes('Недействительная');
        
      if (!isQrExpiredError) {
        this.checkForAuthErrors(result?.detail, response.status);
      }
    },
    
    handleUnauthorizedError(response = null) {
      this.statusText = 'Ошибка';
      this.statusColor = '#f8d7da'; // Красный фон
      
      let countdown = 5;
      this.errorMessage = `Для продолжения необходимо авторизоваться. Перенаправление через ${countdown}`;
      
      const countdownInterval = setInterval(() => {
        countdown--;
        this.errorMessage = `Для продолжения необходимо авторизоваться. Перенаправление через ${countdown}...`;
        
        if (countdown <= 0) {
          clearInterval(countdownInterval);
        }
      }, 1000);
      
      const currentUrl = window.location.href;
      
      setTimeout(() => {
        this.$router.push(`/registration?redirect_url=${encodeURIComponent(currentUrl)}`);
      }, 5000);
    },
    
    handleAuthRequired() {
      this.statusText = 'Ошибка';
      this.statusColor = '#f8d7da'; // Красный фон
      
      let countdown = 5;
      this.errorMessage = `Для проверки QR-кода необходимо авторизоваться. Перенаправление через ${countdown}`;
      
      const countdownInterval = setInterval(() => {
        countdown--;
        this.errorMessage = `Для проверки QR-кода необходимо авторизоваться. Перенаправление через ${countdown}...`;
        
        if (countdown <= 0) {
          clearInterval(countdownInterval);
        }
      }, 1000);
      
      const currentUrl = window.location.href;
      
      setTimeout(() => {
        this.$router.push(`/registration?redirect_url=${encodeURIComponent(currentUrl)}`);
      }, 5000);
    },
    
    checkForAuthErrors(errorMessage, statusCode) {
      // Если ошибка не связана с QR-кодом, а просто с авторизацией
      if (statusCode === 401 && 
          errorMessage && 
          !(
            errorMessage.includes('QR') || 
            errorMessage.includes('qr') || 
            errorMessage.includes('истек') || 
            errorMessage.includes('Недействительный') || 
            errorMessage.includes('недействительный') ||
            errorMessage.includes('Недействительная')
          ) && 
          (
            errorMessage.includes('Unauthorized') || 
            errorMessage.includes('unauthorized') || 
            errorMessage.includes('авторизац') ||
            errorMessage.includes('Необходима авторизация') ||
            errorMessage.includes('login') ||
            errorMessage.includes('войти')
          )
      ) {
        this.handleUnauthorizedError();
      }
    },
    
    handleServerErrorMessage(result) {
      this.statusText = result.message || 'Ошибка верификации';
      this.statusColor = '#f8d7da'; // Красный фон
      
      // Проверяем, является ли сообщение об ошибке "Только QR капитана команды позволяет присоединиться"
      // и пользователь не является гостем
      if (result.message && 
          result.message.includes('Только QR капитана') && 
          this.qrData && 
          this.qrData.scanner_role && 
          ['insider', 'ctc', 'organizer'].includes(this.qrData.scanner_role)) {
        // Для организаторов, инсайдеров и ctc - не показываем ошибку о капитане
        this.statusText = 'Информация';
        this.statusColor = '#d1ecf1'; // Синий информационный фон
        // Не устанавливаем сообщение об ошибке, так как для этих ролей это не ошибка
      } else if (result.message && result.message.includes('уже состоите в')) {
        // Если сообщение о том, что пользователь уже в команде
        this.guestMessage = result.message;
      } else {
        // Для других ошибок показываем общий формат ошибки
        this.errorMessage = result.message || 'Неизвестная ошибка при проверке QR-кода';
      }
    },
    
    determineUserView() {
      if (!this.qrData) {
        this.guestMessage = 'Нет данных для отображения';
        return;
      }
      
      // Для гостей и пользователей без роли - проверяем возможность присоединения
      if (!this.qrData.scanner_role || this.qrData.scanner_role === 'guest') {
        if (this.qrData.join_reason) {
          switch(this.qrData.join_reason) {
            case 'already_in_team':
              this.guestMessage = "Вы уже состоите в команде и не можете присоединиться к другой";
              break;
            case 'not_captain':
              this.guestMessage = "Только QR-код капитана команды позволяет присоединиться";
              break;
            case 'team_full':
              this.guestMessage = "В команде уже максимальное количество участников (6/6)";
              break;
            default:
              this.guestMessage = `Невозможно присоединиться к команде. Причина: ${this.qrData.join_reason}`;
          }
          return;
        }
        
        if (this.qrData.can_join) {
          this.showJoinBox = true;
          return;
        }
        
        if (this.qrData.message === "Вы успешно добавлены в команду") {
          // Не показываем сообщение инсайдерам и ctc
          if (!['insider', 'ctc'].includes(this.qrData.scanner_role)) {
            this.guestMessage = this.qrData.message;
          }
          return;
        }
        
        if (this.qrData.message) {
          this.guestMessage = this.qrData.message;
          return;
        }
      } else {
        // Для организаторов, инсайдеров и ctc - обрабатываем по-прежнему
        if (this.qrData.join_reason) {
          // Для не-гостевых ролей не показываем сообщение "не капитан"
          if (this.qrData.join_reason === 'not_captain' && 
              ['insider', 'ctc', 'organizer'].includes(this.qrData.scanner_role)) {
            // Не показываем сообщение об ошибке для ролей insider, ctc, organizer
            return;
          }
          
          switch(this.qrData.join_reason) {
            case 'already_in_team':
              // Возвращаем простую установку сообщения
              this.guestMessage = "Вы уже состоите в команде и не можете присоединиться к другой";
              break;
            case 'not_captain':
              // Этот кейс уже обрабатывается return выше для нужных ролей
              break;
            case 'team_full':
              // Возвращаем простую установку сообщения
              this.guestMessage = "В команде уже максимальное количество участников (6/6)";
              break;
            default:
              // Возвращаем простую установку сообщения
              this.guestMessage = `Невозможно присоединиться к команде. Причина: ${this.qrData.join_reason}`;
          }
          return;
        }
        
        // Показываем окно присоединения только для organizer (и гостей/без роли ранее)
        if (this.qrData.can_join && !['insider', 'ctc'].includes(this.qrData.scanner_role)) {
          this.showJoinBox = true;
          return;
        }
        
        if (this.qrData.message === "Вы успешно добавлены в команду") {
          // Возвращаем простую установку сообщения
          this.guestMessage = this.qrData.message;
          return;
        }
      }
      
      // Возвращаем простую установку финального сообщения 
      // (условие отображения компонента теперь в v-if)
      if (this.qrData.message) {
        this.guestMessage = this.qrData.message;
      } else {
        // Показываем это сообщение только если не guestMessage из join_reason
        if (!this.guestMessage) { 
             this.guestMessage = 'Нет данных для отображения';
        }
      }
    },
    
    async joinTeam() {
      // Блокируем кнопки во время запроса
      this.isJoining = true;
      
      // Показываем индикатор загрузки
      this.statusText = 'Обработка...';
      
      try {
        // Используем fetch вместо API клиента
        const response = await fetch('/api/auth/command/join', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: this.token }),
          credentials: 'include' // для работы с куками
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Парсим JSON ответ
        const result = await response.json();
        
        if (result.ok) {
          // В случае успешного присоединения
          this.statusText = 'Успешно';
          this.statusColor = '#d4edda'; // Зеленый фон
          this.redirectCounter = 5;
          this.guestMessage = `Вы успешно присоединились к команде! Перенаправление в профиль через ${this.redirectCounter}`;
          this.showJoinBox = false;
          
          // Запускаем интервал для обновления счетчика
          this.redirectInterval = setInterval(() => {
            this.redirectCounter--;
            this.guestMessage = `Вы успешно присоединились к команде! Перенаправление в профиль через ${this.redirectCounter}`;
            
            if (this.redirectCounter <= 0) {
              clearInterval(this.redirectInterval);
            }
          }, 1000);
          
          // Запускаем таймер для перенаправления
          this.redirectTimeout = setTimeout(() => {
            this.$router.push('/profile');
          }, 5000);
        } else {
          // В случае ошибки
          this.statusText = 'Ошибка';
          this.statusColor = '#f8d7da'; // Красный фон
          this.errorMessage = result.message || 'Ошибка при присоединении к команде';
          this.showJoinBox = false;
        }
      } catch (error) {
        // Обрабатываем ошибки
        console.error('Ошибка при присоединении к команде:', error);
        
        this.statusText = 'Ошибка';
        this.statusColor = '#f8d7da'; // Красный фон
        this.errorMessage = 'Ошибка при присоединении к команде. Пожалуйста, обратитесь к организаторам.';
        this.showJoinBox = false;
      } finally {
        // В любом случае убираем состояние загрузки
        this.isJoining = false;
      }
    },
    
    cancelJoin() {
      this.showJoinBox = false;
      this.guestMessage = 'Вы отменили присоединение к команде';
    },
    
    updateScore(newTotalScore) {
      if (this.qrData && this.qrData.program) {
        this.qrData.program.total_score = newTotalScore;
      }
    },
    
    // Метод для получения статуса (задач) сканирующего пользователя (если ctc)
    // Используем тот же эндпоинт, что и для инсайдера
    async fetchScannerStatus() { 
      const commandId = this.qrData?.command?.id;
      
      if (!commandId) {
        console.error('Не найден ID команды для запроса статуса CTC.');
        return; // Не делаем запрос без ID команды
      }
      
      try {
        // Используем эндпоинт статуса задач инсайдера
        const url = `/api/quest/insiders/tasks/status?command_id=${commandId}`;
        console.log('Запрос статуса задач CTC (используя эндпоинт инсайдера):', url); // Логируем URL
        
        const response = await fetch(url, { // Используем URL инсайдера
          credentials: 'include' // Важно для аутентификации по сессии/куки
        });
        
        if (response.ok) {
          const stats = await response.json();
          if (stats.ok && Array.isArray(stats.tasks)) {
            this.scannerTasks = stats.tasks;
            console.log('Задачи CTC пользователя загружены:', this.scannerTasks);
          }
        } else {
          console.error('Ошибка при загрузке статистики пользователя:', response.statusText);
        }
      } catch (error) {
        console.error('Исключение при загрузке статуса задач CTC:', error);
      }
    }
  }
}
</script>

<style scoped>
.qr-page {
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

.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  box-sizing: border-box;
}

.result-container {
  margin-top: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 15px;
  background-color: rgba(255, 255, 255, 0.8);
}

.info-box {
  margin: 15px 0;
  padding: 10px 15px;
  background-color: #f8f9fa;
  border-left: 4px solid #007bff;
  border-radius: 4px;
}

.info-box p {
  margin: 0;
  font-size: 14px;
}

.debug-info {
  margin-top: 15px;
  padding: 10px;
  background-color: #f8f9fa;
  border: 1px dashed #ccc;
  border-radius: 4px;
}

.debug-info p {
  margin: 0;
  font-family: monospace;
  font-size: 14px;
}

/* Адаптивность для мобильных устройств */
@media (max-width: 480px) {
  .container {
    padding: 10px;
    max-width: calc(100% - 20px);
  }
}

@font-face {
  font-family: 'Involve';
  src: url('@/assets/fonts/Involve-Medium.ttf') format('truetype');
  font-weight: 500;
  font-style: normal;
}
</style> 
