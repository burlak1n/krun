// Централизованный экспорт компонентов домашней страницы
// Это улучшает организацию кода и уменьшает дублирование импортов

import HomeHeader from './HomeHeader.vue';
import HomeStart from './HomeStart.vue';
import HomeParticipation from './HomeParticipation.vue';
import HomeFAQ from './HomeFAQ.vue';
import HomePartners from './HomePartners.vue';
import HomeFooter from './HomeFooter.vue';

export {
  HomeHeader,
  HomeStart,
  HomeParticipation,
  HomeFAQ,
  HomePartners,
  HomeFooter
}; 