<template>
  <section class="HomeFooter">
    <div class="footer-content">
      <div class="nav-links">
        <router-link to="/previous" class="nav-link">{{ $t('header.previousQuests') }}</router-link>
        <router-link to="/registration" class="nav-link">{{ $t('header.signin') }}</router-link>
      </div>

      <div class="auth-block">
        <div class="auth-buttons">
            <a href="https://t.me/+pieUILI_L_RjODk6" target="_blank" rel="noopener noreferrer" class="auth-button telegram">
            <img src="@/assets/images/tg-mini-logo.svg" alt="Telegram" />
          </a>
          <a href="https://vk.com/hserun?utm_source=vkontakte&utm_medium=cpc&utm_campaign=%7Bcampaign_id%7D&utm_content=%7Bad_id%7D
" target="_blank" rel="noopener noreferrer" class="auth-button vk">
            <img src="@/assets/images/vk-mini-logo.svg" alt="VK" />
          </a>
        </div>
      </div>
      <div class="footer-info">
        <p>{{ $t('footer.copyright') }}</p>
      </div>
    </div>
  </section>
</template>

<script>
import LanguageSwitcher from '@/components/UI/LanguageSwitcher.vue';
export default {
  name: 'HomeFooter',
  components: {
    LanguageSwitcher,
  },
}
</script>

<style scoped>
.HomeFooter {
  padding: 60px 20px;
  background-color: #F3F3F3;
}

.footer-content {
  max-width: 1360px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.nav-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nav-link {
  color: #000000;
  text-decoration: none;
  font-size: 32px;
  font-family: 'InvolveMedium';
  transition: font-family 0.3s;
}

.nav-link:hover {
  font-family: 'InvolveBold';
}

.auth-block {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.auth-buttons {
  display: flex;
  gap: 80px;
}

.auth-button {
  width: 75px;
  height: 75px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  background-color: #F3F3F3;
  transition: transform 0.3s ease;
  border: 2px solid var(--hse-blue);
}

.auth-button:hover {
  transform: scale(1.05);
}

.auth-button img {
  width: 50px;
  height: 50px;
}

.footer-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-info p {
  margin: 0;
  color: #666;
  font-size: 14px;
  font-family: 'InvolveMedium';
}

@media (max-width: 768px) {
  .HomeFooter {
    padding: 40px 20px;
  }

  .nav-link {
    font-size: 24px;
  }

  .auth-title {
    font-size: 20px;
  }

  .auth-button {
    width: 50px;
    height: 50px;
  }

  .auth-button img {
    width: 25px;
    height: 25px;
  }
}
@media (max-width: 600px) {
  .nav-link {
    font-size: 15px;
  }

}
</style>