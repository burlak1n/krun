<template>
    <p class="greeting">{{ greeting }}</p>
  </template>
  
  <script>
  export default {
    data() {
      return {
        greeting: 'Привет всем!'
      }
    }
  }
  </script>
  
  <style scoped>
  .greeting {
    color: red;
    font-weight: bold;
  }
  </style>