<template>
  <div class="profile-view">
    <Profile />
  </div>
</template>

<script>
import Profile from '@/components/Profile/Profile.vue';

export default {
  name: 'ProfileView',
  components: {
    Profile
  }
};
</script>

<style scoped>
.profile-view {
  max-width: 100%;
  margin: 0 auto;
}
.logo {
  padding-left: 12px;
}
</style>