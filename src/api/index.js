import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Accept-Encoding': 'gzip, deflate, br',
  },
  withCredentials: true // для работы с куками
});

// Пути, для которых разрешено кэширование (статика и справочники)
const CACHE_ALLOWED = [
  '/static',
  '/reference',
  '/config',
  '/img'
];

const CACHE_CONFIG = {
  '/reference': { maxAge: 3600 },     // Справочники - 1 час
  '/config': { maxAge: 1800 },        // Конфиги - 30 минут
  '/static': { maxAge: 7200 },         // Статика - 2 часа
  '/img': { maxAge: 7200 }
};

// Добавляем кэширование только для разрешённых путей
api.interceptors.request.use(config => {
  // Для разрешённых путей добавляем max-age, для остальных запрещаем кэш
  const allowCache = CACHE_ALLOWED.some(prefix => config.url.startsWith(prefix));
  if (allowCache) {
    const cacheConfig = Object.entries(CACHE_CONFIG).find(([pattern]) => 
      config.url.startsWith(pattern)
    );
    if (cacheConfig) {
      config.headers['Cache-Control'] = `max-age=${cacheConfig[1].maxAge}`;
    }
  } else {
    config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
    // timestamp не добавляем
  }
  // Оптимизация заголовков для снижения нагрузки
  if (config.method === 'get') {
    config.headers['Accept'] = 'application/json';
    delete config.headers['Content-Type'];
  }
  return config;
});

// Добавим перехватчики для обработки ошибок
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Проверяем, не находимся ли мы на странице QR-верификации
      if (!window.location.pathname.includes('/qr/verify')) {
        // Получаем текущий URL для возврата после авторизации
        const currentUrl = window.location.href;
        // Перенаправляем на регистрацию с параметром redirect_url
        window.location.href = `/registration?redirect_url=${encodeURIComponent(currentUrl)}`;
      }
    }
    return Promise.reject(error);
  }
);

// Функция для принудительного обновления данных без кэша
export const forceRefresh = (url) => {
  return api.get(url, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
};

export const authAPI = {
  login: (data) => api.post('/auth/registration', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.post('/auth/update_profile', data),
};

export const teamAPI = {
  create: (data) => api.post('/auth/command/create', data),
  leave: () => api.post('/auth/command/leave'),
  delete: () => api.post('/auth/command/delete'),
  removeUser: (userId) => api.post('/auth/command/remove_user', { user_id: userId }),
  join: (token) => api.post('/auth/command/join', { token }),
};

// Добавляем методы для работы с QR
export const qrAPI = {
  verify: (token) => api.post('/auth/qr/verify', { token }),
  generate: () => api.get('/auth/qr'),
};

// Добавляем методы для работы с квестом
export const questAPI = {
  // --- Загрузка данных ---
  getAllBlocks: () => api.get('/quest/'), 
  getBlock: (blockId) => api.get(`/quest/${blockId}`),
  // --- Взаимодействие с загадками ---
  checkAnswer: (riddleId, answer) => api.post(`/quest/riddles/${riddleId}/check-answer`, { answer }),
  getHint: (riddleId) => api.get(`/quest/riddles/${riddleId}/hint`), 
  // --- Функции инсайдера (уже были) ---
  getInsiderTasksStatus: (commandId) => api.get(`/quest/insiders/tasks/status?command_id=${commandId}`),
  markInsiderAttendance: (data) => api.post('/quest/insiders/attendance/mark', data),
  // Добавьте сюда другие методы questAPI, если они понадобятся
};

export default api; 