<template>
  <div class="previous-event-answers-wrapper">
    <HomeHeader />
    <div class="page-container">
      <h1 v-if="eventName" class="main-title">{{ $t('previousEventAnswers.title') }} {{ eventName }}</h1>
      <h1 v-else class="main-title">{{ $t('previousEventAnswers.titleDefault') }}</h1>

      <div v-if="loading" class="loading-message">{{ $t('previousEventAnswers.loading') }}</div>
      <div v-if="error" class="error-message">{{ $t('previousEventAnswers.errorPrefix') }} {{ error }}</div>

      <!-- Language Switcher -->
      <div v-if="availableLanguages.length > 1" class="language-switcher">
        <span>{{ $t('previousEventAnswers.languageSelect') }}</span>
        <button
          @click="selectLanguage(null)"
          :class="{ active: selectedLanguageId === null }"
        >
          {{ $t('previousEventAnswers.allLanguages') }}
        </button>
        <button
          v-for="lang in availableLanguages" :key="lang.id"
          @click="selectLanguage(lang.id)"
          :class="{ active: selectedLanguageId === lang.id }"
        >
          {{ lang.name }}
        </button>
      </div>

      <!-- Добавляем структуру с боковой навигацией -->
      <div v-if="questStructure && questStructure.blocks" class="content-with-sidebar">
        <!-- Боковая навигация по блокам -->
        <div class="blocks-sidebar">
          <div class="sidebar-title">{{ $t('previousEventAnswers.sidebarTitle') }}</div>
          <ul class="blocks-nav">
            <li 
              v-for="(block, idx) in filteredBlocks" 
              :key="block.id || idx"
              class="block-nav-item"
              :class="{ 'active': activeBlockIndex === idx }"
            >
              <a 
                href="#" 
                @click.prevent="scrollToBlock(`block-${idx}`)"
                class="block-nav-link"
                :title="block.title" 
              >
                {{ block.title }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Основной контент -->
        <div class="quest-structure">
          <div 
            v-for="(block, idx) in filteredBlocks" 
            :key="`${block.language_id}-${block.id || block.title || idx}`" 
            :id="`block-${idx}`"
            ref="blockRefs"
          >
            <h2 class="block-title">{{ block.title }}</h2>
            <!-- Контейнер для изображения и оверлея -->
            <div v-if="block.image_path" class="block-image-container">
              <!-- Изображение блока (маршрут) -->
              <img 
                v-lazy="'/static/img/' + block.image_path"
                :alt="`Маршрут для блока ${block.title}`" 
                class="block-image"
                @click="toggleBlockImage(idx)"
              />
              <!-- Оверлей для скрытия/блюра с анимацией -->
              <Transition name="fade">
                <div 
                  v-if="!revealedBlockImages[idx]" 
                  class="block-image-overlay"
                  @click="toggleBlockImage(idx)"
                >
                  <!-- Добавляем текст на оверлей -->
                  <span class="overlay-text">{{ $t('previousEventAnswers.showRouteButton') || 'Маршрут' }}</span>
                </div>
              </Transition>
            </div>
            <div v-if="block.questions && block.questions.length > 0">
              <div v-for="(question, index) in block.questions" :key="question.id || index">
                <!-- Верхняя пара колонок: Карточка-загадка/подсказка и карточка-ответ -->
                <div class="task-row cards-row">
                  <!-- Левая карточка: Загадка/Подсказка -->
                  <div class="task-column flip-column">
                    <div class="column-title">{{ revealedHints[question.id] ? $t('previousEventAnswers.hintLabel') : $t('previousEventAnswers.riddleLabel') }}</div>
                    <div class="flip-card-outer">
                      <div 
                        class="flip-card-container" 
                        :class="{ 'is-flipped': revealedHints[question.id] }"
                        @click="question.hint_path && toggleHint(question.id)"
                      >
                        <div class="flip-card">
                          <!-- Передняя сторона: Загадка -->
                          <div class="flip-card-face flip-card-front">
                            <!-- Условное отображение контента -->
                            <template v-if="question.image_path">
                              <!-- Изображение -->
                              <img
                                v-if="getFileType(question.image_path) === 'image'"
                                v-lazy="`/static/img/${question.image_path}`"
                                :alt="`Задание ${index + 1}`"
                                class="task-question-image"
                              />
                              <!-- Аудио -->
                              <audio 
                                v-else-if="getFileType(question.image_path) === 'audio'"
                                controls 
                                :src="`/static/img/${question.image_path}`" 
                                class="task-question-audio"
                              >
                                {{ $t('previousEventAnswers.audioNotSupported') }}
                              </audio>
                              <!-- Плейсхолдер для других типов или если тип не определен -->
                              <div v-else class="image-placeholder">{{ $t('previousEventAnswers.fileTypeNotSupported') }}</div>
                            </template>
                            <!-- Плейсхолдер если image_path пуст -->
                            <div v-else class="image-placeholder">{{ $t('previousEventAnswers.noImage') }}</div>
                          </div>
                          <!-- Задняя сторона: Подсказка -->
                          <div class="flip-card-face flip-card-back">
                            <img
                              v-if="question.hint_path"
                              v-lazy="`/static/img/${question.hint_path}`"
                              :alt="`Подсказка к заданию ${index + 1}`"
                              class="task-hint-image"
                            />
                            <div v-else class="hint-placeholder">{{ $t('previousEventAnswers.noHint') }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Правая карточка: Показать ответ -->
                  <div class="task-column answer-trigger-column">
                    <div class="column-title">{{ $t('previousEventAnswers.answerLabel') }}</div>
                    <div 
                      class="answer-trigger-container"
                      @click="toggleAnswer(question.id)"
                      :class="{ 'answer-revealed': revealedAnswers[question.id] }"
                    >
                      <div class="show-answer-button" v-if="!revealedAnswers[question.id]">
                        {{ $t('previousEventAnswers.clickToSeeAnswer') }}
                      </div>
                      <div class="answer-content" v-else>
                        <div class="answer-name">{{ extractTextFromHtml(question.title) || $t('previousEventAnswers.placeName') }}</div>
                        <div class="answer-stats">
                          <span class="stats-label">{{ $t('previousEventAnswers.solvedPercentLabel') }}</span>
                          <span class="stats-value">{{ question.solved_percent || '0' }}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Нижняя пара колонок: Ответ (изображение и текст) -->
                <Transition name="slide-fade">
                  <div v-if="revealedAnswers[question.id]" class="task-row answer-row">
                    <!-- Картинка ответа (левая колонка) -->
                    <div class="task-column answer-image-column">
                      <img
                        v-if="question.image_path_answered"
                        v-lazy="`/static/img/${question.image_path_answered}`"
                        :alt="`Изображение к ответу ${index + 1}`"
                        class="task-answer-image"
                      />
                      <div v-else class="image-placeholder">{{ $t('previousEventAnswers.noAnswerImage') }}</div>
                    </div>
                    
                    <!-- Текст ответа (правая колонка) -->
                    <div class="task-column answer-text-column">
                      <div class="answer-title">{{ extractTextFromHtml(question.title) || $t('previousEventAnswers.placeName') }}</div>
                      <p class="task-answer-text">
                        {{ formatLongreadWithNbsp(question, $t) }}
                      </p>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
            <p v-else class="no-tasks">{{ $t('previousEventAnswers.noTasks') }}</p>
          </div>
        </div>
      </div>
      <div v-else-if="!loading && !error" class="no-data">
        {{ $t('previousEventAnswers.noQuestStructure') }}
      </div>

    </div>
    <HomeFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, onBeforeUnmount, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import HomeHeader from '@/components/Home/HomeHeader.vue';
import HomeFooter from '@/components/Home/HomeFooter.vue';

const route = useRoute();
const eventName = ref(route.params.event_name);
const questStructure = ref(null);
const loading = ref(true);
const error = ref(null);
const selectedLanguageId = ref(null);
const revealedAnswers = ref({});
const revealedHints = ref({}); // Состояние для перевернутых карточек загадок
const revealedBlockImages = ref({}); // Состояние для изображений блоков (маршрутов)
const blockRefs = ref([]); // Референсы на блоки для скролла
const activeBlockIndex = ref(0); // Индекс активного (выбранного) блока
const isScrollingProgrammatically = ref(false); // Флаг для отслеживания программной прокрутки

const getLanguageName = (id) => {
  if (id === 1) return 'Русский';
  if (id === 2) return 'English';
  return `Язык ${id}`;
};

const availableLanguages = computed(() => {
  if (!questStructure.value || !questStructure.value.blocks) {
    return [];
  }
  const languages = new Map();
  questStructure.value.blocks.forEach(block => {
    if (block.language_id && !languages.has(block.language_id)) {
      languages.set(block.language_id, getLanguageName(block.language_id));
    }
  });
  return Array.from(languages, ([id, name]) => ({ id, name }));
});

const filteredBlocks = computed(() => {
  if (!questStructure.value || !questStructure.value.blocks) {
    return [];
  }
  if (selectedLanguageId.value === null) {
    return questStructure.value.blocks;
  }
  return questStructure.value.blocks.filter(block => block.language_id === selectedLanguageId.value);
});

const selectLanguage = (languageId) => {
  selectedLanguageId.value = languageId;
  activeBlockIndex.value = 0; // Сбрасываем активный блок при смене языка
  
  // Запускаем пересчёт после обновления DOM
  nextTick(() => {
    handleScroll(); // Обновляем активный индекс на основе текущей позиции
    // Убрали принудительный скролл к верху или первому блоку
    // if (filteredBlocks.value.length > 0 && blockRefs.value[0]) {
    //    scrollToBlock(0); // Плавно скроллим к первому блоку нового языка
    // } else {
    //   // Если блоков нет, скроллим к верху
    //   window.scrollTo({ top: 0, behavior: 'smooth' });
    // }
  });
};

// Custom directive for lazy loading images
const vLazy = {
  mounted: (el, binding) => {
    // Set initial placeholder state
    el.style.minHeight = '100px';
    el.__vueLazyTimer__ = null; // Инициализируем таймер

    const observer = new IntersectionObserver((entries, observerInstance) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Запускаем таймер на 500 мс
          el.__vueLazyTimer__ = setTimeout(() => {
            // Load the actual image
            el.src = binding.value;
            // Remove placeholder style once loaded
            el.onload = () => {
              el.style.backgroundColor = '';
              el.style.minHeight = '';
            };
            el.onerror = () => {
              // Optional: Handle image loading errors
              console.error(`Failed to load image: ${binding.value}`);
            }
            // Stop observing the element (уже внутри таймера)
            observerInstance.unobserve(el);
          }, 500); // Задержка 500 мс
        } else {
          // Если элемент покинул область видимости, очищаем таймер
          if (el.__vueLazyTimer__) {
            clearTimeout(el.__vueLazyTimer__);
            el.__vueLazyTimer__ = null;
          }
        }
      });
    }, {
      // threshold: 0.1 // Опционально: считать пересечением, когда видно 10% элемента
    });

    observer.observe(el);

    el.__vueLazyObserver__ = observer;
  },
  beforeUnmount: (el) => {
    // Очищаем таймер и observer при размонтировании
    if (el.__vueLazyTimer__) {
      clearTimeout(el.__vueLazyTimer__);
    }
    if (el.__vueLazyObserver__) {
      el.__vueLazyObserver__.disconnect();
      delete el.__vueLazyObserver__;
    }
  }
};

// Функция для переключения состояния ответа
const toggleAnswer = (questionId) => {
  revealedAnswers.value[questionId] = !revealedAnswers.value[questionId];
};

// Функция для переключения состояния подсказки
const toggleHint = (questionId) => {
  revealedHints.value[questionId] = !revealedHints.value[questionId];
};

// Функция для переключения состояния изображения блока (маршрута)
const toggleBlockImage = (blockIndex) => {
  revealedBlockImages.value[blockIndex] = !revealedBlockImages.value[blockIndex];
};

// Функция для инициализации/сброса состояний
const initializeStates = () => {
  const initialAnswers = {};
  const initialHints = {};
  const initialBlockImages = {}; // Инициализация для изображений блоков
  
  if (questStructure.value && questStructure.value.blocks) {
    questStructure.value.blocks.forEach((block, index) => {
       initialBlockImages[index] = false; // Все маршруты изначально скрыты
      if (block.questions) {
        block.questions.forEach(q => {
          initialAnswers[q.id] = false;
          initialHints[q.id] = false; // Все подсказки изначально скрыты
        });
      }
    });
  }
  revealedAnswers.value = initialAnswers;
  revealedHints.value = initialHints;
  revealedBlockImages.value = initialBlockImages; // Применяем инициализацию
};

const fetchQuestStructure = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await fetch(`/api/quest/events/${eventName.value}/answers`);
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    const data = await response.json();
    selectedLanguageId.value = null;
    const rawData = data.blocks ? data : { blocks: data };
    questStructure.value = rawData;
    initializeStates(); // Инициализируем оба состояния
  } catch (err) {
    console.error("Ошибка при загрузке структуры квеста:", err);
    error.value = err.message || 'Не удалось загрузить данные';
  } finally {
    loading.value = false;
  }
};

// Функция скролла к выбранному блоку
const scrollToBlock = (blockId) => {
  const element = document.getElementById(blockId);
  // Проверяем, что элемент найден
  if (element) {
    const headerOffset = 80; // Отступ сверху для учета хедера
    // Используем offsetTop. Это расстояние от верха элемента до верха offsetParent.
    const offsetPosition = element.offsetTop - headerOffset; // Целевая позиция скролла окна

    isScrollingProgrammatically.value = true; // Устанавливаем флаг перед началом прокрутки
    // Убрали прямое присваивание activeBlockIndex, пусть handleScroll определит его после

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    
    // Сбрасываем флаг после завершения анимации прокрутки (примерно)
    setTimeout(() => {
      isScrollingProgrammatically.value = false;
      // Явно вызываем handleScroll после завершения прокрутки, чтобы обновить индекс
      handleScroll(); 
    }, 700); // Задержка должна быть чуть больше времени анимации smooth scroll
  } else {
     console.warn(`Element with ID ${blockId} not found for scrolling.`);
  }
};

// Функция для определения активного блока при скролле
const handleScroll = () => {
  // Игнорируем обработку, если идет программная прокрутка
  if (isScrollingProgrammatically.value) return;

  // Добавляем проверку на существование blockRefs и его элементов
  if (!blockRefs.value || blockRefs.value.length === 0) {
    activeBlockIndex.value = 0; // Сбросить индекс, если блоков нет
    return;
  }
  
  const headerOffset = 80; // Учитываем высоту хедера или другой фиксированный элемент
  const scrollPosition = window.scrollY + headerOffset;

  let currentActiveIndex = -1; // Индекс блока, который сейчас активен

  // Итерируем по ссылкам на блоки
  for (let i = 0; i < blockRefs.value.length; i++) {
    const element = blockRefs.value[i];
    // Пропускаем, если элемент не существует (может случиться при быстрой смене языка)
    if (!element) continue; 

    const elementTop = element.offsetTop; // Используем offsetTop для позиции относительно родителя
    const elementBottom = elementTop + element.offsetHeight;

    // Проверяем, находится ли верхняя часть блока выше текущей позиции прокрутки + отступ
    // и нижняя часть блока ниже этой же позиции
    if (elementTop <= scrollPosition && elementBottom > scrollPosition) {
      currentActiveIndex = i;
      break; // Нашли активный блок, выходим из цикла
    }
    
    // Если верх блока уже ниже позиции скролла, значит, активный блок был предыдущим (если он был)
    // Это помогает определить активный блок, даже если он не полностью виден
    if (elementTop > scrollPosition) {
       // Если это первый блок (i === 0), то он и активный, если он ниже скролла
       // Если не первый, то активный - предыдущий
       currentActiveIndex = (i > 0) ? i - 1 : 0;
       // Дополнительная проверка: если скролл очень близко к верху текущего блока, делаем текущий активным
       if (i > 0 && (elementTop - scrollPosition < 50)) { // 50px - небольшой порог
            currentActiveIndex = i;
       }
       break; 
    }
  }

  // Если после цикла не нашли активный блок (например, прокрутили ниже всех блоков),
  // делаем последний блок активным
  if (currentActiveIndex === -1 && blockRefs.value.length > 0) {
    // Проверяем, что последняя ссылка существует
    if (blockRefs.value[blockRefs.value.length - 1]) {
      currentActiveIndex = blockRefs.value.length - 1;
    } else {
      // Если последняя ссылка null, ищем последнюю существующую
       for (let i = blockRefs.value.length - 2; i >= 0; i--) {
          if (blockRefs.value[i]) {
              currentActiveIndex = i;
              break;
          }
       }
    }
  }
  
  // Обновляем activeBlockIndex только если он изменился
  if (currentActiveIndex !== -1 && activeBlockIndex.value !== currentActiveIndex) {
      activeBlockIndex.value = currentActiveIndex;
  } else if (blockRefs.value.length === 0) {
      // Если блоков нет, сбрасываем индекс
      activeBlockIndex.value = 0;
  }
};

// Добавляем слушатель события скролла и обработка изменения размера окна
onMounted(() => {
  if (eventName.value) {
    fetchQuestStructure();
  } else {
    error.value = 'Не указано имя события.';
    loading.value = false;
  }
  
  // Инициализируем после рендеринга контента
  // Используем nextTick чтобы убедиться, что DOM готов перед добавлением слушателей
  nextTick(() => {
    window.addEventListener('scroll', handleScroll, { passive: true }); // Используем passive для производительности
    window.addEventListener('resize', handleScroll);
    handleScroll(); // Первоначальный вызов для установки активного блока
  });
});

// Удаляем слушатели при размонтировании компонента
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', handleScroll);
});

// Хелпер для извлечения текста из HTML
const extractTextFromHtml = (htmlString) => {
  if (!htmlString) return '';
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    return doc.body.textContent || "";
  } catch (e) {
    console.error("Error parsing HTML string for text extraction:", e);
    // Простой фоллбэк: удалить теги с помощью regex (менее надежно)
    return htmlString.replace(/<[^>]*>?/gm, '');
  }
};

// Хелпер для определения типа файла по расширению
const getFileType = (filePath) => {
  if (!filePath) return 'none';
  const extension = filePath.split('.').pop()?.toLowerCase();
  if (!extension) return 'other'; // Если расширения нет

  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const audioExtensions = ['mp3', 'wav', 'ogg', 'm4a'];

  if (imageExtensions.includes(extension)) {
    return 'image';
  }
  if (audioExtensions.includes(extension)) {
    return 'audio';
  }
  return 'other'; // Другие типы файлов
};

// Функция для форматирования лонгрида с неразрывными пробелами
const formatLongreadWithNbsp = (question, tFunction) => {
  const placeholder = tFunction('previousEventAnswers.noAnswerText');
  let text = question.longread || placeholder;

  // Если это плейсхолдер, возвращаем как есть
  if (text === placeholder) {
    return text;
  }

  // Замена пробелов после коротких слов (1-3 буквы, рус/англ) на неразрывные
  // Ищем пробел/начало строки + слово(1-3) + пробелы, заменяем на пробел/начало строки + слово + NBSP
  text = text.replace(/(^|\s)([a-zA-Zа-яА-Я]{1,3})\s+/g, '$1$2\u00A0');

  return text;
};

// Следим за изменением filteredBlocks
watch(filteredBlocks, () => {
  // Запускаем пересчёт после обновления DOM при изменении отфильтрованных блоков
  // Очистим массив ссылок перед тем, как DOM обновится.
  // Это заставит v-for заново наполнить массив актуальными ссылками.
  blockRefs.value = []; 
  nextTick(() => {
    // После обновления DOM и очистки/пересоздания refs, вызываем handleScroll
    handleScroll();
  });
}, { deep: true });
</script>

<style scoped>
.previous-event-answers-wrapper {
  background: none; 
}

.page-container {
  max-width: 1500px;
  margin: 40px auto;
  padding: 0 20px;
  font-family: 'Involve', sans-serif;
}

.main-title {
  color: var(--hse-blue);
  text-align: center;
  margin-bottom: 40px;
  font-weight: bold;
}

.loading-message,
.error-message,
.no-data {
  text-align: center;
  margin-top: 30px;
  font-size: 1.1rem;
  color: #555;
}

.error-message {
  color: var(--hse-red);
}

.quest-block {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.block-title {
  color: var(--hse-blue);
  font-family: 'Phonk Sans', sans-serif;
  font-size: clamp(24px, 2vw, 30px);
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.task-item {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #eee;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Стили для строк и колонок */
.task-row {
  background-color: white;
  display: flex;
  gap: 20px;
  width: 100%;
  margin-bottom: 20px;
  border-radius: 8px;
  border: 1px solid #eee;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.task-column {
  flex: 1;
  padding: 15px;
  box-sizing: border-box; /* Добавляем box-sizing для правильного расчета размеров */
  min-width: 0; /* Предотвращает выход контента за пределы flex-контейнера */
}

/* Выравнивание колонок по ширине */
.cards-row .flip-column,
.cards-row .answer-trigger-column,
.answer-row .answer-image-column,
.answer-row .answer-text-column {
  flex: 1;
  width: 50%;
  max-width: calc(50% - 10px); /* Учитываем gap */
  overflow: hidden; /* Предотвращаем выход содержимого */
}

.column-title {
  font-weight: bold;
  color: var(--hse-blue);
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #eee;
  font-size: 0.9rem;
  text-transform: uppercase;
  text-align: center;
}

/* Стили для карточки с переворотом */
.flip-card-outer {
  perspective: 1000px;
  width: 100%;
  min-height: 150px;
  overflow: hidden; /* Предотвращаем выход содержимого */
}

.flip-card-container {
  width: 100%;
  height: 100%;
  min-height: 250px;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.flip-card-container.is-flipped {
  transform: rotateY(180deg);
}

.flip-card {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
}

.flip-card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  min-height: 250px;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 8px;
}

.flip-card-front {
  transform: rotateY(0deg);
  z-index: 2;
  background-color: #fff;
}

.flip-card-back {
  transform: rotateY(180deg);
  background-color: #f5f5f5;
}

/* Стили для кнопки ответа */
.answer-trigger-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 250px;
  cursor: pointer;
  background-color: #f0f8ff;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.answer-trigger-container:hover {
  background-color: #e6f0ff;
}

/* Стиль для контейнера с ответом, когда он показан */
.answer-trigger-container.answer-revealed {
  background-color: #f8efef;
  cursor: default;
}

.show-answer-button {
  font-size: 0.9rem;
  color: var(--hse-blue);
  font-weight: bold;
  text-align: center;
  padding: 20px;
}

/* Стили для содержимого ответа */
.answer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 20px;
}

.answer-name {
  font-size: 1.0rem;
  font-weight: bold;
  color: var(--hse-blue);
  margin-bottom: 15px;
  text-align: center;
}

.answer-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  padding: 8px 15px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  font-size: 0.9rem;
}

.stats-label {
  margin-right: 5px;
  color: #666;
}

.stats-value {
  font-weight: bold;
  color: #a72828;
}

/* Стили для изображений */
.task-question-image,
.task-hint-image,
.task-answer-image {
  background-color: #fff;
  display: block;
  width: 100%;
  height: 100%;
  max-height: 400px;
  object-fit: contain;
  border-radius: 5px;
}

/* Стили для аудио плеера */
.task-question-audio {
  width: calc(100% - 30px); /* Отступы по бокам */
  margin: 15px auto; /* Центрирование и отступы */
  display: block; /* Убедимся, что занимает всю ширину */
}

.image-placeholder,
.hint-placeholder {
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  background-color: #f0f0f0;
  border-radius: 5px;
  text-align: center;
  padding: 10px;
  width: 100%;
  height: 100%;
}

/* Стили для ответа */
.answer-row {
  margin-top: 10px;
  border-radius: 8px;
}

.answer-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: var(--hse-blue);
}

.task-answer-text {
  font-size: 0.8rem;
  margin: 0;
  line-height: 1.6;
  color: #333;
  /* Убираем break-word, чтобы неразрывный пробел имел приоритет */
  /* word-wrap: break-word; */ 
  overflow-wrap: normal; /* Используем стандартное свойство */
}

/* Анимация */
.slide-fade-enter-active {
  transition: all 0.4s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

/* Стили для языкового переключателя */
.language-switcher {
  text-align: center;
  margin-bottom: 30px;
}

.language-switcher span {
  margin-right: 10px;
  color: #555;
}

.language-switcher button {
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  padding: 4px 8px;
  margin: 0 3px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-family: 'Involve', sans-serif;
}

.language-switcher button:hover {
  background-color: #e0e0e0;
}

.language-switcher button.active {
  background-color: var(--hse-blue);
  color: white;
  border-color: var(--hse-blue);
}

/* Адаптивная версия */
@media (max-width: 768px) {
  .task-row,
  .answer-content-row {
    flex-direction: column;
    gap: 15px;
  }
  
  .task-column {
    width: 100%;
    padding: 12px;
    max-width: 100%;
  }
  
  /* Сбрасываем ограничения ширины на мобильных */
  .cards-row .flip-column,
  .cards-row .answer-trigger-column,
  .answer-row .answer-image-column,
  .answer-row .answer-text-column {
    width: 100%;
    max-width: 100%;
  }
  
  .main-title {
    font-size: clamp(24px, 5vw, 28px);
  }
  
  .block-title {
    font-size: clamp(20px, 4vw, 24px);
  }
  
  .flip-card-container {
    min-height: 200px;
  }
  
  .flip-card-face {
    min-height: 200px;
  }
  
  .answer-trigger-container {
    min-height: 200px;
  }
  
  .answer-name {
    margin-bottom: 10px;
  }
  
  .answer-stats {
    padding: 5px 10px;
    font-size: 0.8rem;
  }
}

.no-tasks {
  color: #777;
  font-style: italic;
}

/* Стили для контейнера с сайдбаром */
.content-with-sidebar {
  display: flex;
  gap: 30px;
  position: relative;
  margin-top: 20px;
}

/* Стили для сайдбара */
.blocks-sidebar {
  position: sticky;
  top: 80px;
  width: 250px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  align-self: flex-start;
}

.sidebar-title {
  color: var(--hse-blue);
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 15px;
  text-align: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.blocks-nav {
  list-style: none;
  padding: 0;
  margin: 0;
}

.block-nav-item {
  margin-bottom: 5px; /* Немного уменьшим отступ, т.к. фон уже разделяет */
}

.block-nav-link {
  display: block;
  padding: 8px 12px;
  text-decoration: none;
  color: #333;
  border-radius: 6px;
  transition: all 0.2s;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: #f9f9f9; /* Добавляем светлый фон */
  border: 1px solid #eee; /* Добавляем тонкую границу */
}

.block-nav-link:hover {
  background-color: #f0f0f0;
  color: var(--hse-blue);
}

.block-nav-item.active .block-nav-link {
  background-color: var(--hse-blue);
  color: white;
  font-weight: bold;
}

/* Изменяем стили для quest-structure, чтобы нормально работал flex */
.quest-structure {
  flex: 1;
}

/* Адаптивные стили для мобильных */
@media (max-width: 768px) {
  .content-with-sidebar {
    flex-direction: column;
  }
  
  .blocks-sidebar {
    padding: 5px;
    position: relative;
    top: 0;
    width: calc(100% - 10px);
    max-height: none;
    margin-bottom: 20px;
  }
  
  .blocks-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .block-nav-item {
    margin-bottom: 0;
  }
  
  .block-nav-link {
    white-space: nowrap;
    font-size: 0.8rem;
    padding: 6px 10px;
  }
}

/* Стили для контейнера изображения блока */
.block-image-container {
  position: relative; /* Для позиционирования оверлея */
  max-width: 100%;
  margin: 15px auto 25px;
  border-radius: 8px; /* Применяем к контейнеру, чтобы обрезать оверлей */
  overflow: hidden; /* Обрезаем выходящий оверлей */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Стили для изображения блока */
.block-image {
  display: block; 
  width: 100%; /* Занимает всю ширину контейнера */
  height: auto; /* Автоматическая высота для сохранения пропорций */
  /* Убираем max-height отсюда, можно задать для контейнера если нужно */
  /* Убираем margin и border-radius, они теперь у контейнера */
  object-fit: contain; 
}

/* Стили для оверлея */
.block-image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(220, 220, 220, 0.6); /* Полупрозрачный фон */
  backdrop-filter: blur(10px); /* Эффект размытия */
  -webkit-backdrop-filter: blur(10px); /* Для Safari */
  cursor: pointer;
  transition: opacity 0.3s ease; /* Плавное исчезновение (опционально) */
  z-index: 1; /* Чтобы был поверх картинки */
  /* Центрируем текст внутри оверлея */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Стили для текста на оверлее */
.overlay-text {
  color: #333; /* Темный цвет текста для читаемости на светлом фоне */
  font-size: 1.1rem;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.7); /* Легкая тень для отделения от фона */
}

/* Анимация для исчезновения оверлея */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Убираем стили для кнопки */
/* 
.show-route-container {
  text-align: center;
  margin-bottom: 15px; 
}

.show-route-button {
  padding: 8px 15px;
  font-size: 0.9rem;
  color: var(--hse-blue);
  background-color: #f0f8ff;
  border: 1px solid var(--hse-blue);
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.show-route-button:hover {
  background-color: var(--hse-blue);
  color: white;
}
*/
</style> 