<!-- src/components/Quest/QuestHowToParticipate.vue -->
<template>
    <section id="participation" class="HomeParticipation">
      <h2>{{ $t('participation.titlemain') }}</h2>
        <div class="participation-content-wrapper">
          <div class="participation-left-section">
            <VetkaLine 
              class="participation-left-section-image" 
            />
          </div>

          <div class="participation-middle-section">
            <div 
              v-for="index in 5" 
              :key="index" 
              class="step"
            >
              <div class="step__content">
                <div class="step__header">
                  <CirclePoint class="step__circle" />
                  <h3>{{ $t(`participation.steps[${index-1}].point`) }}</h3>
                </div>
                <p>{{ $t(`participation.steps[${index-1}].description`) }}</p>
              </div>
            </div>
          </div>

          <div class="participation-right-section">
            <img src="@/assets/images/participation-first-img.png" alt="" class="participation-first-image">
            <img src="@/assets/images/participation-second-img.png" alt="" class="participation-second-image">
            <img src="@/assets/images/participation-third-image.png" alt="" class="participation-third-image">
          </div>
        </div>
    </section>
  </template>
  
  <script>
  import VetkaLine from '../UI/VetkaLine.vue';
  import CirclePoint from '../UI/CirclePoint.vue';
  export default {
    name: "HomeParticipation",
    components: {
    VetkaLine,
    CirclePoint
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.handleResize);
      this.forceUpdate();
    });
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      this.forceUpdate();
    },
    forceUpdate() {
      this.$forceUpdate();
    }
  }
  };
  </script>
  
  <style scoped>
  .HomeParticipation {
    padding: 30px 20px;
    display: flex;
    flex-direction: column;
    max-width: 1360px;
    margin: 0 auto;
    gap: 54px;
  }
  
  .HomeParticipation h2 {
    margin: 0px;
    font-size: 24px;
    text-align: left;
    font-family: 'PhonkSans';
    font-size: 55px;
    font-weight: 300;
    color: var(--hse-red);
    line-height: 1.5;
  }

  .participation-content-wrapper {
    display: flex;
    gap: 62px;
    max-width: 1360px;
    justify-content: space-between;
  }
  .participation-left-section {
    position: relative;
    width: 66px;
    max-height: 1212px;
  }

  .participation-left-section-image {
    position: absolute;
    top: 0;
    left: 100%;
    transform: translateX(-50%);
    z-index: 1;
    width: 66px;
  }

  .participation-middle-section {
    display: flex;
    flex-direction: column;
    gap: 70px;
  }
  .participation-right-section {
    flex: 1;
    position: relative;
    min-width: 340px;
  }
  
  .step {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 15px;
  }

  
  .step__content {
    text-align: left;
    max-width: 520px;
    display: flex; 
    flex-direction: column;
    gap: 9px;
  }
  
  .step__header {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  
  .step__circle {
    position: absolute;
    left: -96px;
    width: 66px;
    height: 66px;
    z-index: 2;
    transition: all 0.3s ease;
  }
  
  .step__content h3 {
    margin: 0;
    font-family: 'InvolveBold';
    font-size: 33px;
    color: #333030;
  }
  
  .step__content p {
    margin: 0;
    font-family: 'InvolveMedium';
    font-size: 24px;
    color: #4F4E4C;
  }
  .participation-first-image {
    position: absolute;
    width: 80%;
    top: 50px;
    left: 0;
  }
  .participation-second-image {
    position: absolute;
    width: 80%;
    top: 388px;
    right: 14px;
    z-index: 1;
  }
  .participation-third-image {
    position: absolute;
    width: 80%;
    left: 28px;
    top: 740px;
  }

  @media (max-width: 1360px) {
    .HomeParticipation h2 {
      font-size: 40px;
    }
    .step__content h3 {
      font-size: 24px;
      min-width: 300px;
    }
    .step__content p {
      font-size: 20px;
      max-width: 350px;
      min-width: 300px;
    }
    .step__circle {
      width: 50px;
      height: 50px;
      left: -87px;
    }
    .participation-left-section{
      margin-left: 10px;
  }
}
  @media (max-width: 768px) {
    .participation-right-section {
      display: none;
    }
    .HomeParticipation h2 {
      font-size: 22px;
    }
    .participation-left-section-image {
      left: 55%;
  }

    .step__header {
      gap: 10px;
    }
    .step__content h3 {
      font-size: 20px;
    }
    .step__content p {
      font-size: 18px;
    }
    .participation-left-section {
      width: 40px;
    }
    .participation-left-section-image {
      width: 40px;
    }
    .step__circle {
      width: 40px;
      height: 40px;
      left: -58px;
    }
    .step__content h3 {
      max-width: 330px;
      min-width: 209px;
    }
    .step__content p {
      max-width: 330px;
      min-width: 209px;
    }
    .step {
      padding-left: 15px;
    }
    .participation-content-wrapper {
      justify-content: start;
      gap: 20px;
    }
    .participation-middle-section {
      gap: 55px;
    }
  }
  @media (max-width: 600px) {
    .HomeParticipation h2 {
      font-size: 22px;
    }
    .step__content h3 {
      font-size: 18px;
    }
    .step__content p {
      font-size: 15px;
    }
  }
  
  @media (max-width: 480px) {
    .HomeParticipation {
      padding: 10px 0px;
      row-gap: 25px;
    }
    .HomeParticipation h2 {
      font-size: 16px;
    }
    .HomeParticipation h3 {
      font-size: 15px;
    }
     .participation-content-wrapper {
      min-width: 325px;
      column-gap: 10px;
     }
    .participation-left-section {
      width: 30px;
    }
    .participation-left-section-image {
      width: 30px;
      left: 50%;
    }
    .step__circle {
      width: 31px;
      height: 31px;
      left: -40px;
    }
    .step__content p {
      min-width: 100px;
      font-size: clamp(13px, 3vw, 15px);
      max-width: 218px;
    }
    .step__content h3 {
      min-width: 100px;
      font-size: clamp(14px, 3vw, 15px);
      max-width: 200px;
    }
    .step {
      padding-left: 6px;
    }
  }
  
  
  
  </style>