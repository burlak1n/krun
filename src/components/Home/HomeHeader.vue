<template>
  <header class="sticky-header">
    <div class="header-content">
      <LogoComponent/>
      <nav class="navigation">
        <LanguageSwitcher />
        <router-link to="/previous" class="nav-link">{{ $t('header.previousQuests') }}</router-link>
        <div class="language-selector">
          <router-link to="/profile" class="nav-link">{{ $t('header.signin') }}</router-link> 
        </div>
        <div class="mobile-menu-icon" @click="toggleMenu">
          <img 
            src="@/assets/images/down-button.svg" 
            alt="header-down-button" 
            class="down-button-mobile"
            :class="{ 'rotated': isMenuOpen }"
          >
        </div>
      </nav>
    </div>
  </header>
</template>

<script>
import LanguageSwitcher from '../UI/LanguageSwitcher.vue';
import SlideMenu from '../UI/SlideMenu.vue';
import LogoComponent from '@/components/UI/LogoComponent.vue';

export default {
  name: 'HomeHeader',
  components: {
    LanguageSwitcher,
    SlideMenu,
    LogoComponent
  },
  data() {
    return {
      isMenuOpen: false
    }
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    closeMenu() {
      this.isMenuOpen = false;
    },
    scrollToParticipation() {
      this.$nextTick(() => {
        const element = document.getElementById('participation');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          this.$router.push('/').then(() => {
            setTimeout(() => {
              const participationElement = document.getElementById('participation');
              if (participationElement) {
                participationElement.scrollIntoView({ behavior: 'smooth' });
              }
            }, 100);
          });
        }
      });
    },
    scrollToFAQ() {
      this.$nextTick(() => {
        const element = document.getElementById('faq');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          this.$router.push('/').then(() => {
            setTimeout(() => {
              const faqElement = document.getElementById('faq');
              if (faqElement) {
                faqElement.scrollIntoView({ behavior: 'smooth' });
              }
            }, 100);
          });
        }
      });
    }
  }
}
</script>

<style scoped>
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 111;
  width: 100%;
  height: 90px;
  background-color: #F3F3F3;
  margin: 0 auto;
  max-width: 1360px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  max-width: 1360px;
  margin: 0 auto;
  padding: 0 20px;
}
.navigation {
  display: flex;
  align-items: center;
  vertical-align: middle;
  gap: 20px;
  font-family: 'InvolveMedium';
  font-size: 20px;
  color: #333;
}

.nav-link {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.3s ease;
  cursor: pointer;
}
.nav-link-faq{
  color: #333;
}

.nav-link:hover {
  color: var(--hse-blue);
}
.nav-link-faq:hover {
  color: var(--hse-blue);
}
.nav-link-participation:hover {
  color: var(--hse-blue);
}
.down-button-mobile{
  display: none;
}
.logo-link {
  margin: 0;
}

@media (max-width: 768px) {
  .sticky-header {
    width: 100%;
    height: 70px;
  }
  .header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  }
  img.logo {
    max-width: 100px;
    margin: 0 auto;
    display: block;
    padding-left: 0;
  }
  .language-selector{
    max-width: 9px;
}
.language-selector img {
  max-width: 10px;
}
  .nav-link-participation, .nav-link-faq {
    display: none;
  }
  .nav-link{
    font-size: 13px;
  }
  .burger-menu{
    display: none;
  }
}
</style>