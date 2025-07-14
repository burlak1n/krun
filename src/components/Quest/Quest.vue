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
              </div>
              <span class="progress-label outside">
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
              </div>
              <span class="progress-label outside red-text">
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

</script>

<style scoped>

.quest-blocks {
  display: flex;
  flex-direction: column;
  gap: 54px;
  margin: 0 auto;
  max-width: 700px;
  overflow: visible;
  align-items: center;
  justify-content: center;
  padding: 0;
  width: 100%;
}

.quest-block {
  border-radius: 15px;
  width: 100%; /* Занимает всю доступную ширину */
  max-width: calc(100vw - 40px); /* Отступы по 20px с каждой стороны */
  overflow: hidden;
  background-color: var(--white);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 0px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 30px;
  box-sizing: border-box; /* Включает padding в общую ширину */
}

/* Адаптивность для больших экранов */
@media (min-width: 1200px) {
  .quest-block {
    max-width: 1160px; /* Максимальная ширина для больших экранов */
    margin: 0 auto; /* Центрирование */
  }
}

/* Адаптивность для средних экранов */
@media (max-width: 768px) {
  .quest-block {
    max-width: calc(100vw - 20px); /* Меньшие отступы */
    padding: 20px;
    gap: 20px;
  }
}

/* Адаптивность для маленьких экранов */
@media (max-width: 480px) {
  .quest-block {
    max-width: calc(100vw - 10px); /* Минимальные отступы */
    padding: 15px;
    gap: 15px;
    border-radius: 10px;
  }
}

/* Применяем hover-эффект только для устройств с мышью/указателем */
@media (hover: hover) {
  .quest-block:hover {
    transform: scale(1.02);
    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.15);
  }
}

.block-title {
  text-align: center;
  font-size: 36px;
  font-weight: 500;
  color: var(--text-color);
  background: none;
  font-family: 'Mont_SB';
  white-space: pre-line;
}

.progress-area {
  padding: 0 15px 15px;
}

.progress-wrapper {
  margin-bottom: 10px;
}

.progress-container {
  width: 100%;
  height: 33px;
  background-color: rgba(217, 217, 217, 1);
  border-radius: 15px;
  overflow: hidden;
  position: relative;
}

.progress-bar {
  height: 100%;
  border-radius: 15px;
  position: relative;
  display: flex;
  align-items: right;
  transition: width 0.3s ease;
}

.blue {
  background-color: var(--croc-green);
}

.red {
  background-color: var(--croc-purple);
}

.progress-label {
  color: var(--text-color);
  font-size: 20px;
  white-space: nowrap;
  padding: 0 20px;
  z-index: 1;
}

.progress-label.outside {
  position: absolute;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  color: var(--text-color);
  font-size: 20px;
  margin: 0;
  top: 50%;
  text-align: center;
  width: 100%;
  font-family: 'Mont_R';
  font-weight: 500;
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

@media (max-width: 430px) {
  .progress-container {
    height: 28px;
  }
  .quest-blocks {
    gap: 16px;
  }
  .quest-block {
    padding: 10px 20px;
    gap: 10px;
  }
  .block-title {
    font-size: 16px;
  }
  
  .progress-label.outside {
    font-size: 14px;
    align-items: center;
    
  }
  .progress-area {
    padding: 0px;
    max-width: 342px;
    align-items: center;

  }
}

</style>
