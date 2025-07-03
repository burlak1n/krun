export const CopyToClipboardMixin = {
  data() {
    return {
      copySuccess: false,
      // Убираем статическое значение, будем использовать $t
      // tooltipText: 'Нажмите, чтобы скопировать'
    };
  },
  computed: {
    // Вычисляемое свойство для получения локализованного текста тултипа
    tooltipText() {
      // Проверяем наличие $t перед использованием
      if (this.$t) {
        if (this.copySuccess) {
          return this.$t('clipboard.copyTooltipSuccess');
        } else {
          // Добавить проверку на ошибку, если нужно отображать ошибку в тултипе
          return this.$t('clipboard.copyTooltipDefault');
        }
      } else {
        // Запасной вариант, если $t недоступен (маловероятно)
        return 'Click to copy'; 
      }
    }
  },
  methods: {
    copyToClipboard(text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          this.copySuccess = true;
          // Текст тултипа обновится через computed свойство
          setTimeout(() => {
            this.copySuccess = false;
          }, 2000);
        })
        .catch(err => {
          console.error('Ошибка при копировании: ', err);
          // Можно добавить состояние ошибки, если нужно показывать её в тултипе
          // this.copyError = true;
          // tooltipText вернется в default состояние через computed
        });
    }
  }
}; 