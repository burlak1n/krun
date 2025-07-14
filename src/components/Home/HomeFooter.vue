<template>
  <section class="HomeFooter">
    <div class="footer-content">
      <div class="nav-links">
        <router-link to="/registration" class="nav-link">{{ $t('header.signin') }}</router-link>
      </div>
      <div class="auth-block">
        <div class="auth-buttons">
            <a href="https://t.me/+muyJZC7Rr_9jMjVi" target="_blank" rel="noopener noreferrer" class="auth-button telegram">
            <img src="@/assets/images/tg_footer.svg" alt="Telegram" />
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
export default {
  name: 'HomeFooter',
  components: {
  },
}
</script>

<style scoped>
.HomeFooter {
  padding: 0px 20px;
  background-color: var(--text-color);
}

.footer-content {
  max-width: 1450px;
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
  color: var(--white);
  text-decoration: none;
  font-size: 30px;
  font-family: 'Mont_R';
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
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  background-color: var(--text-color);
  transition: transform 0.3s ease;
  border: 2px solid var(--hse-blue);
}

.auth-button:hover {
  transform: scale(1.05);
}

.auth-button img {
  width: 100px;
  height: 100px;
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
    width: 50px;
    height: 50px;
  }
}
@media (max-width: 600px) {
  .nav-link {
    font-size: 15px;
  }

}
</style>