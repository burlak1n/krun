<template>
  <QuestShell :teamScore="questStore.teamScore" :teamCoins="questStore.teamCoins">
    <!-- Skeleton Loading for Quest Blocks -->
    <div v-if="questStore.loading" class="quest-blocks-skeleton">
      <div v-for="n in 5" :key="n" class="quest-block-skeleton">
        <!-- Skeleton: Block Title -->
        <Skeleton height="1.5rem" width="60%" class="mb-3"></Skeleton>
        <!-- Skeleton: Progress Area -->
        <div class="skeleton-progress-area">
            <!-- Skeleton: Progress Bar 1 -->
            <Skeleton height="25px" width="100%" borderRadius="16px" class="mb-2"></Skeleton>
            <!-- Skeleton: Progress Bar 2 -->
            <Skeleton height="25px" width="100%" borderRadius="16px"></Skeleton>
        </div>
      </div>
    </div>
    <!-- Error Display -->
    <div v-else-if="questStore.error" class="error">{{ questStore.error }}</div>
    <!-- Actual Content -->
    <div v-else class="quest-blocks">
      <div v-for="block in questStore.blocks" :key="block.id" 
           class="quest-block" 
           @click="startBlock(block.id)">
        <div class="block-title">
          {{ block.title }}
        </div>
        
        <div class="progress-area">
          <div class="progress-wrapper">
            <div class="progress-container">
              <div 
                class="progress-bar blue" 
                :style="`width: ${block.progress || 0}%`"
              >
                <span class="progress-label" v-if="block.progress > 20">
                  {{ block.progress || 0 }}% ({{ block.solved_count || 0 }}/{{ block.total_count || 0 }})
                </span>
              </div>
              <span class="progress-label outside" v-if="block.progress <= 20">
                {{ block.progress || 0 }}% ({{ block.solved_count || 0 }}/{{ block.total_count || 0 }})
              </span>
            </div>
          </div>
          
          <div class="progress-wrapper">
            <div class="progress-container">
              <div 
                class="progress-bar red" 
                :style="`width: ${(block.insider_count / block.total_count) * 100 || 0}%`"
              >
                <span class="progress-label" v-if="(block.insider_count / block.total_count) * 100 > 20">
                  Посещено: {{ block.insider_count || 0 }}/{{ block.total_count || 0 }}
                </span>
              </div>
              <span class="progress-label outside red-text" v-if="(block.insider_count / block.total_count) * 100 <= 20">
                Посещено: {{ block.insider_count || 0 }}/{{ block.total_count || 0 }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </QuestShell>
</template>

<script setup>
import { onMounted, onActivated } from 'vue';
import { useRouter } from 'vue-router';
import { useQuestStore } from '@/stores/quest';
import QuestShell from './QuestShell.vue';

const router = useRouter();
const questStore = useQuestStore();

const startBlock = (blockId) => {
  router.push(`/quest/${blockId}`);
};

// Используем onMounted для первоначальной загрузки
onMounted(() => {
  questStore.fetchQuestData();
});

// Используем onActivated для обновления при возвращении на KeepAlive компонент (если используется)
// или при смене видимости вкладки (как было раньше с visibilitychange)
onActivated(() => {
  questStore.fetchQuestData(); // Повторно загружаем для актуальности
});

// Опционально: можно добавить watcher для visibilitychange, если KeepAlive не используется
// import { useEventListener } from '@vueuse/core'; // Потребует установки @vueuse/core
// useEventListener(document, 'visibilitychange', () => {
//   if (document.visibilityState === 'visible') {
//     questStore.fetchQuestData();
//   }
// });

</script>

<style scoped>
.quest-blocks {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 0 auto;
  max-width: 700px;
  overflow: visible;
}

.quest-block {
  border: 2px solid #ff5252;
  border-radius: 15px;
  max-width: 700px;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

/* Применяем hover-эффект только для устройств с мышью/указателем */
@media (hover: hover) {
  .quest-block:hover {
    transform: scale(1.02);
    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.15);
  }
}

.block-title {
  padding: 15px 10px;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  color: #333;
  background: none;
}

.progress-area {
  padding: 0 15px 15px;
}

.progress-wrapper {
  margin-bottom: 10px;
}

.progress-container {
  width: 100%;
  height: 25px;
  background-color: #e0e0e0;
  border-radius: 15px;
  overflow: hidden;
  position: relative;
}

.progress-bar {
  height: 100%;
  border-radius: 15px;
  position: relative;
  display: flex;
  align-items: center;
  transition: width 0.3s ease;
}

.blue {
  background-color: #4285f4;
}

.red {
  background-color: #ff5252;
}

.progress-label {
  color: white;
  font-size: 12px;
  white-space: nowrap;
  padding: 0 10px;
  z-index: 1;
}

.progress-label.outside {
  position: absolute;
  right: 10px;
  color: #666;
  font-size: 12px;
  top: 50%;
  transform: translateY(-50%);
}

.red-text {
  color: #ff5252;
}

/* Добавим стили для loading и error, если их нет */
.loading, .error {
  text-align: center;
  padding: 20px;
  margin: 20px 0;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  color: #666;
}

.error {
  color: #e74c3c;
  border: 1px solid #e74c3c;
}

/* Контейнер скелетонов - ограничиваем ширину здесь */
.quest-blocks-skeleton {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 337px; /* Ограничение контейнера */
  margin: 0 auto;   /* Центрирование контейнера */
  width: 100%; 
}

/* Карточка скелетона - занимает 100% ширины ограниченного контейнера */
.quest-block-skeleton {
  max-width: 337px; /* Возвращаем max-width сюда */
  width: 100%; 
  box-sizing: border-box; 
  border: 2px solid #e0e0e0; 
  border-radius: 15px;
  padding: 15px;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 10px; 
  display: flex;
  flex-direction: column;
  align-items: center; 
}

.skeleton-progress-area {
  width: 100%;
  padding: 0 15px 15px;
  box-sizing: border-box;
  margin-top: 10px;
}

/* PrimeVue Skeleton по умолчанию может не иметь margin, добавляем утилиты */
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 1rem; }

</style>
