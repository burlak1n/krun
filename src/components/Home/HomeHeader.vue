<template>
  <header class="sticky-header">
      <div class="header-content">
        <LogoComponent/>
      </div>
  </header>
</template>

<script>
import LogoComponent from '@/components/UI/LogoComponent.vue';

export default {
  name: 'HomeHeader',
  components: {
    LogoComponent
  }
}
</script>

<style scoped>
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 111;
  width: 100%;
  height: 80px;
  background-color: var(--text-color);
  margin: 0 auto;
  max-width: 1360px;
}

.header-content {
  padding-top: 50px;
  padding-bottom: 0px;
}

@media (max-width: 768px) {
  
}

@media (max-width: 480px) {
  .header-content {
    width: 100%;
    padding: 0;
  } 
}
</style>