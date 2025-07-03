<template>
  <div v-if="score !== null && score !== undefined" class="profile-section profile-score-container">
    <h3>{{ $t('profile.programScore') }}</h3>
    <p class="score-value">{{ score }}</p>
    <!-- Здесь можно добавить ссылку на историю баллов, если она будет -->
  </div>
</template>

<script>
export default {
  name: 'ProfileScore',
  props: {
    score: {
      type: Number,
      required: false,
      default: null
    }
  }
};
</script>

<style scoped>
/* Используем общие стили секции профиля, если они есть */
.profile-score-container {
  /* Стили специфичные для блока баллов */
  text-align: center;
  padding: 15px 20px; /* Немного уменьшим вертикальный паддинг */
}

.profile-score-container h3 {
  margin-top: 0;
  margin-bottom: 5px; /* Уменьшим отступ снизу */
  color: var(--dark-grey); /* Сделаем заголовок менее ярким */
  font-size: 1em; /* Стандартный размер шрифта заголовка секции */
  font-weight: 600;
}

.profile-score-container .score-value {
  font-size: 1.8em; /* Увеличим размер числа баллов */
  font-weight: bold;
  color: var(--primary-color); /* Основной цвет для акцента */
  margin: 0;
}
</style> 