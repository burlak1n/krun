<!-- src/components/Quest/QuestHowToParticipate.vue -->
<template>
    <section id="participation" class="HomeParticipation">
      <h2>{{ $t('participation.titlemain') }}</h2>
        <div class="participation-content-wrapper">
          <div 
            v-for="(point, index) in participationPoints" 
            :key="index"
            class="participation-card">
            <div class="participation-card-content">
              <h3>{{ $t(`participation.point${index + 1}`) }}</h3>  
              <p>{{ $t(`participation.description${index + 1}`) }}</p>
            </div>
          </div>
        </div>
          <img src="@/assets/images/arrow.svg" alt="Декоративная стрелка" class="participation-arrow">
    </section>
  </template>
  
  <script>
  export default {
    name: 'HomeParticipation',
    computed: {
      participationPoints() {
        // Создаем массив из 5 элементов для отображения всех карточек
        return Array.from({ length: 5 }, (_, i) => i + 1);
      }
    }
  }
  </script>
  
  <style scoped>
  .HomeParticipation {
    padding: 0px 0px;
    display: flex;
    flex-direction: column;
    max-width: 1440px;
    margin: 0px auto;
    gap: 50px;
    position: relative;
  }
  .HomeParticipation h2 {
    margin: 0px;
    font-size: 84px;
    text-align: left;
    font-family: 'Weather';
    font-weight: 500;
    color: var(--white);
    line-height: 1.1;
  }

  .participation-main-wrapper {
    display: flex;
    align-items: flex-start;
    gap: 40px;
  }

  .participation-content-wrapper {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    padding: 17px;
    align-items: flex-start;
    align-content: flex-start;
    align-self: stretch;
    gap: 16px;
    border-radius: 24px;
    background: var(--white);
    flex: 1;
  }

  .participation-arrow {
    width: 679.486px;
    height: 634.885px;
    flex-shrink: 0;
    position: absolute;
    right: -80px;
    top: 321px;
}

  .participation-card {
    display: flex;
    width: 458px;
    height: 280px;
    padding: 32px;
    flex-direction: column;
    align-items: flex-end;
    gap: 16px;
    border-radius: 12px;
    background: var(--croc-purple);
    box-sizing: border-box;
  }
  .participation-card-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
  }
  .participation-card-content h3 {
    align-self: stretch;
    color: var(--white);
    font-family: 'Mont_R';
    font-size: 40px;
    margin: 0;
    line-height: 100%;
  }
  .participation-card-content p {
    color: var(--white);
    font-family: 'Mont_R';
    font-size: 30px;
    font-style: normal;
    font-weight: 600;
    line-height: 100%; /* 30px */
    margin: 0;
  } 
  @media (max-width: 1490px) {
      .participation-arrow {
        display: none;
  }
    .participation-card {
      display: flex;
      flex: 1;
      padding: 32px;
      flex-direction: column;
      justify-content: start;
      align-items: flex-end;
      height: 320px;
      gap: 16px;
      border-radius: 12px;
      min-width: 340px;
      background: var(--croc-purple);
      box-sizing: border-box;
    }
    .participation-card-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .participation-card-content h3 {
      align-self: stretch;
      color: var(--white);
      font-family: 'Mont_R';
      font-size: 40px;
      margin: 0;
      line-height: 100%;
    }
    .participation-card-content p {
      color: var(--white);
      font-family: 'Mont_R';
      font-size: 30px;
      font-style: normal;
      font-weight: 600;
      line-height: 100%; /* 30px */
      margin: 0;
    } 
  }
  @media (max-width: 768px) {
    .HomeParticipation h2 {
      font-size: 60px;
    }
    .participation-main-wrapper {
      flex-direction: column;
      gap: 30px;
    }
    
    .participation-arrow-wrapper {
      align-self: center;
      min-width: 150px;
    }
    
    .participation-arrow {
      max-width: 150px;
    }
  }

  @media (max-width: 480px) {
    .HomeParticipation {
      padding: 0px;
      row-gap: 25px;
      margin: 0;
    }
    .HomeParticipation h2 {
    margin: 0px;
    font-size: 28px;
    text-align: left;
    font-family: 'Weather';
    font-weight: 500;
    color: var(--white);
    line-height: 100%;
    padding: 10px 10px 10px 10px;
  }
    
    .participation-main-wrapper {
      flex-direction: column;
      gap: 16px;
    }
    
    .participation-arrow-wrapper {
      display: none;
    }
    .HomeParticipation h3 {
      font-size: 20px;
      font-family: 'Mont_SB';
    }
    .HomeParticipation p {
      font-size: 15px;
    }
    .participation-card {
      display: flex;
      padding: 16px 10px;
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
      flex: 1 0 0;
      height: 185px;
      width: 185px;
      min-width: 140px;
    }

     .participation-content-wrapper {
      min-width: 325px;
      column-gap: 10px;
      padding: 10px;
     }
    .participation-card {
      padding: 10px;
    }
    .participation-card-content {
      gap: 10px;
    }
    .participation-arrow {
      display: none;
    }
  }
  @media (max-width: 386px) {
    .participation-content-wrapper {
      min-width: 265px;
    }
    .participation-card {
      display: flex;
      padding: 16px 10px;
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
      flex: 1 0 0;
      max-height: 285px;
      min-width: 100px;
      margin: 0 auto;
      height: 195px;

    }
    .participation-card-content {
      padding-right: 40px;
    }
    .participation-card-content p {
      font-size: 14px
    }
  }
  </style>