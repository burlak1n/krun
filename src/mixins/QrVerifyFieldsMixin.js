import { CopyToClipboardMixin } from './CopyToClipboardMixin';

export const QrVerifyFieldsMixin = {
  mixins: [CopyToClipboardMixin],
  methods: {
    getFieldValue(field, data) {
      const { key, defaultValue } = field;
      return data[key] || defaultValue || '';
    }
  }
}; 