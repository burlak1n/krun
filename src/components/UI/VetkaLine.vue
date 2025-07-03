<template>
  <svg 
    class="vetka-line"
    viewBox="0 0 66 1095"
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMin slice"
  >
    <!-- Красная линия с градиентом -->
    <path 
      d="M33 0V1025"
      stroke="url(#paint0_linear)"
      stroke-width="24"
    />

    <!-- Градиент -->
    <defs>
      <linearGradient 
        id="paint0_linear" 
        x1="33"
        y1="0" 
        x2="33"
        y2="1095" 
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.7" stop-color="#C80002"/>
        <stop offset="0.9" stop-color="#F3F3F3"/>
      </linearGradient>
    </defs>
  </svg>
</template>

<script>
export default {
  name: 'VetkaLine',
  props: {
    width: {
      type: [Number, String],
      default: 24
    },
    height: {
      type: [Number, String],
      default: '100%'
    }
  }
}
</script>

<style scoped>
.vetka-line {
  width: 66px;
}

@media (max-width: 768px) {
  .vetka-line {
    width: 60px;
    height: 850px; /* Базовая видимая высота */
    display: block;
  }
}
@media (max-width: 600px) {
  .vetka-line {
    height: 720px;
  }
}
@media (max-width: 480px) {
  .vetka-line {
    width: 20px;
  }
}

svg {
  max-width: 1100px;
  height: auto;
}
</style> 