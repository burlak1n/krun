<template>
  <div class="profile-team">
    <div class="profile-card">
      <div class="team-header">
        <h3>{{ $t('profile.team') }}</h3>
        <div v-if="team" class="header-buttons">
          <button v-if="isUserCaptain" @click="handleCopyQrLink" class="settings-btn">
            <img src="@/assets/images/copy.svg" alt="Копировать" class="copy-icon">
          </button>
          <EditButton 
            v-if="isUserCaptain" 
            :is-editing="isEditing" 
            @toggle="toggleEditMode"
          />
          <button v-if="team && !isUserCaptain" @click="handleLeaveTeam" class="exit-btn">
            <img src="@/assets/images/exit.svg" alt="Выйти из команды" class="exit-icon">
          </button>
        </div>
      </div>
      
      <!-- Если команды нет - показываем форму создания -->
      <div v-if="!team" class="team-creation">
        <p class="no-team-message">{{ $t('profile.noTeam') }}</p>
        
        <form @submit.prevent="handleCreateTeam" class="team-form">
          <div class="form-field">
            <label for="team-name">{{ $t('profile.teamName') }}:</label>
            <input type="text" id="team-name" v-model="newTeamName" :placeholder="$t('profile.enterTeamName')" required>
          </div>
          
          <div class="form-field">
            <label for="team-language">{{ $t('profile.teamLanguage') }}:</label>
            <select id="team-language" v-model.number="selectedLanguage" class="language-select">
              <option :value="1">{{ $t('profile.russian') }}</option>
              <option :value="2">{{ $t('profile.english') }}</option>
            </select>
          </div>
          
          <button type="submit" class="create-button">
            {{ $t('profile.createTeam') }}
          </button>
        </form>
        
        <div v-if="error" class="team-error">{{ error }}</div>
        
        <!-- Статус "Ищу команду" -->
        <div class="looking-status-container">
          <div class="looking-status" :class="{ 'active': isLookingForTeam }">
            <span>{{ $t('profile.lookingForTeam') }}</span>
            <span class="status-indicator">{{ isLookingForTeam ? $t('profile.lookingStatusOn') : $t('profile.lookingStatusOff') }}</span>
          </div>
          <div class="looking-toggle">
            <label class="switch">
              <input type="checkbox" 
                :checked="isLookingForTeam" 
                @change="toggleLookingStatus">
              <span class="slider round"></span>
            </label>
            <span class="toggle-label">{{ $t('profile.showLookingStatus') }}</span>
          </div>
          
          <!-- Компонент для отображения всех пользователей, ищущих команду -->
          <div v-if="isLookingForTeam" class="find-team-section">
            <div class="find-team-header">
              <h4>{{ $t('profile.peopleSearching') }}</h4>
            </div>
            
            <div v-if="isLoadingUsers" class="loading-users">
              {{ $t('profile.loadingUsers') }}...
            </div>
            
            <div v-else-if="lookingUsers.length > 0" class="users-list">
              <div v-for="user in lookingUsers" :key="user.id" class="user-item">
                <div class="user-info">
                  <div class="user-name">
                    <a v-if="user.telegram_username" 
                       :href="'https://t.me/' + user.telegram_username" 
                       target="_blank" 
                       class="user-link">
                      {{ user.full_name }}{{ user.is_captain ? ' 👑' : '' }}
                    </a>
                    <span v-else>{{ user.full_name }}{{ user.is_captain ? ' 👑' : '' }}</span>
                  </div>
                  <div v-if="user.team_name" class="team-label">{{ $t('profile.teamLabel') }}: {{ user.team_name }}</div>
                </div>
              </div>
            </div>
            
            <div v-else-if="lookingUsersLoaded" class="no-users-message">
              {{ $t('profile.noLookingUsers') }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Если команда есть - показываем информацию о ней -->
      <div v-else class="team-info">
        <div class="team-details">
          <p v-if="!isEditing">
            <span>{{ $t('profile.teamName') }}: {{ team.name }}</span>
          </p>
          <p v-else class="edit-field">
            {{ $t('profile.teamName') }}: <input 
              type="text" 
              v-model="editedTeamName" 
              :placeholder="$t('profile.enterTeamName')"
            >
          </p>
          
          <p v-if="!isEditing">
            {{ $t('profile.teamLanguage') }}: {{ team.language_id === 1 ? $t('profile.russian') : $t('profile.english') }}
          </p>
          <p v-else class="edit-field">
            {{ $t('profile.teamLanguage') }}: 
            <select v-model.number="editedTeamLanguage">
              <option :value="1">{{ $t('profile.russian') }}</option>
              <option :value="2">{{ $t('profile.english') }}</option>
            </select>
          </p>
          
          <h4>{{ $t('profile.participants') }} ({{ team.participants ? team.participants.length : 0 }}/6):</h4>
          <div class="team-participants">
            <div v-for="(participant, index) in team.participants" :key="participant.id" class="participant-item">
              <p>{{ index + 1 }}. {{ participant.full_name }}{{ participant.role === 'captain' ? ' 👑' : '' }}</p>
              <button 
                v-if="isEditing && isUserCaptain && participant.role !== 'captain' && participant.id !== userData.id" 
                type="button" 
                class="remove-btn" 
                @click="handleRemoveParticipant(participant.id)"
              >✕</button>
            </div>
          </div>
          
          <!-- Статус "Ищу сокомандников" доступен для всех участников команды -->
          <div class="looking-status-container">
            <div class="looking-status" :class="{ 'active': isLookingForTeam }">
              <span>{{ $t('profile.lookingForTeammates') }}</span>
              <span class="status-indicator">{{ isLookingForTeam ? $t('profile.lookingStatusOn') : $t('profile.lookingStatusOff') }}</span>
            </div>
            <div class="looking-toggle">
              <label class="switch">
                <input type="checkbox" 
                  :checked="isLookingForTeam" 
                  @change="toggleLookingStatus">
                <span class="slider round"></span>
              </label>
              <span class="toggle-label">{{ $t('profile.showLookingStatus') }}</span>
            </div>
          </div>
          
          <!-- Компонент для отображения всех пользователей, ищущих команду -->
          <div v-if="!isEditing && isLookingForTeam" class="find-team-section">
            <div class="find-team-header">
              <h4>{{ $t('profile.peopleSearching') }}</h4>
            </div>
            
            <div v-if="isLoadingUsers" class="loading-users">
              {{ $t('profile.loadingUsers') }}...
            </div>
            
            <div v-else-if="lookingUsers.length > 0" class="users-list">
              <div v-for="user in lookingUsers" :key="user.id" class="user-item">
                <div class="user-info">
                  <div class="user-name">
                    <a v-if="user.telegram_username" 
                       :href="'https://t.me/' + user.telegram_username" 
                       target="_blank" 
                       class="user-link">
                      {{ user.full_name }}{{ user.is_captain ? ' 👑' : '' }}
                    </a>
                    <span v-else>{{ user.full_name }}{{ user.is_captain ? ' 👑' : '' }}</span>
                  </div>
                  <div v-if="user.team_name" class="team-label">{{ $t('profile.teamLabel') }}: {{ user.team_name }}</div>
                </div>
              </div>
            </div>
            
            <div v-else-if="lookingUsersLoaded" class="no-users-message">
              {{ $t('profile.noLookingUsers') }}
            </div>
          </div>
          
          <div v-if="isEditing && isUserCaptain" class="edit-actions">
            <button @click="showDeleteTeamModal" class="delete-team-btn">
              {{ $t('profile.deleteTeam') }}
            </button>
          </div>
          
          <div v-if="showCopyNotification" class="copy-notification">
            {{ $t('profile.linkCopied') }}
          </div>
          <div v-if="showCopyError" class="copy-error-notification">
            {{ $t('profile.linkCopyError') }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Модальное окно для подтверждения удаления команды -->
    <div v-if="isDeleteTeamModalVisible" class="modal">
      <div class="modal-content">
        <span class="close" @click="hideModals">&times;</span>
        <h3>{{ $t('profile.deleteTeam') }}</h3>
        <p>{{ $t('profile.confirmDeleteTeam') }}</p>
        <button @click="handleDeleteTeam" class="delete-btn">{{ $t('profile.delete') }}</button>
        <button @click="hideModals" class="cancel-btn">{{ $t('profile.cancel') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import EditButton from '@/components/UI/EditButton.vue';

export default {
  name: 'ProfileTeam',
  components: {
    EditButton
  },
  props: {
    team: {
      type: Object,
      default: null
    },
    userData: {
      type: Object,
      required: true
    },
    qrLink: {
      type: String,
      default: ''
    },
    isLookingForTeam: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      newTeamName: '',
      selectedLanguage: this.getDefaultLanguageId(),
      editedTeamName: '',
      editedTeamLanguage: 1,
      isDeleteTeamModalVisible: false,
      isEditing: false,
      isSaving: false,
      showCopyNotification: false,
      showCopyError: false,
      error: null,
      lookingUsers: [],
      isLoadingUsers: false,
      lookingUsersLoaded: false
    };
  },
  computed: {
    isUserCaptain() {
      return this.team && this.team.role === 'captain';
    }
  },
  watch: {
    team: {
      immediate: true,
      handler(newTeam) {
        if (newTeam) {
          this.editedTeamName = newTeam.name || '';
          this.editedTeamLanguage = parseInt(newTeam.language_id) || this.getDefaultLanguageId();
        }
      }
    },
    isLookingForTeam(newValue) {
      // Если включен статус поиска команды, загружаем список пользователей
      if (newValue) {
        this.loadLookingUsers();
      } else {
        // Сбрасываем список при выключении статуса
        this.lookingUsers = [];
        this.lookingUsersLoaded = false;
      }
    }
  },
  methods: {
    getDefaultLanguageId() {
      // Всегда возвращаем ID русского языка
      return 1; // 1 для русского языка
    },
    
    hideModals() {
      this.isDeleteTeamModalVisible = false;
    },
    
    toggleEditMode() {
      if (this.isEditing) {
        this.handleEditTeam();
      } else {
        this.isEditing = true;
      }
    },
    
    showDeleteTeamModal() {
      this.isDeleteTeamModalVisible = true;
    },
    
    handleCopyQrLink() {
      if (!this.qrLink) return;
      
      try {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(this.qrLink)
            .then(() => {
              this.showCopyNotification = true;
              this.showCopyError = false;
              
              setTimeout(() => {
                this.showCopyNotification = false;
              }, 3000);
            })
            .catch(error => {
              console.error('Ошибка при копировании:', error);
              this.showCopyError = true;
              
              setTimeout(() => {
                this.showCopyError = false;
              }, 3000);
              
              this.fallbackCopyToClipboard();
            });
        } else {
          // Запасной метод для браузеров без поддержки navigator.clipboard
          this.fallbackCopyToClipboard();
        }
      } catch (error) {
        console.error('Ошибка при копировании ссылки:', error);
        this.showCopyError = true;
        
        setTimeout(() => {
          this.showCopyError = false;
        }, 3000);
      }
    },
    
    fallbackCopyToClipboard() {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = this.qrLink;
        textArea.style.position = 'fixed';  // Чтобы не влиять на вёрстку
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        if (successful) {
          this.showCopyNotification = true;
          this.showCopyError = false;
          
          setTimeout(() => {
            this.showCopyNotification = false;
          }, 3000);
        } else {
          console.error('Не удалось скопировать текст');
          this.showCopyError = true;
          
          setTimeout(() => {
            this.showCopyError = false;
          }, 3000);
        }
        
        document.body.removeChild(textArea);
      } catch (err) {
        console.error('Ошибка при резервном копировании:', err);
        this.showCopyError = true;
        
        setTimeout(() => {
          this.showCopyError = false;
        }, 3000);
      }
    },
    
    async handleCreateTeam() {
      
      try {
        this.error = null;
        // Преобразуем language_id в число перед отправкой, используя текущее значение
        const languageId = parseInt(this.selectedLanguage) || this.getDefaultLanguageId();
        
        const response = await this.makeRequest('/api/auth/command/create', 'POST', {
          name: this.newTeamName,
          language_id: languageId
        });
        
        // Получаем данные новой команды из ответа и отправляем их в родительский компонент
        // без необходимости полной перезагрузки
        this.$emit('team-created', {
          ...response, // Предполагаем, что API возвращает созданную команду
          name: this.newTeamName,
          language_id: languageId
        });
        
        this.newTeamName = '';
      } catch (error) {
        this.error = error.message;
      }
      
      
      // MOCK ДАННЫЕ ДЛЯ РАЗРАБОТКИ - закомментирован для разработки
      try {
        this.error = null;
        // Симулируем задержку API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const languageId = parseInt(this.selectedLanguage) || this.getDefaultLanguageId();
        
        // Получаем данные новой команды из ответа и отправляем их в родительский компонент
        this.$emit('team-created', {
          id: Math.floor(Math.random() * 1000),
          name: this.newTeamName,
          language_id: languageId,
          role: 'captain'
        });
        
        this.newTeamName = '';
        console.log('Команда создана (MOCK)');
      } catch (error) {
        this.error = error.message;
      }
    },
    
    async handleEditTeam() {
      if (this.isSaving) return;
      
      // Преобразуем значения для корректного сравнения
      const currentLanguageId = parseInt(this.editedTeamLanguage);
      
      if (this.editedTeamName === this.team.name && 
          currentLanguageId === parseInt(this.team.language_id)) {
        this.isEditing = false;
        return;
      }
      
      this.isSaving = true;
      
      
      try {
        await this.makeRequest('/api/auth/command/rename', 'POST', {
          name: this.editedTeamName,
          language_id: currentLanguageId // Отправляем как число
        });
        
        // Оповещаем родительский компонент об изменениях
        this.$emit('update', { 
          name: this.editedTeamName, 
          language_id: currentLanguageId 
        });
        
        // Закрываем режим редактирования после успешного запроса
        this.isEditing = false;
      } catch (error) {
        alert(error.message);
        
        // В случае ошибки, возвращаем исходные значения
        this.editedTeamName = this.team.name;
        this.editedTeamLanguage = parseInt(this.team.language_id) || this.getDefaultLanguageId();
      } finally {
        this.isSaving = false;
      }
      
      
      // MOCK ДАННЫЕ ДЛЯ РАЗРАБОТКИ - закомментирован для разработки
      try {
        // Симулируем задержку API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Оповещаем родительский компонент об изменениях
        this.$emit('update', { 
          name: this.editedTeamName, 
          language_id: currentLanguageId 
        });
        
        // Закрываем режим редактирования после успешного запроса
        this.isEditing = false;
        console.log('Команда обновлена (MOCK)');
      } catch (error) {
        alert(`Ошибка при обновлении команды (MOCK): ${error.message}`);
        
        // В случае ошибки, возвращаем исходные значения
        this.editedTeamName = this.team.name;
        this.editedTeamLanguage = parseInt(this.team.language_id) || this.getDefaultLanguageId();
      } finally {
        this.isSaving = false;
      }
    },
    
    async handleDeleteTeam() {
      
      try {
        await this.makeRequest('/api/auth/command/delete', 'POST');
        this.hideModals();
        // Отправляем отдельное событие для удаления команды
        this.$emit('team-deleted');
      } catch (error) {
        alert(error.message);
      }
      
      
      // MOCK ДАННЫЕ ДЛЯ РАЗРАБОТКИ - закомментирован для разработки
      try {
        // Симулируем задержку API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        this.hideModals();
        // Отправляем отдельное событие для удаления команды
        this.$emit('team-deleted');
        console.log('Команда удалена (MOCK)');
      } catch (error) {
        alert(`Ошибка при удалении команды (MOCK): ${error.message}`);
      }
    },
    
    async handleLeaveTeam() {
      if (confirm(this.$t('profile.leaveTeam') + "?")) {
        
        try {
          await this.makeRequest('/api/auth/command/leave', 'POST');
          // Отправляем отдельное событие для ухода из команды
          this.$emit('team-left');
        } catch (error) {
          alert(error.message);
        }
        
        
        // MOCK ДАННЫЕ ДЛЯ РАЗРАБОТКИ - закомментирован для разработки
        try {
          // Симулируем задержку API
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Отправляем отдельное событие для ухода из команды
          this.$emit('team-left');
          console.log('Покинул команду (MOCK)');
        } catch (error) {
          alert(`Ошибка при выходе из команды (MOCK): ${error.message}`);
        }
      }
    },
    
    async handleRemoveParticipant(participantId) {
      // Запрашиваем подтверждение перед удалением
      if (!confirm(this.$t('profile.confirmRemoveParticipant'))) {
        return; // Выходим, если пользователь отменил
      }
      
      
      try {
        // Отправляем запрос на удаление пользователя и ждем ответа
        await this.makeRequest('/api/auth/command/remove_user', 'POST', {
          user_id: participantId
        });
        
        // Вместо локального обновления вызываем обновление всех данных команды
        this.$emit('team-updated');
      } catch (error) {
        alert(error.message);
      }
      
      
      // MOCK ДАННЫЕ ДЛЯ РАЗРАБОТКИ - закомментирован для разработки
      try {
        // Симулируем задержку API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Вместо локального обновления вызываем обновление всех данных команды
        this.$emit('team-updated');
        console.log(`Участник ${participantId} удален (MOCK)`);
      } catch (error) {
        alert(`Ошибка при удалении участника (MOCK): ${error.message}`);
      }
    },
    
    toggleLookingStatus() {
      this.$emit('toggle-looking-status');
    },
    
    async loadLookingUsers() {
      console.log('Загрузка пользователей начата...');
      this.isLoadingUsers = true;
      
      
      try {
        console.log('Отправка запроса на сервер...');
        const response = await this.makeRequest('/api/auth/users/looking_for_team', 'GET');
        console.log('Ответ получен:', response);
        this.lookingUsers = response.users || [];
        console.log('Пользователи загружены:', this.lookingUsers.length);
        this.lookingUsersLoaded = true;
      } catch (error) {
        console.error('Ошибка при загрузке пользователей:', error);
        this.lookingUsersLoaded = false;
      } finally {
        this.isLoadingUsers = false;
      }
      
      
      // MOCK ДАННЫЕ ДЛЯ РАЗРАБОТКИ - закомментирован для разработки
      try {
        // Симулируем задержку API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        this.lookingUsers = [
          {
            id: 1,
            full_name: "Анна Смирнова",
            telegram_username: "anna_smirnova",
            is_captain: false,
            team_name: null
          },
          {
            id: 2,
            full_name: "Дмитрий Петров",
            telegram_username: "dmitry_petrov",
            is_captain: true,
            team_name: "Команда Дмитрия"
          },
          {
            id: 3,
            full_name: "Елена Волкова",
            telegram_username: "elena_volkova",
            is_captain: false,
            team_name: null
          }
        ];
        
        console.log('Пользователи загружены (MOCK):', this.lookingUsers.length);
        this.lookingUsersLoaded = true;
      } catch (error) {
        console.error('Ошибка при загрузке пользователей (MOCK):', error);
        this.lookingUsersLoaded = false;
      } finally {
        this.isLoadingUsers = false;
      }
    },
    
    
    async makeRequest(url, method, body) {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || this.$t('profile.error'));
      }
      
      return response.json();
    }
    
  },
  created() {
    // Инициализация параметров при создании компонента
    this.selectedLanguage = this.getDefaultLanguageId();
  },
  mounted() {
    // Загружаем список пользователей, ищущих команду, если у пользователя включен соответствующий статус
    if (this.isLookingForTeam) {
      this.loadLookingUsers();
    }
  }
};
</script>

<style scoped>
@import './ProfileStyles.css';

h4 {
  margin: 0;
}
.profile-card {
  margin: 0;
}
/* Стили для переключателей и статуса */
.looking-status-container {
  margin-top: 20px;
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.looking-status {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  background-color: #f5f5f5;
  color: #666;
}

.looking-status.active {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.status-indicator {
  font-size: 12px;
  font-style: italic;
}

.looking-toggle {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.toggle-label {
  margin-left: 10px;
  font-size: 14px;
  color: #666;
}

/* Стили для переключателя (switch) */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
}

input:checked + .slider {
  background-color: var(--hse-blue);
}

input:focus + .slider {
  box-shadow: 0 0 1px var(--hse-blue);
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.slider.round {
  border-radius: 24px;
}

.slider.round:before {
  border-radius: 50%;
}

/* Общие стили для всех кнопок и иконок */
.settings-btn, .exit-btn {
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
}

.copy-icon, .exit-icon {
  width: 20px;
  height: 20px;
  transition: all 0.2s ease;
}

.settings-btn:hover, .exit-btn:hover {
  transform: scale(1.1);
}

.edit-actions {
  margin-top: 15px;
}

/* Специфичные стили только для этого компонента */
.profile-team {
  margin: 0;
}

.team-card {
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.team-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
}

.team-header h3 {
  color: #333;
  margin: 0;
}

.header-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.team-creation, .team-info {
  padding: 0;
}

.no-team-message {
  margin-top: 0;
  margin-bottom: 20px;
  color: #666;
}

.team-form {
  display: grid;
  gap: 15px;
}

.form-field {
  display: flex;
  flex-direction: column;
}

.form-field label {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.form-field input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.language-select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.team-error {
  margin-top: 10px;
  color: var(--hse-red);
  font-size: 14px;
}

.team-participants {
  margin-bottom: 20px;
}

.team-participants p {
  margin: 5px 0;
}

.edit-team-participants {
  margin-bottom: 20px;
}

.participant-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  border-bottom: 1px solid #eee;
}

.participant-item p {
  margin: 0;
}

.remove-btn {
  background: none;
  border: none;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--hse-red);
  transition: transform 0.2s ease;
}

.remove-btn:hover {
  transform: scale(1.2);
}
.cancel-btn {
  margin-left: 5px;
}

.submit-btn {
  margin-top: 15px;
  width: 100%;
  padding: 8px 16px;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    padding: 15px;
  }
  
  .participant-item {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 5px 0;
  }
  
  .participant-item p {
    margin: 0;
  }
  
  .remove-btn {
    margin-top: 0;
  }
  
  .edit-field {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .edit-field input, .edit-field select {
    margin-top: 0px;
    width: 100%;
  }
}

.edit-actions {
  margin-top: 15px;
}

.delete-team-btn {
  background-color: var(--hse-red);
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
}

.copy-notification {
  margin-top: 15px;
  padding: 10px;
  background-color: #e8f5e9;
  color: #2e7d32;
  border-radius: 4px;
  text-align: center;
  animation: fadeIn 0.3s, fadeOut 0.5s 2.5s;
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.copy-error-notification {
  margin-top: 15px;
  padding: 10px;
  background-color: #ffebee;
  color: var(--hse-red);
  border-radius: 4px;
  text-align: center;
  animation: fadeIn 0.3s, fadeOut 0.5s 2.5s;
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

/* Стили для модального окна */
.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: #fff;
  margin: auto;
  padding: 20px;
  border-radius: 5px;
  width: 60%;
  max-width: 500px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  position: relative;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 15px;
}

.close:hover {
  color: black;
}

.delete-team-btn {
  background-color: var(--hse-red);
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
}

.copy-notification {
  margin-top: 15px;
  padding: 10px;
  background-color: #e8f5e9;
  color: #2e7d32;
  border-radius: 4px;
  text-align: center;
  animation: fadeIn 0.3s, fadeOut 0.5s 2.5s;
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.copy-error-notification {
  margin-top: 15px;
  padding: 10px;
  background-color: #ffebee;
  color: var(--hse-red);
  border-radius: 4px;
  text-align: center;
  animation: fadeIn 0.3s, fadeOut 0.5s 2.5s;
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

/* Стили для нового компонента FindTeamList */
.find-team-section {
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.find-team-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.refresh-btn {
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
}

.refresh-icon {
  font-size: 18px;
}

.loading-users {
  margin-bottom: 10px;
  text-align: center;
}

.users-list {
  margin-bottom: 10px;
}

.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  border-bottom: 1px solid #eee;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-name {
  margin-right: 10px;
}

.team-label {
  font-size: 12px;
  color: #666;
}

.telegram-link {
  color: #666;
  text-decoration: none;
}

.telegram-icon {
  margin-right: 5px;
}

.no-users-message {
  text-align: center;
  color: #666;
}

.user-link {
  color: #666;
  text-decoration: none;
}

.user-link:hover {
  color: var(--hse-blue);
  text-decoration: underline;
}
</style>
