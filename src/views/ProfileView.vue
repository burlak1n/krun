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
  margin: 0;
  max-width: 100%;
}
@media (max-width: 430px) {
  .profile-view {
    gap: 36px;
  }
  
}
</style>