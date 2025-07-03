<template>
  <div class="profile-info">
    <div class="profile-card">
      <div class="profile-header">
        <h3>{{ $t('profile.personalInfo') }}</h3>
        <EditButton 
          :is-editing="isEditing" 
          @toggle="toggleEditMode"
        />
      </div>
      
      <div class="info-display">
        <p v-if="!isEditing">
          {{ $t('profile.fullName') }}: <span>{{ userData.full_name || $t('profile.notSpecified') }}</span>
        </p>
        <p v-else class="edit-field">
          {{ $t('profile.fullName') }}: <input 
            type="text" 
            v-model="editedFullName" 
            :placeholder="$t('profile.fullName')"
          >
        </p>
        
        <!-- Дополнительная информация инсайдера или СтС -->
        <template v-if="isInsider || isCtc">
          <!-- Студенческая организация -->
          <p v-if="isCtc"> 
            {{ $t('profile.studentOrganization') || 'Студенческая организация' }}: 
            <span>СтС</span>
          </p>
          <p v-else-if="isInsider && !isEditing">
            {{ $t('profile.studentOrganization') || 'Студенческая организация' }}: 
            <span>{{ (userData.insider_info && userData.insider_info.student_organization) || $t('profile.notSpecified') }}</span>
          </p>
          <p v-else-if="isInsider && isEditing" class="edit-field">
            {{ $t('profile.studentOrganization') || 'Студенческая организация' }}: 
            <input 
              type="text" 
              v-model="editedStudentOrganization" 
              :placeholder="$t('profile.studentOrganization') || 'Студенческая организация'"
            >
          </p>
          
          <!-- Ссылка на 2ГИС -->
          <p v-if="!isEditing">
            {{ $t('profile.geoLink') || 'Ссылка на 2ГИС' }}: 
            <span v-if="geoLinkValue">
              <a :href="geoLinkValue" target="_blank" class="geo-link">{{ geoLinkValue }}</a>
            </span>
            <span v-else>{{ $t('profile.notSpecified') }}</span>
          </p>
          <p v-else class="edit-field">
            {{ $t('profile.geoLink') || 'Ссылка на 2ГИС' }}: 
            <input type="text" v-model="editedGeoLink">
          </p>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import EditButton from '@/components/UI/EditButton.vue';

export default {
  name: 'ProfileInfo',
  components: {
    EditButton
  },
  props: {
    userData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isEditing: false,
      editedFullName: '',
      editedStudentOrganization: '',
      editedGeoLink: '',
      isSaving: false
    };
  },
  computed: {
    isInsider() {
      return this.userData && this.userData.role && this.userData.role.name === 'insider';
    },
    isCtc() {
      return this.userData && this.userData.role && this.userData.role.name === 'ctc';
    },
    geoLinkValue() {
      return this.userData?.insider_info?.geo_link;
    }
  },
  watch: {
    userData: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.editedFullName = newValue.full_name || '';
          
          // Инициализируем поля инсайдера или СтС
          if (this.isInsider) {
            this.editedStudentOrganization = newValue.insider_info?.student_organization || '';
            this.editedGeoLink = newValue.insider_info?.geo_link || '';
          } else if (this.isCtc) {
            this.editedStudentOrganization = 'СтС';
            this.editedGeoLink = newValue.insider_info?.geo_link || '';
          }
        }
      }
    }
  },
  methods: {
    toggleEditMode() {
      if (this.isEditing) {
        // Если уже в режиме редактирования, то сохраняем данные
        this.saveChanges();
      } else {
        // Иначе переходим в режим редактирования
        this.isEditing = true;
      }
    },
    
    async saveChanges() {
      if (this.isSaving) return;
      
      // Проверяем, были ли внесены изменения
      const fullNameChanged = this.editedFullName !== this.userData.full_name;
      let insiderCtcChanged = false;
      if (this.isInsider) {
        insiderCtcChanged = this.editedStudentOrganization !== (this.userData.insider_info?.student_organization || '') ||
                           this.editedGeoLink !== (this.userData.insider_info?.geo_link || '');
      } else if (this.isCtc) {
        insiderCtcChanged = this.editedGeoLink !== (this.userData.insider_info?.geo_link || '');
      }
      
      const noChanges = !fullNameChanged && !insiderCtcChanged;
      
      if (noChanges) {
        // Если данные не изменились, просто выходим из режима редактирования
        this.isEditing = false;
        return;
      }
      
      this.isSaving = true;
      try {
        // Подготавливаем данные для отправки
        const updateData = { full_name: this.editedFullName };
        
        // Добавляем дополнительные поля для инсайдера или СтС
        if (this.isInsider) {
          updateData.student_organization = this.editedStudentOrganization;
          updateData.geo_link = this.editedGeoLink;
        } else if (this.isCtc) {
          updateData.student_organization = 'СтС';
          updateData.geo_link = this.editedGeoLink;
        }
        
        const response = await fetch('/api/auth/update_profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.detail || this.$t('profile.error'));
        }
        
        // Обновляем локальные данные для эмита
        const updatedData = {
          full_name: this.editedFullName
        };
        
        // Всегда помещаем доп. поля в insider_info
        if (this.isInsider || this.isCtc) {
          updatedData.insider_info = {};
          if (this.isInsider) {
            updatedData.insider_info.student_organization = this.editedStudentOrganization;
          } else { // isCtc
            // СО для СтС не отправляется в @update, так как оно фиксировано
          }
          updatedData.insider_info.geo_link = this.editedGeoLink;
        }
        
        // Оповещаем родительский компонент об изменениях
        this.$emit('update', updatedData);
        this.isEditing = false;
      } catch (error) {
        alert(`${this.$t('profile.error')}: ${error.message}`);
      } finally {
        this.isSaving = false;
      }
    }
  }
};
</script>

<style scoped>
@import './ProfileStyles.css';

/* Специфичные стили только для этого компонента */
.profile-info {
  margin-bottom: 30px;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.profile-header h3 {
  color: #333;
  margin: 0;
}

.info-display p {
  margin: 8px 0;
  font-size: 16px;
}

.info-display span {
  font-weight: 500;
}

.geo-link {
  color: #389ce9;
  text-decoration: underline;
  word-break: break-all;
}

/* Адаптивность для мобильных устройств */
@media (max-width: 768px) {
  .edit-field {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .edit-field input {
    margin-left: 0;
    margin-top: 5px;
    width: 100%;
  }
}
</style>
