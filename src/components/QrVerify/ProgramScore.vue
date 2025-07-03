<template>
  <div class="program-score">
    <h3>
      Управление баллами
      <RoleBadge :role="userRole" />
    </h3>
    <div class="total-score" :class="{'score-attended': hasAttended, 'score-not-attended': !hasAttended}">
      <strong>Общий балл пользователя:</strong> {{ totalScore }}
      <div v-if="isLoading" class="loading-indicator">
        <span>Загрузка...</span>
      </div>
    </div>
    
    <div class="score-form">
      <h4>Начислить/списать баллы</h4>
      <div class="score-input">
        <input 
          type="number" 
          step="0.5" 
          v-model="scoreInput" 
          placeholder="Введите значение (например, 1.5, 0 или -1)" 
          class="form-control"
        />
        <input 
          type="text" 
          v-model="commentInput" 
          placeholder="Комментарий (опционально)" 
          class="form-control"
        />
        <div class="button-group">
          <button 
            @click="addScore" 
            class="btn btn-primary"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? 'Отправка...' : 'Добавить' }}
          </button>
          <button 
            v-if="!hasAttended"
            @click="markAttendance" 
            class="btn btn-attendance"
            :disabled="isSubmitting"
          >
            Отметить посещение
          </button>
        </div>
      </div>
      <div v-if="scoreMessage" class="score-message" :class="scoreMessageClass">
        {{ scoreMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import { programAPI } from '@/services/api';
import RoleBadge from './RoleBadge.vue';

export default {
  name: 'ProgramScore',
  components: {
    RoleBadge
  },
  props: {
    userId: {
      type: Number,
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    },
    initialScore: {
      type: Number,
      default: 0
    },
    role: {
      type: String,
      default: ''
    },
    userRole: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      totalScore: this.initialScore,
      scoreInput: '',
      commentInput: '',
      isSubmitting: false,
      isLoading: false,
      scoreMessage: '',
      scoreMessageClass: '',
      hasAttended: false
    };
  },
  created() {
    // Загружаем текущий счёт пользователя при создании компонента
    this.fetchUserScore();
  },
  methods: {
    async fetchUserScore() {
      if (!this.userId) return;
      
      this.isLoading = true;
      try {
        const response = await programAPI.getUserScore(this.userId);
        if (response.ok && response.data && response.data.total_score !== undefined) {
          this.totalScore = response.data.total_score;
          
          // Проверяем историю баллов для определения статуса посещения
          const history = response.data.history || [];
          this.hasAttended = history.length > 0;
          
          // Информируем родительский компонент об обновлении
          this.$emit('score-updated', response.data.total_score);
        } else {
          console.error('Ошибка при получении баллов пользователя:', response.message);
        }
      } catch (error) {
        console.error('Ошибка при загрузке баллов пользователя:', error);
      } finally {
        this.isLoading = false;
      }
    },
    
    async addScore() {
      if (!this.scoreInput) {
        this.scoreMessage = 'Введите значение баллов';
        this.scoreMessageClass = 'error';
        return;
      }

      // Валидация ввода
      const scoreValue = parseFloat(this.scoreInput);
      if (isNaN(scoreValue)) {
        this.scoreMessage = 'Введите корректное числовое значение';
        this.scoreMessageClass = 'error';
        return;
      }

      this.isSubmitting = true;
      this.scoreMessage = '';

      try {
        const scoreData = {
          score: scoreValue,
          comment: this.commentInput || null
        };

        const response = await programAPI.addScoreByQr(this.token, scoreData);

        if (response.ok) {
          // Обновляем сообщение в зависимости от значения scoreValue
          let messageAction;
          if (scoreValue > 0) {
            messageAction = 'начислены';
          } else if (scoreValue < 0) {
            messageAction = 'списаны';
          } else {
            messageAction = 'зачтены';
          }
          this.scoreMessage = `Баллы успешно ${messageAction}`;
          this.scoreMessageClass = 'success';
          this.totalScore = response.total_score;
          this.scoreInput = '';
          this.commentInput = '';
          
          // После успешного добавления баллов, обновляем статус посещения
          this.hasAttended = true;
          
          // Уведомляем родительский компонент об изменении баллов
          this.$emit('score-updated', response.total_score);
        } else {
          this.scoreMessage = response.message || 'Ошибка при добавлении баллов';
          this.scoreMessageClass = 'error';
        }
      } catch (error) {
        console.error('Ошибка при добавлении баллов:', error);
        this.scoreMessage = 'Ошибка при добавлении баллов';
        this.scoreMessageClass = 'error';
      } finally {
        this.isSubmitting = false;
      }
    },
    
    async markAttendance() {
      this.isSubmitting = true;
      this.scoreMessage = '';

      try {
        const scoreData = {
          score: 0,
          comment: '+'
        };

        const response = await programAPI.addScoreByQr(this.token, scoreData);

        if (response.ok) {
          this.scoreMessage = 'Посещение успешно отмечено';
          this.scoreMessageClass = 'success';
          this.totalScore = response.total_score;
          
          // После успешной отметки посещения обновляем статус
          this.hasAttended = true;
          
          // Уведомляем родительский компонент об изменении баллов
          this.$emit('score-updated', response.total_score);
        } else {
          this.scoreMessage = response.message || 'Ошибка при отметке посещения';
          this.scoreMessageClass = 'error';
        }
      } catch (error) {
        console.error('Ошибка при отметке посещения:', error);
        this.scoreMessage = 'Ошибка при отметке посещения';
        this.scoreMessageClass = 'error';
      } finally {
        this.isSubmitting = false;
      }
    }
  }
}
</script>

<style scoped>
.program-score {
  margin: 15px 0;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
}

h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-score {
  font-size: 18px;
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 4px;
  position: relative;
  transition: background-color 0.3s ease;
}

.score-attended {
  background-color: #d4edda;
  border-left: 4px solid #28a745;
}

.score-not-attended {
  background-color: #fff3cd;
  border-left: 4px solid #ffc107;
}

.loading-indicator {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: #666;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 2px 6px;
  border-radius: 10px;
}

.score-form h4 {
  margin-bottom: 10px;
  color: #444;
}

.score-input {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.button-group {
  display: flex;
  gap: 10px;
}

.form-control {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.form-control:focus {
  border-color: #4CAF50;
  outline: none;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.25);
}

.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
}

.btn-primary:hover {
  background-color: #45a049;
}

.btn-attendance {
  background-color: #FF9800;
  color: white;
}

.btn-attendance:hover {
  background-color: #F57C00;
}

.btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.score-message {
  margin-top: 10px;
  padding: 10px;
  border-radius: 4px;
}

.score-message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.score-message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

/* Адаптивность для мобильных устройств */
@media (max-width: 480px) {
  .program-score {
    padding: 10px;
  }
  
  .form-control, .btn {
    font-size: 14px;
    padding: 8px;
  }
  
  .button-group {
    flex-direction: column;
  }
}
</style> 