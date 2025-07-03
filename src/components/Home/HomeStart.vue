<template>
  <section class="home-start" v-if="mounted">
    <div class="start-container">
      <div class="main-content">
        <div class="tag-line">{{ $t('start.tagline') }}</div>
        <div class="hero-content">
          <div class="hero-title-section">
            <h1 class="main-title phonk-text">{{ $t('start.maintitle') }}</h1>
            <p class="subtitle">
                <span class="bold-subtitle">{{ $t('start.subtitle1') }}</span> <br />
                {{ $t('start.subtitle2') }}
            </p>
          </div>
          
          <div class="buttons-info-section">
              <div class="buttons-container">
              <router-link to="/registration">
                <BaseButton 
                  class="register-btn" 
                  type="primary">
                  {{ $t('start.registration') }}
                </BaseButton>
              </router-link>
              
              <router-link to="/quest">
                <BaseButton 
                  class="start-quest-btn" 
                  type="outlined">
                  {{ $t('start.startquest') }}
                </BaseButton>
              </router-link>
            </div>
            <div class="info-text-container">
              <p class="rules-link"><a href="https://telegra.ph/Instrukciya-HSE-RUN29-ot-Ingrup-StS-04-07">{{ $t('start.rules') }}</a></p>
              <p class="event-date">{{ $t('start.eventdate') }}</p>
              <p class="event-place">{{ $t('start.eventplace') }}</p>
            </div>
          </div>
          
          </div>
      </div>
      <div class="hero-img-section">
        <img src="@/assets/images/hero.png" class ="hero-img" />
        <img src="@/assets/images/hero-mobile.png" class="hero-img hero-img-mobile" />
      </div>
      <div class="brand-mark">hse run 29</div>
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
</template>

<script>
import BaseButton from '@/components/UI/BaseButton.vue';
import LanguageSwitcher from '../UI/LanguageSwitcher.vue';

export default {
  name: 'HomeStart',
  components: {
    BaseButton,
    LanguageSwitcher
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
.home-start {
  display: flex;
  justify-content: center;
  background-image: url('@/assets/images/плашка.svg');
  background-size: contain;
  background-color: #F3F3F3;
  background-repeat: no-repeat;
  max-width: 1360px;
  z-index: 100;
  margin: 48px auto;
  height: 600px;
  box-sizing: border-box;
}
.start-container {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  padding-bottom: 12px;
  box-sizing: border-box;
}
.hero-img-section {
  position: absolute;
  right: 1px;
  top: -9px;
  width: 50%;
}
.hero-img-mobile {
  display: none;
}
.hero-img {
  width: 100%;
  border-radius: 0px 0px 80px 0px;
}
.tag-line {
  font-family: 'DisruptorScript';
  position: absolute;
  top: -50px;
  left: 60px;
  color: var(--hse-blue);
  font-size: 66px;
  z-index: 100;
}

.main-content {
  display: flex;
  flex-direction: column;
  padding-bottom: 93px;
  overflow: hidden;
  
}
.hero-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-left: 53px;
}

.hero-title-section {
  display: flex;
  flex-direction: column;
  gap: 19px;
}

.main-title {
  font-size: clamp(45px, 3vw, 50px);
  color: var(--hse-red);
  -webkit-text-stroke: 3px var(--hse-red);
  margin-bottom: 0;
  margin-right: 60px;
  box-sizing: border-box;
  margin-top: 40.5px;
  z-index: 1;
  position: relative;
  max-width: 1275px;
}

.subtitle {
  font-size: 24px;
  font-family: 'InvolveMedium';
  color: #191A1E;
  margin: 0px;
  margin-bottom: 15px;
  line-height: 1.5;
  margin-bottom: 40.5px;
  max-width: 540px;

}
.bold-subtitle {
  font-family: 'InvolveBold';
}

.buttons-info-section {
  display: flex;
  flex-direction: column;
  gap: 5px;
  justify-content: center;
}
.buttons-container {
  display: flex;
  margin-top: 50px;
  gap: 16px;
  margin-bottom: 10px;
}

.info-text-container {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.rules-link {
  font-size: 25px;
  color: var(--hse-blue);
  margin: 0;
  font-weight: bold;
  margin-left: 12px;
  font-family: 'InvolveMedium';
}

.rules-link a {
  color: var(--hse-blue);
  text-decoration: none;
}

.event-date {
  font-size: 25px;
  color: #191A1E;
  margin: 0;
  font-weight: bold;
  margin-left: 12px;
  font-family: 'InvolveMedium';
}

.register-btn {
  background-color: var(--hse-red);
  color: white;
  border: none;
  border-radius: 24px;
  padding: 22px 30px;
  font-size: 20px;
  font-family: 'InvolveMedium';
  outline: none;
  text-decoration: none;
}
a {
    text-decoration: none;
}

.start-quest-btn {
  background-color: white;
  color: var(--hse-red);
  border: 2px solid var(--hse-red);
  border-radius: 24px;
  padding: 20px 28px;
  font-size: 20px;
  font-family: 'InvolveMedium';
  outline: none;
}

.event-place {
  font-size: 25px;
  color: #191A1E;
  margin-top: 0;
  font-weight: bold;
  margin-left: 12px;
  font-family: 'InvolveMedium';
  padding: 0px;
}

.brand-mark {
  position: absolute;
  bottom: -60px;
  right: 15px;
  color: var(--hse-blue);
  font-size: 66px;
  font-family: 'DisruptorScript';
}

.home-cards {
  padding: 40px 0px;
  color: white;
  position: relative;
  overflow: hidden;
}

.cards-container {
  max-width: 1360px;
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  align-items: center;
  padding: 0;
  box-sizing: border-box;
}
.card-content { 
  font-size: 24px;
  color: #333030;
  font-family: 'InvolveMedium';
  border: 2px solid var(--hse-red);
  padding: 30px 70px ;
  border-radius: 39px;
  max-height: 114px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}
.card-title {
  max-width: 140px;
  text-align: center;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card:hover {
  transform: perspective(800px) rotateY(0);
}

@media (max-width: 1360px) {
  .home-start {
    height: 40%;
  }
  .start-container{
    max-height: 580px;
  }
  .main-title{
    font-size: 40px;
    -webkit-text-stroke: 2px var(--hse-red);
    margin-top: 40px;
  }
  .buttons-info-section{
    margin-top: 2%;
  }
  .buttons-container{
    margin-top: 55px;
  }
  .start-quest-btn, .register-btn{
    top: -7px;
    font-size: 17px;
  }
  .hero-img-section{
    top: -7px;
  }
  .hero-img {
    border-radius: 0px 0px 60px 0px;
  }
  .subtitle{
    margin-bottom: 25px;
    font-size: 22px;
  }
  .card-content { 
  padding: 30px 60px ;
  max-height: 100px;
  }
  
}
@media (max-width: 1150px) {
  .buttons-container{
    margin-top: 40px;
  }
  .brand-mark {
    display: none;
  }
  .home-cards{
    padding-top: 0px;
  }
  .subtitle {
    font-size: 20px;
    margin-bottom: 10px;
  }
  .card-title {
    font-size: 20px;
  }
  .event-date, .event-place, .rules-link {
    font-size: 20px;
  }
  .buttons-info-section{
    margin-top: 2%;
  }
  .start-quest-btn, .register-btn{
    top: -7px;
    font-size: 16px;
  }
  .card-content { 
    padding: 30px 50px;
    max-height: 100px;
  }
}
@media (max-width: 1050px) {
  .main-content{
    padding-bottom: 0px;
  }
  .start-container {
    max-height: 550px;
  }
  .main-title {
    font-size: 30px;
    -webkit-text-stroke: 2px var(--hse-red);
    margin-top: 20px;
  }
  .hero-img {
    border-radius: 0px 0px 49px 0px;
  }
  .card-content {
    padding: 28px 30px;
    margin-right: 5px;
  }
  .buttons-info-section{
    margin-top: 1%;
  }
  .buttons-container{
    margin-top: 20px;
    flex-direction: column;
    gap: 5px;
  }
  .register-btn{
    margin-bottom: 10px;
  }
  .register-btn{
    top: -7px;
    font-size: 18px;
    padding: 19px 24px; 
  }
  .start-quest-btn {
    top: -7px;
    font-size: 18px;
    padding: 17px 22px; 
  }
  .card-title {
    font-size: 18px;
  }
}

@media (max-width: 870px){
  .main-title{
    font-size: clamp(25px, 3vw, 30px);
  }
  .subtitle {
    font-size: clamp(15px, 3vw, 17px);
    z-index: 10;
  }
  .buttons-info-section{
    margin-top: 20px;
  }
  .event-date, .event-place, .rules-link {
    font-size: clamp(15px, 3vw, 17px);
  }
}

@media (max-width: 768px) {

  .home-start {
    background-image: url('@/assets/images/плашка-мобайл.svg');
    margin: 24px auto;
    height: clamp(200px, 80vw, 615px);;
  }
  .hero-content {
    margin: 0;
  }
  .hero-title-section {
    margin-left: 15px;
    gap: 20px;
  }
  .main-title {
    margin-top: 30px;
    margin-right: 15px;
    -webkit-text-stroke: 1px var(--hse-red);
    font-size: clamp(30px, 3vw, 35px);
  }
  .subtitle {
    max-width: 400px;
    font-size: clamp(20px, 3vw, 25px);
    margin-bottom: 10px;
  }
  .tag-line {
    font-size: clamp(55px, 3vw, 60px);
    top: -40px;
    left: 45px;
  }
  .hero-img-section {
    width: 46%;
    right: 2px;
    top: 0px;
  }
  .hero-img {
    display: none;
    margin: 0;
    border-radius: 0px 0px 18px 0px;
  }
  .hero-img-mobile {
    display: block;
    margin: 0;
  }
  .buttons-info-section {
    position: absolute;
    top: 77%;
    transform: translateY(-50%);
    width: 80%;
  }
  .buttons-container {
    margin-top: 0;
    flex-direction: column;
    width: 100%;
    margin-bottom: 5px;
  }
  .info-text-container {
    gap: 0;
    margin-top: 0;
  }
  .register-btn {
  padding: 18px 22px;
  border-radius: 20px;
  display: flex;
}
.start-quest-btn {
  padding: 15.5px 19.5px;
  border-radius: 20px;
  display: flex;
}
.event-date, .event-place, .rules-link {
  font-size: clamp(15px, 3vw, 17px);
}

  .home-cards {
    padding-bottom: 29px;
  }
  .cards-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    row-gap: 13px;
    column-gap: 28px;
    padding: 10px 0px;
    min-width: 30px;
}
.card-content {
  padding: 20px 30px;
  border-radius: 20px;
  border: 1px solid var(--hse-red);
  height: 82px;
}
.card-title {
  min-width: 120px;
  font-size: 15px;
  max-width: 160px;
}
.card:hover {
  transform: perspective(800px) rotateY(0);
}
}

@media (max-width: 600px) {
  .buttons-info-section{
    top: 72%;
  }
  .main-title{
    font-size: clamp(25px, 2vw, 30px);
    margin-top: 18px;
  }
  .subtitle{
    font-size: clamp(15px, 2vw, 17px);
  }
  .tag-line{
    font-size: clamp(45px, 2vw, 50px);
    top: -35px;
    left: 35px;
  }
  .register-btn{
    font-size: clamp(15px, 2vw, 18px) ;
    padding: 13px 12px;
    border-radius: 15px;
    display: flex;
    margin-left: 0;
  }
  .start-quest-btn{
    font-size: clamp(15px, 2vw, 18px) ;
    padding: 11px 10px;
    border-radius: 15px;
    display: flex;
    margin-left: 0;
  }
  .event-date, .event-place, .rules-link {
    margin-left: 11px;
    font-size: clamp(14px, 2vw, 18px);
  }
  .tag-line{
    font-size: 30px;
    top: -21px;
  }
  .info-text-container {
    gap: 0;
    margin-top: 0;
  }
}
@media (max-width: 480px) {
  .start-container{
    max-height: 470px;
  }
  .home-start{
    max-height: 470px;
  }
  .main-title {
    margin-top: 18px;
    margin-right: 15px;
    -webkit-text-stroke: 1px var(--hse-red);
    font-size: clamp(16px, 3vw, 18px);
  }
  .subtitle {
    padding: 0;
    font-size: clamp(13px, 3vw, 15px);
    max-width: 250px;
  }
  .brand-mark {
    font-size: clamp(40px, 3vw, 60px);
    display: none;
    bottom: 60px;
  }
  .buttons-info-section {
    position: absolute;
    top: 70%;
    transform: translateY(-50%);
    width: 70%;
  }
  .rules-link {
    margin-top: 0;
    margin-bottom: 0;
  }
  .rules-link a {
    font-size: clamp(12px, 2vw, 18px);
  }
  .register-btn {
  font-size: clamp(13px, 3vw, 15px);
  padding: 11px 9px;
  display: flex;
  margin-left: 0;
  margin-bottom: 0;
}
.start-quest-btn {
  font-size: clamp(13px, 3vw, 15px);
  padding: 11px 9px;
  border: 1px solid var(--hse-red);
}
.event-date, .event-place, .rules-link {
  margin-left: 11px;
  font-size: clamp(12px, 2vw, 18px);
}
.cards-container {
  column-gap: 15px;;
}
.card-content {
  padding: 14px 15px;
}
.info-text-container {
  gap: 0;
  margin-top: 0;
}
}
@media (max-width: 390px) { 
  .hero-title-section {
    row-gap: 7px;
  }
  .main-title {
    font-size: clamp(14px, 3vw, 16px);
    margin-top: 12px;
  }
  .subtitle {
    font-size: clamp(12px, 3vw, 14px);
  }
  .tag-line {
    font-size: 22px;
    top:-17px;
  }
  .buttons-info-section{
    top: 73%;
  }
  .buttons-container {
    margin-bottom: 3px;
  }
  .rules-link {
    margin-top: 0;
    margin-bottom: 0;
  }
  .rules-link a {
    font-size: clamp(11px, 2vw, 13px);
  }
  .register-btn {
  font-size: clamp(11px, 2vw, 13px);
  padding: 10px 8px;
  display: flex;
  margin-left: 0;
}
.start-quest-btn {
  font-size: clamp(11px, 2vw, 13px);
  padding: 9px 7px;
  border: 1px solid var(--hse-red);
}
.cards-container {
  column-gap: 5px;
}
.card-content {
  padding: 9px 10px;
}
.card-title {
  font-size: clamp(13px, 2vw, 15px);
  min-width: 80px;
}
.info-text-container {
  gap: 0;
  margin-top: 0;
}
}
@media (max-width: 360px) {
  .buttons-info-section{
    top: 70%;
  }
  .buttons-container {
    margin-bottom: 0;
  }
  .info-text-container {
    gap: 0;
    margin-top: 0;
  }
  .rules-link, .event-date, .event-place {
    font-size: clamp(10px, 2vw, 12px);
  }
}
</style>