<template>
  <a v-if="externalLink" :href="externalLink" rel="noopener noreferrer" class="logo-link">
    <img src="@/assets/images/hserun_logo.svg" class="logo">
  </a>
  <router-link v-else :to="defaultLink" class="logo-link">
    <img src="@/assets/images/hserun_logo.svg" class="logo">
  </router-link>
</template>

<script>
export default {
  name: 'LogoComponent',
  props: {
    externalLink: {
      type: String,
      default: ''
    },
    defaultLink: {
      type: String,
      default: '/'
    },
    altText: {
        type: String,
        default: 'HSE RUN'
    }
  }
}
</script>

<style scoped>
.logo-link {
  text-decoration: none;
  margin: 20px 0 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo {
  font-size: 38px;
  font-weight: bold;
  text-align: center;
  margin: 0;
  color: #ff5252;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
  transition: transform 0.2s ease;
  max-height: 70px;
}

.logo:hover {
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .logo {
    font-size: 32px;
    max-height: 50px;
  }
}

@media (max-width: 480px) {
  .logo {
    font-size: 28px;
    max-height: 40px;
  }
}
</style> 