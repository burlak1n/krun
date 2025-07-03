<template>
  <section class="HomeFAQ" id="faq">
    <div class="homefaq-wrapper">
      <h2>{{ $t('faq.title') }}</h2>

      <div class="questions-wrapper">
        <div class="questions">
          <div 
            v-for="index in 6" 
            :key="index" 
            class="question-container"
            @click="toggleFlip(index)"
          >
            <div class="question-card" :class="{ 'is-flipped': flippedCards[index] }">
              <!-- Передняя сторона карточки с вопросом -->
              <div class="question-card__front">
                <div class="question__content">
                  <h3>{{ $t(`faq.question${index}`) }}</h3>
                </div>
              </div>
              
              <!-- Обратная сторона карточки с ответом -->
              <div class="question-card__back">
                <div class="question__content">
                  <p>{{ $t(`faq.answer${index}`) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  

  </section>
</template>

<script>
import LanguageSwitcher from '../UI/LanguageSwitcher.vue';
export default {
  name: "HomeFAQ",
  components: {
    LanguageSwitcher
  },
  data() {
    return {
      flippedCards: {}
    }
  },
  methods: {
    toggleFlip(index) {
  this.flippedCards[index] = !this.flippedCards[index];
}
  }
};
</script>

<style scoped>
.HomeFAQ {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0px;
  margin: 0 auto;
  border-radius: 80px;
  margin-top: 73px;
  margin-bottom: 73px;
  max-width: 1360px;
}
.homefaq-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 54px;
}

.homefaq-wrapper h2 {
  margin: 0;
  font-size: 55px;
  text-align: center;
  font-family: 'PhonkSans';
  color: var(--hse-red);
  -webkit-text-stroke: 3px var(--hse-red);
}
.questions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 29px;
  column-gap: 70px;
}
.question-container {
  min-height: 200px;
  padding: 10px 20px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.question-card {
  perspective: 1000px;
  border-radius: 40px;
  display: flex;
  border: solid 2px var(--hse-red);
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.8s;
  transform-style: preserve-3d;
  min-height: 200px;
  display: flex;
  max-width: 575px;
}
.question-card__front h3 {
  font-size: 33px;
  margin: 0;
  font-family: 'InvolveMedium';
  color: var(--hse-red);
  text-align: center;
  padding: 10px 20px;
}
.question-card.is-flipped {
  transform: rotateY(180deg);
}
.question-card__back {
  font-size: 33px;
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 0;
  top: 0;
  transform: rotateY(180deg);
  background-color: var(--hse-red);
  border-radius: 38px;
  
}
.question-card__back p {
  font-size: 33px;
  margin: 0;
  font-family: 'InvolveMedium';
  font-size: 24px;
  color: white;
  padding: 10px 20px;
  text-align: center;
}

@media (max-width: 1360px) {
  .homefaq-wrapper h2 {
    font-size: 40px;
  }
  .question-card__front h3 {
    font-size: 24px;
  }
}
@media (max-width: 768px) {
  .HomeFAQ {
    padding: 10px;
    gap: 20px;
  }

  .questions {
    grid-template-columns: 1fr;
    row-gap: 10px;
    width: 100%;
  }

  .question-container {
    max-width: 100%;
    min-height: 90px;
    padding: 5px;
  }

  .homefaq-wrapper h2 {
    font-size: 22px;
    -webkit-text-stroke: 1px var(--hse-red);
  }

  .question-card__front h3,
  .question-card__back p {
    font-size: 15px;
  }
  .question-card {
    max-width: 90%;
    min-height: 120px;
    margin: 0 auto;
    border-radius: 16px;
    border: solid 1px var(--hse-red);
  }
  .question-card__back {
    border-radius: 16px;
    border: solid 1px var(--hse-red);
  }
}
@media (max-width: 480px) {
  .HomeFAQ {
    margin-top: 20px;
  }
  .homefaq-wrapper {
    gap: 20px;
    margin-top: 20px;
  }
  .homefaq-wrapper h2 {
    font-size: 16px;
  }
  .question-card__front h3,
  .question-card__back p {
    font-size: 15px;
  }
}
</style>