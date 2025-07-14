<template>
  <section class="HomeFAQ" id="faq">
    <div class="homefaq-wrapper">
      <h2>{{ $t('faq.title') }}</h2>

      <div class="faq-container">
        <div 
          v-for="index in 4" 
          :key="index" 
          class="faq-item"
        >
          <button
            class="faq-button"
            @click="toggleItem(index)"
          >
            <span class="faq-question-text">
              {{ $t(`faq.question${index}`) }}
            </span>
            <img 
              src="@/assets/images/arrowbutton-not-active.svg" 
              alt="Arrow" 
              class="faq-icon-arrow"
              :class="{ 'rotated': openItems[index] }"
            />
          </button>
          <div 
            class="faq-content"
            :class="{ 'expanded': openItems[index] }"
          >
            <div class="faq-content-inner">
              <p>{{ $t(`faq.answer${index}`) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "HomeFAQ",
  data() {
    return {
      openItems: {}
    }
  },
  methods: {
    toggleItem(index) {
      this.openItems[index] = !this.openItems[index];
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
  max-width: 1450px;
}

.homefaq-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 54px;
  width: 100%;
}

.homefaq-wrapper h2 {
  margin: 0;
  font-size: 84px;
  text-align: left;
  font-family: 'Weather';
  color: var(--white);
}

.faq-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 24px;
  width: 100%;
}

.faq-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  background-color: var(--white);
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}


.faq-button {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 51px 57px;
  border: none;
  background: var(--white);
  cursor: pointer;
}


.faq-question-text {
  font-size: 48px;
  font-family: 'Mont_R';
  color: var(--text-color);
  font-weight: 400;
  text-align: left;
}

.faq-icon-arrow {
  width: 100px;
  height: 100px;
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.faq-icon-arrow.rotated {
  color: var(--croc-deep-purple);
  transform: rotate(180deg);
}

.faq-content {
  max-height: 0;
  overflow: hidden;
  background-color: var(--white);
  transition: max-height 0s ease, padding 0.4s ease;
  padding: 0 57px;
}

.faq-content.expanded {
  max-height: 500px;
  padding: 0 57px 57px 57px;
}

.faq-content-inner {
  padding-top: 0;
  transition: opacity 0.1s ease 0.1s;
  opacity: 0;
}

.faq-content.expanded .faq-content-inner {
  opacity: 1;
}

.faq-content p {
  margin: 0;
  font-size: 30px;
  line-height: 1.6;
  color: var(--text-color);
  font-family: 'Mont_R';
}

@media (max-width: 1360px) {
  .homefaq-wrapper h2 {
    font-size: 84px;
  }
  
  .faq-question-text {
    font-size: 40px;
  }
  
  .faq-content p {
    font-size: 36px;
  }
}

@media (max-width: 768px) {
  .HomeFAQ {
    padding: 10px;
    margin-top: 0px;
    margin-bottom: 0px;
  }
  .HomeFAQ h2 {
    font-size: 60px;
  }

  .homefaq-wrapper {
    gap: 30px;
  }

  .homefaq-wrapper h2 {
    font-size: 60px;
  }

  .faq-container {
    gap: 16px;
  }

  .faq-item {
    border-radius: 12px;
  }
  
  .faq-button {
    padding: 30px 40px;
  }
  
  .faq-question-text {
    font-size: 32px;
  }

  .faq-content {
    padding: 0 40px;
  }

  .faq-content.expanded {
    padding: 0 40px 40px 40px;
  }

  .faq-content p {
    font-size: 24px;
  }
  
  .faq-icon-arrow {
    width: 70px;
    height: 70px;
  }
}

@media (max-width: 480px) {
  .HomeFAQ {
    margin: 0;
  }
  .HomeFAQ h2 {
    font-size: 28px;
  }
  .HomeFAQ p {
    font-size: 28px;
  }
  .faq-item {
    border-radius: 8px;
  }
  
  .faq-button {
    padding: 16px 10px;
  }
  
  .faq-question-text {
    font-size: 24px;
  }

  .faq-content {
    padding: 0 30px;
  }

  .faq-content.expanded {
    padding: 0 10px 10px 10px;
  }

  .faq-content p {
    font-size: 16px;
  }
  
  .faq-icon-arrow {
    width: 40px;
    height: 40px;
  }
  .faq-question-text {
    font-size: 18px;
  }
}
</style>