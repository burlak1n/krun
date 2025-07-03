<template>
  <LogoComponent />   
  <div class="profile-container">
    <div class="container">   
      <h2>{{ $t('profile.title') }}</h2>
      <div v-if="isOrganizer" class="admin-panel-container">
        <a href="/admin" class="admin-btn">{{ $t('profile.adminPanel') }}</a>
      </div>
      <!-- Главная информация о пользователе -->
      <ProfileMain 
        v-if="userData" 
        :userData="userData" 
        :qrCodeData="canViewTeamAndQr ? qrCodeData : null"
        :qrLink="canViewTeamAndQr ? qrLink : null"
        @copy-qr-link="copyQrLink"
      />
      
      <!-- Отображаем компонент с баллами -->
      <ProfileScore 
        v-if="userScore !== null" 
        :score="userScore"
      />

      <!-- Личная информация и QR-код -->
      <ProfileInfo 
        v-if="userData" 
        :userData="userData" 
        :qrCodeData="canViewTeamAndQr ? qrCodeData : null" 
        :qrLink="canViewTeamAndQr ? qrLink : null" 
        @update="updateUserData" 
        @toggle-looking-status="toggleLookingStatus"
      />
      
      <!-- Информация о команде или форма создания -->
      <ProfileTeam 
        v-if="userData && canViewTeamAndQr" 
        :team="userTeam" 
        :userData="userData" 
        :qrLink="qrLink" 
        :isLookingForTeam="isLookingForTeam"
        @copy-qr-link="copyQrLink" 
        @update="updateUserData" 
        @team-created="fetchUserData" 
        @team-deleted="fetchUserData" 
        @team-left="fetchUserData"
        @team-updated="fetchUserData"
      />
    </div>
    <a @click="logout" class="logout-btn">{{ $t('profile.logout') }}</a>
  </div>
</template>

<script>
import ProfileMain from './ProfileMain.vue';
import ProfileInfo from './ProfileInfo.vue';
import ProfileTeam from './ProfileTeam.vue';
import ProfileScore from './ProfileScore.vue';
import LogoComponent from '@/components/UI/LogoComponent.vue';

export default {
  name: 'Profile',
  components: {
    ProfileMain,
    ProfileInfo,
    ProfileTeam,
    ProfileScore,
    LogoComponent
  },
  data() {
    return {
      userData: null,
      userTeam: null,
      qrCodeData: null,
      qrLink: null,
      isLookingForTeam: false,
      userScore: null
    };
  },
  computed: {
    isOrganizer() {
      return this.userData?.role?.name === 'organizer';
    },
    canViewTeamAndQr() {
      const role = this.userData?.role?.name;
      return role !== 'insider' && role !== 'ctc';
    },
    isInsider() {
      return this.userData?.role?.name === 'insider';
    },
    isCtc() {
      return this.userData?.role?.name === 'ctc';
    }
  },
  mounted() {
    this.fetchUserData();
  },
  methods: {
    // Запрос данных
    async fetchUserData() {
      console.log('Вызов fetchUserData - загрузка данных с сервера');
      try {
        // Загружаем данные пользователя и QR код параллельно
        const [userRes, qrRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/auth/qr')
        ]);

        if (!userRes.ok || !qrRes.ok) throw new Error(this.$t('profile.error'));

        this.userData = await userRes.json();
        this.qrCodeData = await qrRes.json();
        
        this.qrLink = this.qrCodeData.qr_link;
        this.isLookingForTeam = !!this.userData.is_looking_for_friends;
        this.userScore = this.userData.score;
        
        // Обрабатываем данные о команде
        if (this.userData.commands && this.userData.commands.length > 0) {
          console.log('Обновление userTeam из fetchUserData');
          this.userTeam = this.userData.commands[0];
        } else {
          this.userTeam = null;
        }
        
        console.log('Данные загружены');
      } catch (error) {
        console.error(this.$t('profile.error') + ':', error);
        this.$router.push('/registration');
      }
    },
    
    // Обработчики действий пользователя
    async logout() {
      try {
        await this.makeRequest('/api/auth/logout', 'POST');
        this.$router.push('/');
      } catch (error) {
        console.error(this.$t('profile.logoutError') + ':', error);
      }
    },
    
    // Метод для копирования QR-кода
    async copyQrLink() {
      try {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(this.qrLink);
        } else {
          // Запасной вариант для старых браузеров
          const textArea = document.createElement('textarea');
          textArea.value = this.qrLink;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }
        
        alert(this.$t('profile.linkCopied'));
      } catch (error) {
        console.error('Ошибка при копировании ссылки:', error);
        alert('Не удалось скопировать ссылку: ' + error.message);
      }
    },
    
    // Обновляем данные в родительском компоненте
    updateUserData(updatedData) {
      console.log('Profile.vue: Received update event with data:', JSON.stringify(updatedData));

      // Создаем полностью новый объект для userData, чтобы гарантировать реактивность
      const newUserState = {
        ...this.userData, // Копируем все текущие верхнеуровневые свойства
        full_name: updatedData.full_name !== undefined ? updatedData.full_name : this.userData.full_name, // Обновляем full_name
        // Обрабатываем insider_info: создаем новый объект, если он был, иначе null
        insider_info: this.userData.insider_info ? { ...this.userData.insider_info } : null
      };

      // Обновляем поля внутри нового insider_info, если данные пришли
      if (updatedData.insider_info) {
          // Если insider_info был null, но пришли данные, создаем объект
          if (newUserState.insider_info === null) {
              newUserState.insider_info = {};
          }
          // Обновляем student_organization, если это инсайдер и данные есть
          if (updatedData.insider_info.student_organization !== undefined && newUserState.role?.name === 'insider') {
              newUserState.insider_info.student_organization = updatedData.insider_info.student_organization;
          }
          // Обновляем geo_link, если данные есть (для обеих ролей)
          if (updatedData.insider_info.geo_link !== undefined) {
              newUserState.insider_info.geo_link = updatedData.insider_info.geo_link;
          }
      }

      // Присваиваем совершенно новый объект свойству userData
      this.userData = newUserState;
      console.log('Profile.vue: Updated local userData state:', JSON.stringify(this.userData));
    },
    
    // Метод для выполнения запросов к API
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
    },
    
    // Метод переключения статуса поиска команды
    async toggleLookingStatus() {
      try {
        const response = await this.makeRequest('/api/auth/toggle_looking_for_team', 'POST');
        this.isLookingForTeam = response.is_looking_for_friends;
        this.userData = { ...this.userData, is_looking_for_friends: this.isLookingForTeam };
      } catch (error) {
        console.error('Ошибка при изменении статуса поиска:', error);
      }
    }
  }
};
</script>

<style>
@import './ProfileStyles.css';
h2 {
  text-align: center;
}

/* Специфичные стили только для этого компонента */
.admin-panel-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}
</style>
