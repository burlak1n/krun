<template>
  <div class="language-switcher">
    <select v-model="selectedLocale">
      <option value="ru">RU</option>
      <option value="en">EN</option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'LanguageSwitcher',
  data() {
    return {
      selectedLocale: this.$i18n.locale
    }
  },
  watch: {
    selectedLocale(newLocale) {
      // Обновляем язык в i18n
      this.$i18n.locale = newLocale
      
      // Сохраняем выбранный язык в localStorage
      localStorage.setItem('userLanguage', newLocale)
    }
  },
  created() {
    // Получаем сохраненный язык при создании компонента
    const savedLanguage = localStorage.getItem('userLanguage')
    
    // Если язык сохранен и он поддерживается, устанавливаем его
    if (savedLanguage && ['ru', 'en'].includes(savedLanguage)) {
      this.selectedLocale = savedLanguage
      this.$i18n.locale = savedLanguage
    }
  }
}
</script>

<style scoped>
.language-switcher {
  display: inline-block;
}

select {
  padding: 0px 3px;
  background-color: #F3F3F3;
  border: none;
  font-size: 20px;
  cursor: pointer;
  font-family: 'InvolveMedium';
}

select:focus {
  outline: none;
  border-color: var(--hse-blue);
}
@media (max-width: 768px) {
  .language-switcher {
    font-size: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 5px;
    padding-top: 3px;
  }
  select {
    font-size: 13px;
    padding: 0px 1px;
    margin-left: 5px;
  }
}
</style>
