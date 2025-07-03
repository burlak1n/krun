<template>
  <svg 
    class="circle-point"
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 66 66"
  >
    <!-- Красный круг -->
    <circle 
      class="red-circle"
      cx="33" 
      cy="33" 
      r="33" 
      fill="#C80002"
    />
    
    <!-- Белый круг -->
    <circle 
      class="white-circle"
      cx="33" 
      cy="33" 
      r="18" 
      fill="#F3F3F3"
    />
  </svg>
</template>

<script>
export default {
  name: 'CirclePoint'
}
</script>

<style scoped>
.circle-point {
  width: 66px;
  height: 66px;
}

.red-circle {
  transform-origin: center;
  transition: all 0.3s ease;
}

.white-circle {
  transform-origin: center;
  transition: all 0.3s ease;
}
</style> 