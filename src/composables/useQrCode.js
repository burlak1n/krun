import { ref } from 'vue';
import { qrAPI } from '@/api'; // Используем централизованный API
import { useToast } from 'primevue/usetoast';

export function useQrCode() {
  const toast = useToast();

  // Состояние
  const isQrModalVisible = ref(false);
  const qrImageSrc = ref('');
  const isLoadingQr = ref(false);

  // Методы
  async function showQrCode() {
    if (isLoadingQr.value) return;
    isLoadingQr.value = true;
    qrImageSrc.value = ''; // Сбрасываем старое изображение

    try {
      const response = await qrAPI.generate(); // Вызываем метод API
      const data = response.data;
      
      if (data.qr_image) {
        qrImageSrc.value = 'data:image/png;base64,' + data.qr_image;
        isQrModalVisible.value = true; // Показываем модалку только при успехе
      } else {
         throw new Error(data.message || 'Ответ не содержит изображение QR-кода');
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
      const errorMessage = error.response?.data?.error?.message 
                         || error.response?.data?.message 
                         || error.message 
                         || 'Ошибка при загрузке QR-кода';
      toast.add({ severity: 'error', summary: 'Ошибка QR-кода', detail: errorMessage, life: 4000 });
      isQrModalVisible.value = false; // Убедимся, что модалка скрыта при ошибке
    } finally {
      isLoadingQr.value = false;
    }
  }

  function closeQrCode() {
    isQrModalVisible.value = false;
  }

  // Возвращаем состояние и методы
  return {
    isQrModalVisible,
    qrImageSrc,
    isLoadingQr,
    showQrCode,
    closeQrCode,
  };
} 