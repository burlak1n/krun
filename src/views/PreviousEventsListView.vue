<template>
  <div class="previous-events-list-wrapper">
    <HomeHeader />
    <div class="page-container">
      <h1 class="main-title phonk-text">{{ $t('previousEventsList.pageTitle') }}</h1>
      <p class="description">{{ $t('previousEventsList.description') }}</p>

      <div class="event-block">
        <div class="event-content">
          <div class="event-info">
            <h2 class="event-title">{{ $t('previousEventsList.eventTitle') }}</h2>
            
            <div class="info-section">
              <p>{{ $t('previousEventsList.description_hserun29') }}</p>
            </div>

            <div class="info-section">
              <p class="info-title">{{ $t('previousEventsList.questBlocksTitle') }}</p>
              <ul>
                <li v-for="(block, index) in $tm('previousEventsList.questBlocksList')" :key="index">
                  {{ block }} 
                </li>
              </ul>
            </div>

            <div class="info-section">
              <p class="info-title">{{ $t('previousEventsList.partnersTitle') }}</p>
              <p>{{ $t('previousEventsList.partnersText') }}</p>
            </div>

            <div class="info-section">
              <p>{{ $t('previousEventsList.integrationText') }}</p>
            </div>

            <div class="button-group">
              <button @click="goToResults('HSERUN29')" class="action-button results-button">
                {{ $t('previousEventsList.resultsButton') }}
              </button>
              <button @click="goToAnswers('HSERUN29')" class="action-button answers-button">
                {{ $t('previousEventsList.answersButton') }}
              </button>
            </div>
          </div>
          <div class="participation-right-section">
            <img src="@/assets/images/previous29-3.jpg" alt="" class="participation-first-image">
            <img src="@/assets/images/previous29-1.jpg" alt="" class="participation-second-image">
            <img src="@/assets/images/previous29-2.jpg" alt="" class="participation-third-image">
          </div>
        </div>
      </div>
      <!-- Сюда можно будет добавлять другие прошедшие квесты -->
    </div>
    <HomeFooter />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
// import { useI18n } from 'vue-i18n'; // Закомментировано
// import { computed } from 'vue'; // Закомментировано
import HomeHeader from '@/components/Home/HomeHeader.vue';
import HomeFooter from '@/components/Home/HomeFooter.vue';

const router = useRouter();
// const { t, tm } = useI18n(); // Закомментировано

/* // Закомментировано
const questBlocks = computed(() => {
  const blocks = tm('previousEventsList.questBlocksList');
  return Array.isArray(blocks) ? blocks : [];
});
*/

const goToResults = (eventName) => {
  router.push({ name: 'previousEventStats', params: { event_name: eventName } });
};

// Плейсхолдер для кнопки "Узнать ответы"
const goToAnswers = (eventName) => {
  // alert(`Функционал "Узнать ответы" для события ${eventName} еще не реализован.`);
  // TODO: Реализовать переход или отображение ответов
  // Например: router.push({ name: 'previousEventAnswers', params: { event_name: eventName } });
  router.push({ name: 'previousEventAnswers', params: { event_name: eventName } }); // Переход на новый маршрут
};
</script>

<style scoped>
.previous-events-list-wrapper {
  background: none;
}

.page-container {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
  font-family: 'Involve', sans-serif;
}

.main-title {
  -webkit-text-stroke: 2px var(--hse-red);
  font-size: clamp(20px, 2.5vw, 36px);
  color: var(--hse-red); /* Изменен цвет на синий */
  text-align: left; /* Выравнивание по левому краю */
  margin-bottom: 20px;
  font-weight: bold;
  /* Можно добавить стили для шрифта, если он отличается */
}

.description {
  text-align: left; /* Выравнивание по левому краю */
  margin-bottom: 40px;
  color: #333;
  line-height: 1.6;
}

.event-block {
  background-color: #fff;
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 40px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.event-content {
  display: flex;
  gap: 40px;
}

.event-info {
  flex: 1;
}

.event-title {
  font-family: 'Phonk Sans', sans-serif; /* Применяем Phonk Sans */
  font-size: clamp(28px, 2.5vw, 36px); /* Размер как на макете */
  color: var(--hse-blue);
  margin-bottom: 25px;
  -webkit-text-stroke: 2px var(--hse-blue);
}

.info-section {
  margin-bottom: 20px;
}

.info-title {
  font-weight: bold;
  color: var(--hse-blue);
  margin-bottom: 5px;
}

.info-section ul {
  list-style: disc;
  padding-left: 20px;
  margin: 0;
}

.info-section li {
  margin-bottom: 3px;
}

.info-section p {
    margin: 0;
    line-height: 1.5;
}

.button-group {
  margin-top: 30px;
  display: flex;
  gap: 15px;
}

.action-button {
  padding: 10px 20px;
  font-size: 1rem;
  color: white;
  background-color: var(--hse-blue);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  font-family: 'Involve', sans-serif;
}

.action-button:hover {
  transform: translateY(-2px);
}

.action-button:active {
  transform: translateY(0);
}

/* Стили для изображений - скопированы из HomeParticipation */
.participation-right-section {
  flex: 1;
  position: relative;
  min-width: 340px; /* Или другая ширина, если нужно */
}

.participation-first-image {
  position: absolute;
  width: 80%; /* Можно настроить */
  top: 50px;  /* Можно настроить */
  left: 0;    /* Можно настроить */
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(204, 0, 0, 0.15); /* Красная тень */
}

.participation-second-image {
  position: absolute;
  width: 80%; /* Можно настроить */
  top: 30%; /* Примерное значение, настроить */
  right: 14px; /* Можно настроить */
  z-index: 1;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(204, 0, 0, 0.15); /* Красная тень */
}

.participation-third-image {
  position: absolute;
  width: 80%; /* Можно настроить */
  left: 28px; /* Можно настроить */
  top: 60%;  /* Примерное значение, настроить */
  z-index: 2; /* Выше второго */
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(204, 0, 0, 0.15); /* Красная тень */
}

.results-button {
  background-color: var(--hse-red);
}

/* Адаптация для мобильных */
@media (max-width: 768px) {
  .event-content {
    flex-direction: column;
  }
  .participation-right-section {
    display: none;
  }
}

</style> 