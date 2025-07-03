<template>
  <div class="insider-attendance-marker">
    <h4>Отметка посещения</h4>
    
    <div v-if="loading" class="loading-indicator">
      Загрузка назначенных задач...
    </div>
    
    <div v-else-if="error" class="error-message">
      Ошибка загрузки задач: {{ error }}
    </div>
    
    <div v-else>
      <div v-if="tasks && tasks.length > 0">
        <ul>
          <li v-for="task in tasks" :key="task.id">
            <span v-html="task.title"></span>
            
            <!-- Условное отображение: статус, кнопка или сообщение -->
            <span v-if="task.is_attendance_marked" class="marked-status">
              Посещение отмечено для команды "{{ scannedCommandName }}"
            </span>
            <button 
              v-else-if="task.can_mark_attendance" 
              @click="markAttendance(task.id)" 
              :disabled="markingTask === task.id" 
              class="btn btn-primary" 
            >
              {{ markingTask === task.id ? 'Отметка...' : 'Отметить посещение' }}
            </button>
            <span v-else class="pending-status">
              Загадка ещё не решена командой "{{ scannedCommandName }}"
            </span>

          </li>
        </ul>
      </div>
      <div v-else>
        <p>Вам не назначено ни одной загадки.</p>
      </div>
      
      <div v-if="markMessage" :class="['message', markMessageType]">
        {{ markMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import { questAPI } from '@/api'; // Предполагаем, что questAPI будет создан/дополнен

export default {
  name: 'InsiderAttendanceMarker',
  props: {
    scannedUserId: {
      type: Number,
      required: true
    },
    scannedUserName: {
      type: String,
      default: ''
    },
    scannedCommandId: {
      type: Number,
      required: true
    },
    scannedCommandName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      error: null,
      tasks: [],
      markingTask: null, // ID задачи, которая отмечается в данный момент
      markMessage: null,
      markMessageType: 'info' // 'info', 'success', 'error'
    };
  },
  async created() {
    await this.fetchInsiderTasks();
  },
  methods: {
    async fetchInsiderTasks() {
      this.loading = true;
      this.error = null;
      try {
        // Убеждаемся, что scannedCommandId передан
        if (!this.scannedCommandId) {
          throw new Error('ID команды сканируемого пользователя не определено.');
        }
        
        // Вызываем новый API метод
        const response = await questAPI.getInsiderTasksStatus(this.scannedCommandId);
        
        // Проверяем поле 'ok' внутри данных ответа (response.data)
        if (response.data && response.data.ok) {
          this.tasks = response.data.tasks;
        } else {
          // Используем сообщение об ошибке из response.data.message, если оно есть
          throw new Error(response.data?.message || 'Не удалось загрузить задачи инсайдера.');
        }
      } catch (err) {
        console.error("Ошибка при загрузке задач инсайдера:", err);
        this.error = err.message || 'Произошла ошибка при загрузке данных.';
      } finally {
        this.loading = false;
      }
    },
    
    async markAttendance(questionId) {
      this.markingTask = questionId;
      this.markMessage = null;
      this.markMessageType = 'info';
      
      try {
        const requestData = {
          question_id: questionId,
          command_id: this.scannedCommandId,
          scanned_user_id: this.scannedUserId
        };
        
        // Вызываем новый API метод
        const response = await questAPI.markInsiderAttendance(requestData);
        
        // Проверяем поле 'ok' внутри данных ответа (response.data)
        if (response.data && response.data.ok) {
          this.markMessage = response.data.message || 'Посещение успешно отмечено.';
          this.markMessageType = 'success';
          // Обновляем статус задачи в списке
          const taskIndex = this.tasks.findIndex(t => t.id === questionId);
          if (taskIndex !== -1) {
            this.tasks[taskIndex].is_attendance_marked = true;
          }
        } else {
          // Используем сообщение об ошибке из response.data.message, если оно есть
          throw new Error(response.data?.message || 'Не удалось отметить посещение.');
        }
      } catch (err) {
        console.error("Ошибка при отметке посещения:", err);
        this.markMessage = err.message || 'Произошла ошибка при отметке посещения.';
        this.markMessageType = 'error';
      } finally {
        this.markingTask = null;
      }
    }
  }
};
</script>

<style scoped>
.insider-attendance-marker {
  margin: 15px 0; /* Стандартный отступ */
  padding: 15px;
  border: 1px solid #ddd; /* Рамка как у ProgramScore */
  border-radius: 5px;
  background-color: #f9f9f9; /* Фон как у ProgramScore */
}

h4 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333; /* Цвет как у h3 в ProgramScore */
  border-bottom: 1px solid #ddd; /* Разделитель как у h3 */
  padding-bottom: 10px; /* Отступ под разделителем */
}

h5 {
  margin-top: 15px;
  margin-bottom: 10px;
  font-size: 0.9em;
}

ul {
  list-style: none;
  padding-left: 0;
  margin-top: 10px; /* Добавим отступ сверху для списка */
}

li {
  /* margin-bottom: 10px; */ /* Убираем старый отступ */
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee; /* Добавляем разделитель */
  padding: 10px 0; /* Добавляем вертикальные отступы */
}

/* Стилизуем кнопку внутри списка */
li .btn {
  min-width: 160px; /* Задаем минимальную ширину */
  text-align: center; /* Центрируем текст */
  padding: 5px 10px; /* Убедимся, что паддинг одинаковый */
  box-sizing: border-box; /* Учитываем padding и border в ширине */
}

/* Убираем границу у последнего элемента списка */
li:last-child {
  border-bottom: none;
}

/* Адаптивность для маленьких экранов */
@media (max-width: 480px) {
  li {
    flex-direction: column; /* Элементы друг под другом */
    align-items: stretch; /* Растягиваем элементы по ширине */
    gap: 8px; /* Добавляем отступ между названием и кнопкой */
  }

  li .btn {
    min-width: auto; /* Убираем минимальную ширину */
    width: 100%; /* Кнопка занимает всю ширину */
  }
  
  .marked-status, .pending-status { /* Применяем и к новому статусу */
    text-align: center; /* Центрируем текст об отметке */
    margin-top: -5px; /* Немного пододвигаем вверх */
    /* Переопределяем выравнивание текста на центр для мобильных */
    text-align: center !important; 
  }
}

.marked-status {
  font-style: italic;
  color: #6c757d;
  font-size: 0.9em;
  text-align: right; /* Прижимаем текст вправо по умолчанию */
}

.btn-primary {
  background-color: #28a745;
  color: #fff;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
}

.btn-primary:hover {
  background-color: #218838;
}

.loading-indicator, .error-message {
  color: #6c757d;
}

.error-message {
  color: #dc3545;
}

.message {
  margin-top: 15px;
  padding: 10px;
  border-radius: 4px;
  font-size: 0.9em;
}

.message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.message.info {
  background-color: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}

/* Стиль для статуса "не решено" (по аналогии с marked-status) */
.pending-status {
  font-style: italic;
  color: #6c757d; /* Серый цвет */
  font-size: 0.9em;
  text-align: right; /* Прижимаем текст вправо по умолчанию */
}

/* Стили для ссылок внутри span */
li span:first-child :deep(a) {
  color: var(--secondary-color, #4285f4); 
  text-decoration: none; 
}

li span:first-child :deep(a:hover) {
  filter: brightness(0.8);
}
</style> 