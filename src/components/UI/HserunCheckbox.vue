<template>
  <div>
    <div type="checkbox" v-for="checkbox in checkboxs" :key="checkbox.id">
      <input type="checkbox" v-model="checked">
      <p>{{ checkbox.title }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "hserun-checkbox",
  data() {
    return {
      checkboxs: [
        {id: 1, title: 'мужчина'},
      ],
      checked: false
    };
  }
};
</script>

<style scoped>
input[type="checkbox"] {
  font : 200 px;
  color: blue;
}
</style>
