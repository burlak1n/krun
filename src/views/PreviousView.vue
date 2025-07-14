<template>
    <div>
        <HomeHeader />  

      <!-- Секция лидерборда -->
      <div class="leaderboard-section">
        <h1 class="phonk-title phonk-text">HSE RUN 29</h1>

        <!-- Восстановлена кнопка "Моя команда" -->
        <div v-if="showMyTeamButton" class="my-team-button-container">
          <button @click="scrollToMyTeam" class="my-team-btn">
            {{ $t('previousQuests.leaderboard.myTeamButton') }}
          </button>
        </div>

        <h2>{{ $t('previousQuests.leaderboard.title') }}</h2>
        <!-- Восстановлена проверка userLoading -->
        <div v-if="loading || userLoading" class="loading-message">
          {{ $t('previousQuests.leaderboard.loading') }}
        </div>
        <!-- Восстановлена проверка userError (но ошибка пользователя не блокирует отображение) -->
        <div v-else-if="error" class="error-message">
          {{ $t('previousQuests.leaderboard.errorPrefix') }} {{ error }}
          <span v-if="userError"> (Ошибка загрузки данных пользователя: {{ userError }})</span>
        </div>
        <div v-else>
          <!-- Русский лидерборд -->
          <div class="language-leaderboard">
            <h3>{{ $t('previousQuests.leaderboard.russianTitle') }}</h3>
            <div v-if="russianLeaderboard.length > 0">
              <table class="leaderboard-table">
                <thead>
                  <tr>
                    <th>{{ $t('previousQuests.leaderboard.rankHeader') }}</th>
                    <th>{{ $t('previousQuests.leaderboard.teamNameHeader') }}</th>
                    <th>{{ $t('previousQuests.leaderboard.scoreHeader') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <!-- Восстановлены :id и :class -->
                  <tr v-for="(team, index) in russianLeaderboard"
                      :key="team.command_name + '-ru'"
                      :id="generateTeamId(team.command_name)"
                      :class="{ 'my-team-row': team.command_name === userTeamName }">
                    <td :data-label="$t('previousQuests.leaderboard.rankHeader')">{{ index + 1 }}</td>
                    <td :data-label="$t('previousQuests.leaderboard.teamNameHeader')">{{ team.command_name }}</td>
                    <td :data-label="$t('previousQuests.leaderboard.scoreHeader')">{{ team.total_score.toFixed(1) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="no-data-message">
              {{ $t('previousQuests.leaderboard.noRussianTeams') }}
            </div>
          </div>

          <!-- Английский лидерборд -->
          <div class="language-leaderboard">
            <h3>{{ $t('previousQuests.leaderboard.englishTitle') }}</h3>
            <div v-if="englishLeaderboard.length > 0">
              <table class="leaderboard-table">
                <thead>
                  <tr>
                    <th>{{ $t('previousQuests.leaderboard.rankHeader') }}</th>
                    <th>{{ $t('previousQuests.leaderboard.teamNameHeader') }}</th>
                    <th>{{ $t('previousQuests.leaderboard.scoreHeader') }}</th>
                  </tr>
                </thead>
                <tbody>
                   <!-- Восстановлены :id и :class -->
                  <tr v-for="(team, index) in englishLeaderboard"
                      :key="team.command_name + '-en'"
                      :id="generateTeamId(team.command_name)"
                      :class="{ 'my-team-row': team.command_name === userTeamName }">
                    <td :data-label="$t('previousQuests.leaderboard.rankHeader')">{{ index + 1 }}</td>
                    <td :data-label="$t('previousQuests.leaderboard.teamNameHeader')">{{ team.command_name }}</td>
                    <td :data-label="$t('previousQuests.leaderboard.scoreHeader')">{{ team.total_score.toFixed(1) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="no-data-message">
               {{ $t('previousQuests.leaderboard.noEnglishTeams') }}
            </div>
          </div>

        </div>
      </div>
      <!-- Конец секции лидерборда -->

      <!-- Секция структуры квеста -->
      <!-- <div class="quest-structure-section">
          <h2>{{ $t('previousQuests.questStructure.title') }}</h2>
          <div v-if="questLoading" class="loading-message">
              {{ $t('previousQuests.questStructure.loading') }}
          </div>
          <div v-else-if="questError" class="error-message">
              {{ $t('previousQuests.questStructure.errorPrefix') }} {{ questError }}
          </div>
          <div v-else-if="!questStructure || questStructure.blocks.length === 0" class="no-data-message">
              {{ $t('previousQuests.questStructure.noData') }}
          </div>
          <div v-else>
              <div v-for="block in questStructure.blocks" :key="block.id" class="quest-block">
                  <h3>Блок {{ block.id }}: {{ block.title }} (Язык ID: {{ block.language_id }})</h3>
                  <ul>
                      <li v-for="question in block.questions" :key="question.id">
                          Вопрос {{ question.id }}: {{ question.title }}
                      </li>
                  </ul>
              </div>
          </div>
      </div> -->
      <!-- Конец секции структуры квеста -->

      <HomeFooter />
    </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import HomeHeader from '@/components/Home/HomeHeader.vue';
import HomeFooter from '@/components/Home/HomeFooter.vue';

export default {
  name: 'PreviousView',
  components: {
    HomeHeader,
    HomeFooter,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const leaderboardData = ref([]);
    const loading = ref(false); // Загрузка лидерборда
    const error = ref(null); // Ошибка загрузки ТОЛЬКО лидерборда (не юзера)

    // Восстановлены refs для данных пользователя
    const userTeamName = ref(null);
    const userLoading = ref(false);
    const userError = ref(null); // Ошибка загрузки ТОЛЬКО юзера

    // Состояние для структуры квеста
    const questStructure = ref(null);
    const questLoading = ref(false);
    const questError = ref(null);

    // Получаем eventName из параметров маршрута
    const eventName = ref(route.params.event_name);

    // Восстановлена функция генерации ID
    const generateTeamId = (name) => {
      const safeName = name.toLowerCase().replace(/[^a-z0-9а-яё]+/gi, '-').replace(/-+/g, '-');
      return `team-${safeName}`;
    };

    const fetchLeaderboard = async (eventName) => {
        loading.value = true;
        error.value = null; // Сбрасываем ошибку лидерборда
        leaderboardData.value = [];
        try {
            const response = await axios.get(`/api/auth/commands/leaderboard/${eventName}`);
            if (response.data && response.data.ok === true && response.data.data && Array.isArray(response.data.data.leaderboard)) {
                leaderboardData.value = response.data.data.leaderboard;
            } else {
                 // Если бэкенд вернул ok: false, но это не ошибка доступа, считаем это ошибкой данных
                 // (Предполагаем, что >=400 уйдут в catch)
                 if (response.status < 400) {
                     error.value = response.data?.message || 'Некорректный ответ от сервера (лидерборд).';
                 }
            }
        } catch (err) {
            // Оставляем обработку других ошибок (404, 500 и т.д.)
            error.value = err.response?.data?.message || err.message || 'Неизвестная ошибка (лидерборд)';
            if (err.response?.status === 404) {
                error.value = `Лидерборд для события '${eventName}' не найден.`;
            }
            console.error("Ошибка при загрузке лидерборда:", err);
        } finally {
            loading.value = false;
        }
    };

    const fetchCurrentUserTeam = async () => {
        userLoading.value = true;
        userError.value = null; // Сбрасываем ошибку пользователя
        userTeamName.value = null;
        try {
            const response = await axios.get('/api/auth/me');
            if (response.status === 401) {
                console.log("Пользователь не авторизован, кнопка и подсветка не будут доступны.");
                // НЕ устанавливаем userError
                return;
            }
            if (!response.data || response.status >= 400) {
                 throw new Error(response.data?.message || "Ошибка загрузки данных пользователя");
            }
            if (response.data.commands && response.data.commands.length > 0) {
                userTeamName.value = response.data.commands[0].name;
                 console.log(`Команда пользователя: ${userTeamName.value}`);
            }
        } catch (err) {
            // Сохраняем ошибку пользователя отдельно, она не блокирует лидерборд
            userError.value = err.message || 'Неизвестная ошибка (пользователь)';
            console.error("Ошибка при загрузке данных пользователя:", err);
        } finally {
            userLoading.value = false;
        }
    };

    // Функция для загрузки структуры квеста
    const fetchQuestStructure = async (currentEventName) => {
        questLoading.value = true;
        questError.value = null;
        questStructure.value = null;
        try {
            // Предполагаем, что токен организатора уже добавлен глобально axios interceptor'ом
            const response = await axios.get(`/api/v1/quest/events/${currentEventName}/answers`);
             if (response.data) { // Проверяем наличие данных
                 questStructure.value = response.data;
                 console.log("Структура квеста загружена:", questStructure.value);
             } else {
                 // Если данные не пришли, но статус < 400
                 questError.value = 'Сервер вернул пустой ответ (структура квеста).';
             }
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                 questError.value = 'Доступ запрещен. Необходима роль организатора.';
            } else {
                 questError.value = err.response?.data?.detail || err.message || 'Неизвестная ошибка (структура квеста)';
            }
            console.error("Ошибка при загрузке структуры квеста:", err);
        } finally {
            questLoading.value = false;
        }
    };

    // Восстановлена параллельная загрузка
    onMounted(async () => {
      if (!eventName.value) {
          console.error("Имя события не найдено в параметрах маршрута!");
          error.value = "Имя события не указано в URL.";
          questError.value = "Имя события не указано в URL.";
          loading.value = false;
          questLoading.value = false;
          return;
      }
      await Promise.all([
          fetchLeaderboard(eventName.value),
          fetchCurrentUserTeam(),
          fetchQuestStructure(eventName.value) // Добавляем загрузку структуры квеста
      ]);
    });

    const russianLeaderboard = computed(() => {
      return leaderboardData.value.filter(team => team.language_name === 'ru');
    });

    const englishLeaderboard = computed(() => {
      return leaderboardData.value.filter(team => team.language_name === 'en');
    });

    // Восстановлено computed свойство для видимости кнопки
    const showMyTeamButton = computed(() => {
      return !userLoading.value && // Данные пользователя загружены (или была ошибка, но не 401)
             userTeamName.value && // У пользователя есть команда
             !loading.value && // Лидерборд загружен
             leaderboardData.value.some(team => team.command_name === userTeamName.value); // Команда есть в лидерборде
    });

    // Восстановлен метод для скролла
    const scrollToMyTeam = () => {
      if (!userTeamName.value) return;
      const teamId = generateTeamId(userTeamName.value);
      const element = document.getElementById(teamId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        console.warn(`Элемент с ID ${teamId} не найден для скролла.`);
      }
    };

    // Восстановлен return
    return {
      loading,
      userLoading,
      error,
      userError,
      userTeamName, // Нужно для :class
      russianLeaderboard,
      englishLeaderboard,
      showMyTeamButton,
      scrollToMyTeam,
      generateTeamId,
      // Возвращаем новые refs
      questStructure,
      questLoading,
      questError,
      eventName // Возвращаем eventName для возможного использования в шаблоне
    };
  }
}
</script>

<style scoped>
/* @font-face удален, так как он теперь в глобальных стилях */

.event-title {
  font-family: 'Phonk Sans', sans-serif; /* Оставляем здесь, если это другой стиль */
  color: var(--hse-blue);
}

.leaderboard-section {
  background-color: #fff;
  border: 1px solid var(--hse-blue);
  border-radius: 10px;
  padding: 20px;
  margin: 20px auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 1000px;
  font-family: 'Involve', sans-serif;
}

.phonk-title {
  font-size: clamp(45px, 3vw, 50px);
  color: var(--hse-blue);
  -webkit-text-stroke: 3px var(--hse-blue);
  margin-bottom: 0;
  margin-right: 60px;
  box-sizing: border-box;
  z-index: 1;
  position: relative;
  max-width: 1275px;
}

.language-leaderboard {
    margin-bottom: 2rem;
}

.language-leaderboard h3 {
    margin-bottom: 0.5rem;
}

.leaderboard-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.leaderboard-table th:first-child,
.leaderboard-table td:first-child {
  width: 50px;
  text-align: center;
  white-space: nowrap;
}

.leaderboard-table th:last-child,
.leaderboard-table td:last-child {
    text-align: right;
    white-space: nowrap;
}

.leaderboard-table td {
    overflow-wrap: break-word;
    word-break: break-word;
    /* Базовые стили */
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

.leaderboard-table th {
  background-color: #f2f2f2;
}

.loading-message,
.error-message,
.no-data-message {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 4px;
}

.loading-message {
  background-color: #e0e0e0;
}

.error-message {
  background-color: #ffdddd;
  color: #d8000c;
  border: 1px solid #d8000c;
}

.no-data-message {
    background-color: #eef;
}

/* Адаптация таблицы для мобильных устройств */
@media screen and (max-width: 600px) {
  .leaderboard-table thead {
    border: none;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }

  .leaderboard-table tr {
    display: block;
    margin-bottom: .625em;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .leaderboard-table td {
    display: block;
    text-align: right; /* Выравниваем ВСЕ значения справа по умолчанию */
    font-size: 0.75em; /* Уменьшаем шрифт */
    border: none; /* Убираем рамки ячеек */
    border-bottom: 1px dotted #ccc; /* Добавляем разделитель */
    padding: 6px 10px 6px 50%; /* Уменьшаем padding, сохраняем место для метки */
    position: relative;
  }

  .leaderboard-table tr td:last-child {
      border-bottom: none; /* Убираем нижнюю границу у последней ячейки */
  }

  /* Запрещаем перенос для номера и баллов */
  .leaderboard-table td:first-child,
  .leaderboard-table td:last-child {
    white-space: nowrap;
    width: auto; /* Сбрасываем десктопную ширину */
    text-align: right; /* Номер и баллы выравниваем справа */
  }

  /* Имя команды выравниваем слева */
  .leaderboard-table td[data-label*="Название команды"],
  .leaderboard-table td[data-label*="Team Name"] {
      text-align: left;
      white-space: normal; /* Разрешаем перенос имени */
  }

  .leaderboard-table td::before {
    content: attr(data-label);
    position: absolute;
    left: 10px; /* Отступ метки */
    width: 45%; /* Ширина метки */
    padding-right: 10px;
    white-space: nowrap;
    text-align: left;
    font-weight: bold;
    /* Убедимся, что размер шрифта метки соответствует ячейке */
    font-size: 1em; /* Относительно font-size ячейки (0.75em от базового) */
  }

  .leaderboard-table tr.my-team-row {
    background-color: #ffebee;
  }
  .leaderboard-table tr.my-team-row td {
    background-color: transparent;
  }
}

/* Восстановлены стили для кнопки "Моя команда" */
.my-team-button-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.my-team-btn {
  padding: 0.5rem 1rem;
  background-color: var(--hse-blue);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'Involve', sans-serif;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
}

.my-team-btn:hover {
  background-color: #0056b3;
}

/* Восстановлены стили для постоянной подсветки своей команды */
.leaderboard-table tr.my-team-row td {
  background-color: #ffebee;
}

/* Стили для секции структуры квеста */
.quest-structure-section {
    background-color: #f9f9f9;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 20px;
    margin: 20px auto;
}

.quest-block {
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
}

.quest-block:last-child {
    border-bottom: none;
}

.quest-block h3 {
    color: var(--hse-blue);
    margin-bottom: 10px;
}

.quest-block ul {
    list-style-type: disc;
    margin-left: 20px;
}

.quest-block li {
    margin-bottom: 5px;
}
</style>

