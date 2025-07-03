<template>
  <section class="partners">
    <h2>{{ $t('partners.title') }}</h2>
    <div class="carousel-container">
      <button class="carousel-arrow arrow-left" @click="slideLeft">
        <span>&#10094;</span>
      </button>
      
      <div class="partners-logos">
        <div class="logos-container" :style="slidesStyle" ref="carouselTrack">
          <div v-for="(partner, index) in duplicatedPartners" :key="index" class="partner-logo">
            <img 
              :src="partner.logo" 
              @click="goToPartnerSite(partner.url)"
              :alt="'Partner logo'"
            >
          </div>
        </div>
      </div>
      
      <button class="carousel-arrow arrow-right" @click="slideRight">
        <span>&#10095;</span>
      </button>
    </div>
  </section>
</template>

<script>
export default {
  name: "HomePartners",
  data() {
    return {
      currentIndex: 0,
      slidesPerView: 3,
      slideWidth: 0,
      isAnimating: false,
      partners: [
        {
          logo: require('@/assets/images/partners_logo/2GIS.svg'),
          url: 'https://friends.2gis.ru/'
        },
        {
          logo: require('@/assets/images/partners_logo/Ahmad_Tea_logo.png'),
          url: 'https://ahmadtea.ru'
        },
        {
          logo: require('@/assets/images/partners_logo/holycorn.png'),
          url: 'https://holycorn.ru/'
        },
        {
          logo: require('@/assets/images/partners_logo/feedback.png'),
          url: 'https://feedback-massage.ru/'
        },
        {
          logo: require('@/assets/images/partners_logo/klausrt_logo.png'),
          url: 'https://clck.ru/3CmmpF'
        },
        {
          logo: require('@/assets/images/partners_logo/tedo.png'),
          url: 'https://tedo.ru/career-start'
        },
        {
          logo: require('@/assets/images/partners_logo/sborka_logo.svg'),
          url: 'https://ecosborka.ru'
        },
        {
          logo: require('@/assets/images/partners_logo/addzip.svg'),
          url: 'https://addzip.ru'
        },
        {
          logo: require('@/assets/images/partners_logo/new_york_dance.png'),
          url: 'https://ny-dance.ru/'
        },
        {
          logo: require('@/assets/images/partners_logo/guild.png'),
          url: 'https://creativityweek.ru/?ysclid=m9gyp6chwt617073916'
        },
        {
          logo: require('@/assets/images/partners_logo/rockthecycle.png'),
          url: 'https://rockthecycle.ru/'
        },
        {
          logo: require('@/assets/images/partners_logo/reshape_logo_1.png'),
          url: 'https://reshape.global/'
        },
        {
          logo: require('@/assets/images/partners_logo/kept_logo.png'),
          url: 'https://kept.ru/career/?utm_source=hh.ru&utm_medium=referral&utm_campaign=hh.ru&utm_referrer=hh.ru'
        },
        // { name: "Партнер 6", logo: require('@/assets/images/partner-placeholder.png') },
        // { name: "Партнер 7", logo: require('@/assets/images/partner-placeholder.png') },
      ]
    };
  },
  computed: {
    duplicatedPartners() {
      // Дублируем массив партнеров для создания эффекта бесконечной карусели
      return [...this.partners, ...this.partners];
    },
    slidesStyle() {
      return {
        transform: `translateX(-${this.currentIndex * this.slideWidth}px)`,
        transition: this.isAnimating ? 'transform 0.5s ease-in-out' : 'none'
      };
    }
  },
  mounted() {
    this.updateSlideWidth();
    window.addEventListener('resize', this.handleResize);
    
    // Настройка карусели после монтирования
    this.$nextTick(() => {
      this.handleResize();
    });
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      // Обновляем количество отображаемых слайдов в зависимости от ширины экрана
      if (window.innerWidth <= 768) {
        this.slidesPerView = 1;
      } else if (window.innerWidth <= 1024) {
        this.slidesPerView = 2;
      } else {
        this.slidesPerView = 3;
      }
      this.updateSlideWidth();
    },
    updateSlideWidth() {
      const container = this.$refs.carouselTrack;
      if (container) {
        const containerWidth = container.parentElement.clientWidth;
        this.slideWidth = containerWidth / this.slidesPerView;
      }
    },
    slideLeft() {
      if (this.isAnimating) return;
      
      this.isAnimating = true;
      this.currentIndex -= 1;
      
      // Проверка для бесконечной прокрутки
      if (this.currentIndex < 0) {
        setTimeout(() => {
          this.isAnimating = false;
          this.currentIndex = this.partners.length - 1;
        }, 500);
      } else {
        setTimeout(() => {
          this.isAnimating = false;
        }, 500);
      }
    },
    slideRight() {
      if (this.isAnimating) return;
      
      this.isAnimating = true;
      this.currentIndex += 1;
      
      // Проверка для бесконечной прокрутки
      if (this.currentIndex >= this.partners.length) {
        setTimeout(() => {
          this.isAnimating = false;
          this.currentIndex = 0;
        }, 500);
      } else {
        setTimeout(() => {
          this.isAnimating = false;
        }, 500);
      }
    },
    goToPartnerSite(url) {
      if (url) {
        window.open(url, '_blank');
      }
    }
  }
};
</script>

<style scoped>
.partners {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 64px;
  margin-top: 70px;
  padding: 40px 150px;
  max-width: 1660px;
  box-sizing: border-box;
  margin-left: auto;
  margin-right: auto;
}

h2 {
  margin: 0;
  font-size: 55px;
  text-align: center;
  font-family: 'PhonkSans';
  color: var(--hse-red);
  -webkit-text-stroke: 3px var(--hse-red);
}

.carousel-container {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  max-width: 1360px;
  min-height: 150px;
  overflow: hidden; 
  min-width: 320px;
}

.partners-logos {
  display: flex;
  justify-content: center;
  overflow: hidden;
  width: 100%;
}

.logos-container {
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
}

.partner-logo {
  flex: 0 0 calc(100% / var(--slides-per-view, 3)); /* Динамический расчет ширины слайда */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  box-sizing: border-box;
  height: 150px;
}

.partner-logo img {
  max-width: 100%;
  max-height: 120px;
  object-fit: contain;
  transition: transform 0.4s ease-in-out;
}

.partner-logo img:hover {
  transform: scale(1.05);
  cursor: pointer;
}

.carousel-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border: none;
  background-color: #F3F3F3;
  cursor: pointer;
  font-size: 28px;
  margin: 0 15px;
  color: var(--hse-red);
  transition: color 0.3s ease;
  z-index: 1;
  flex-shrink: 0;
}

.carousel-arrow:hover {
  color: var(--hse-red);
}

@media (max-width: 1360px) {
  .partners {
    padding: 40px 50px;
  }
}

@media (max-width: 768px) {
  .partners {
    gap: 22px;
    padding: 22px;
  }
  h2 {
    font-size: 22px;
    -webkit-text-stroke: 1px var(--hse-red);
  }
  .partner-logo {
    height: 80px;
    --slides-per-view: 1; /* На мобильных - 1 слайд */
  }
  .partner-logo img {
    max-height: 60px;
  }
  .carousel-arrow {
    width: 40px;
    height: 40px;
    font-size: 18px;
    margin: 0 5px;
  }
}

@media (max-width: 1024px) and (min-width: 769px) {
  .partner-logo {
    --slides-per-view: 2; /* На планшетах - 2 слайда */
  }
}

@media (max-width: 480px) {
  h2 {
    font-size: 16px;
  }
}
</style>
