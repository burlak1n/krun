<template>
  <div class="main-content">
  <section class="home-start" v-if="mounted">
    <div class="start-container">
        <div class="hero-content">
          <div class="hero-title-section">
            <h1 class="main-title phonk-text">{{ $t('start.maintitle') }}</h1>
            <p class="subtitle">
                {{ $t('start.subtitle') }}
            </p>
            <div class="info-text-container">
              <p class="event-date">{{ $t('start.eventdate') }}</p>
              <p class="event-place">{{ $t('start.eventplace') }}</p>
            </div>
          </div>
          <div class="buttons-info-section">
              <div class="buttons-container">
              <router-link to="/registration">
                <BaseButton 
                  class="register-btn" 
                  variant="register">
                  {{ $t('start.registration') }}
                </BaseButton>
              </router-link>
              
              <router-link to="/quest">
                <BaseButton 
                  class="start-quest-btn" 
                  variant="start-quest">
                  {{ $t('start.startquest') }}
                </BaseButton>
              </router-link>
            </div>
          </div>
      </div><div class="hero-img-section">
        <img src="@/assets/images/decor.svg" class ="hero-img" />
        </div>
      </div>
    <div v-if="userName">
      {{ userName }}
    </div>
  </section>
  <section class="home-cards">
    <div class="cards-container">
          <div class="card-content">
            <p class="card-title">{{ $t('start.card1')}}</p>
          </div>
          <div class="card-content">
            <p class="card-title">{{ $t('start.card2')}}</p>
          </div>
          <div class="card-content">
            <p class="card-title">{{ $t('start.card3')}}</p>
          </div>
          <div class="card-content">
            <p class="card-title">{{ $t('start.card4')}}</p>
          </div>
    </div>
  </section>
  </div>
</template>

<script>
import BaseButton from '@/components/UI/BaseButton.vue';
export default {
  name: 'HomeStart',
  components: {
    BaseButton
  },
  props: {
    userData: {
      type: Object,
      default: () => ({
        full_name: ''
      })
    }
  },
  data() {
    return {
      mounted: false
    }
  },
  mounted() {
    this.mounted = true
  },
  beforeDestroy() {
    // Очистка всех возможных слушателей событий
  },
  computed: {
    userName() {
      return this.userData?.full_name || ''
    }
  }
}
</script>

<style scoped>
.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 60px;
}
.home-start {
  display: flex;
  justify-content: center;
  background-size: contain;
  background-color: #122937;
  background-repeat: no-repeat;
  max-width: 1440px;
  z-index: 100;
  margin: 0px auto;
  box-sizing: border-box;
}
.start-container {
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: start;
  padding-bottom: 12px;
  box-sizing: border-box;
}
.hero-img-section {
  position: relative;
  right: 30px;
  top: -15px;
}
.hero-img-mobile {
  display: none;
  width: 110%;
}
.hero-img {
  width: 110%;
  border-radius: 0px 0px 0px 0px;
  min-width: 300px;
}

.hero-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-left: 0px;
  gap: 32px;
}

.hero-title-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 955px;
  margin-top: 100px;
}

.main-title {
  color: var(--white);
  font-family: 'Weather';
  font-size: 84px;
  font-style: normal;
  font-weight: 500;
  line-height: 100%;
  z-index: 1;
  position: relative;
  margin: 0px;
}

.subtitle {
  font-size: 30px;
  font-family: 'Mont_R';
  color: #FFFFFF;
  margin: 0px;
  margin-bottom: 0px;
  line-height: 100%;
  max-width: 800px;

}
.bold-subtitle {
  font-family: 'Mont_SB';
}

.buttons-info-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
}
.buttons-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-text-container {
  display: flex;
  flex-direction: column;
  gap: 0;
}


.event-date {
  font-size: 30px;
  color: #FFFFFF;
  margin: 0;
  font-weight: bold;
  margin-left: 0px;
  font-family: 'Mont_R';
}

.event-place {
  font-size: 30px;
  color: #FFFFFF;
  font-weight: bold;
  margin-left: 0px;
  font-family: 'Mont_R';
  padding: 0px;
  margin: 0px;
}

.home-cards {
  color: white;
  position: relative;
  overflow: hidden;
}

.cards-container {
  max-width: 1440px;
  display: flex;
  gap: 16px;
  margin: 0 auto;
  align-items: center;
  padding: 0;
  box-sizing: border-box;
}
.card-content { 
  font-size: 30px;
  color: var(--text-color);
  background-color: var(--white);
  font-family: 'Mont_SB';
  padding: 16px 32px ;
  border-radius: 12px;
  border: none;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}
.card-title {
  text-align: center;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 320px;
}
.card:hover {
  transform: perspective(800px) rotateY(0);
}

@media (max-width: 1360px) {}
  
@media (max-width: 1150px) {
  .cards-container {
    display: grid;
   grid-template-columns: 1fr 1fr;
   grid-template-rows: auto;
  }
}
  
@media (max-width: 1050px) {}

@media (max-width: 870px) {

}


@media (max-width: 768px) {}

@media (max-width: 600px) {}

@media (max-width: 480px) {
  .main-content {
    gap: 30px;
  }
  .hero-content {
    gap: 20px;
  }
  .hero-title-section {
    margin: 0;
    gap: 16px;

  }
.main-title {
  color: var(--Colors-white, #FFF);
 font-family: 'Weather';
 font-size: 54px;
}
.subtitle {
  font-size: 20px;
  width: 329px;
}
.event-date, .event-place {
  font-size: 20px;
}
.buttons-container {
  gap: 16px;
  justify-content: center;
}
.hero-img {
  width: 330px;
  right: -50px;
}

.cards-container {
  max-width: 380px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto;
  gap: 16px;
  margin: 0 auto;
  align-items: center;
  padding: 0;
  box-sizing: border-box;
}
.card-content { 
  font-size: 15px;
  color: var(--text-color);
  background-color: var(--white);
  font-family: 'Mont_R';
  padding: 12px ;
  border-radius: 12px;
  border: none;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}
.card-title {
  text-align: center;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

} 

@media (max-width: 360px) {}
</style>