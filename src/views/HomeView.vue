<!-- src/views/HomeView.vue -->
<template>
  <div class="home">
    <HomeHeader />
    <main class="main-content">
      <HomeStart/>
      <HomeParticipation />
      <HomeFAQ/>
    </main>
    <HomeFooter />
  </div>
</template>

<script>
import HomePartners from '@/components/Home/HomePartners.vue';
import HomeFAQ from '@/components/Home/HomeFAQ.vue';
import HomeStart from '@/components/Home/HomeStart.vue';
import HomeHeader from '@/components/Home/HomeHeader.vue';
import HomeParticipation from '@/components/Home/HomeParticipation.vue';
import HomeFooter from '@/components/Home/HomeFooter.vue';
import ProfileMain from '@/components/Profile/ProfileMain.vue';

export default {
  name: 'HomeView',
  components: {
    HomeHeader,
    HomeStart,
    HomeParticipation,
    HomeFAQ,
    HomePartners,
    HomeFooter,
    ProfileMain
  },
  mounted() {
    document.body.classList.add('home-page');
  },
  beforeUnmount() {
    document.body.classList.remove('home-page');
  }
};
</script>

<style>
/* Глобальные стили без scoped */
body.home-page {
  background-image: none !important;
}
body.home-page #app {
  background-image: none !important;
}
</style>

<style scoped>
.home {
  overflow: hidden;
}
.main-content {
  display: flex;
  flex-direction: column;
  gap: 100px;
}
.runrun-section{
  margin-top: 80px;
  max-width: 1360px;
  margin-left: auto;
  margin-right: auto;
}
.runrun-img {
width: 100%;
z-index: 1000;
}

@media (max-width: 760px) {
  .main-content {
    gap: 60px;
  }
}

@media (max-width: 430px) {
  .main-content {
    gap: 60px;
  }
}
</style>
