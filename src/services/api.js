// Универсальные функции для выполнения HTTP-запросов

/**
 * Выполняет GET-запрос по указанному URL
 * @param {string} url - URL для запроса
 * @param {boolean} [noCache=false] - Флаг для отключения кэширования
 * @returns {Promise<any>} - результат запроса
 */
export async function getData(url, noCache = false) {
  try {
    // Добавляем timestamp для предотвращения кэширования, если требуется
    const urlWithTimestamp = noCache ? `${url}${url.includes('?') ? '&' : '?'}_t=${new Date().getTime()}` : url;
    
    const response = await fetch(urlWithTimestamp, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': noCache ? 'no-cache, no-store, must-revalidate' : 'max-age=0, must-revalidate'
      },
      credentials: 'include' // Для работы с куки/сессиями
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Неизвестная ошибка' }));
      return {
        ok: false,
        message: errorData.message || errorData.detail || `Ошибка: ${response.status}`,
        status: response.status
      };
    }
    
    const data = await response.json();
    return { ...data, ok: true };
  } catch (error) {
    console.error('Ошибка API запроса:', error);
    return { 
      ok: false, 
      message: error.message || 'Ошибка сетевого запроса',
      error
    };
  }
}

/**
 * Выполняет POST-запрос по указанному URL с переданными данными
 * @param {string} url - URL для запроса
 * @param {Object} data - данные для отправки в теле запроса
 * @returns {Promise<any>} - результат запроса
 */
export async function postData(url, data) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // Для работы с куки/сессиями
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Неизвестная ошибка' }));
      return {
        ok: false,
        message: errorData.message || errorData.detail || `Ошибка: ${response.status}`,
        status: response.status
      };
    }
    
    const responseData = await response.json();
    return { ...responseData, ok: true };
  } catch (error) {
    console.error('Ошибка API запроса:', error);
    return { 
      ok: false, 
      message: error.message || 'Ошибка сетевого запроса',
      error
    };
  }
}

/**
 * Программный API для работы с баллами пользователей
 */
export const programAPI = {
  /**
   * Получение информации о баллах пользователя
   * @param {number} userId - ID пользователя
   * @param {boolean} [noCache=false] - Флаг для отключения кэширования
   * @returns {Promise<any>} - результат запроса
   */
  async getUserScore(userId, noCache = false) {
    return getData(`/api/auth/program/user/${userId}`, noCache);
  },
  
  /**
   * Добавление баллов пользователю
   * @param {number} userId - ID пользователя
   * @param {Object} scoreData - данные о начисляемых баллах
   * @returns {Promise<any>} - результат запроса
   */
  async addScore(userId, scoreData) {
    return postData('/api/auth/program/add_score', {
      user_id: userId,
      ...scoreData
    });
  },
  
  /**
   * Добавление баллов пользователю через QR-код
   * @param {string} token - Токен QR-кода
   * @param {Object} scoreData - данные о начисляемых баллах
   * @returns {Promise<any>} - результат запроса
   */
  async addScoreByQr(token, scoreData) {
    return postData('/api/auth/program/qr_add_score', {
      token,
      score_data: scoreData
    });
  }
}; 