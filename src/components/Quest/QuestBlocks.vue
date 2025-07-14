<template>
  <QuestShell :teamScore="questStore.teamScore" :teamCoins="questStore.teamCoins">
    <h2 v-if="questStore.loading && !questStore.currentBlockTitle">
        <Skeleton width="40%" height="2rem" style="margin: 0 auto;"></Skeleton>
    </h2>
    <h2 v-else-if="questStore.currentBlockTitle">{{ questStore.currentBlockTitle }}</h2>
    
    <div v-if="questStore.loading" class="riddles-container-skeleton">
        <div v-for="n in 3" :key="n" class="riddle-block-skeleton">
            <Skeleton height="1.5rem" width="70%" class="mb-2"></Skeleton>
            <Skeleton height="2.5rem" width="50%" borderRadius="16px" class="mb-4"></Skeleton>
            <Skeleton height="150px" width="90%" class="mb-3"></Skeleton> 
            <div class="skeleton-form">
              <Skeleton height="2.5rem" width="75%"></Skeleton>
              <Skeleton height="2.5rem" width="20%"></Skeleton>
            </div>
        </div>
    </div>
    <div v-else-if="questStore.error" class="error">{{ questStore.error }}</div>
    <div v-else-if="!questStore.currentBlock" class="error">Не удалось загрузить данные блока.</div>
    <div v-else class="riddles-container">
      <RiddleCard 
        v-for="riddle in questStore.currentBlockRiddles" 
        :key="riddle.id"
        :riddle="riddle"
      />
    </div>
  </QuestShell>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuestStore } from '@/stores/quest';
import QuestShell from './QuestShell.vue';
import RiddleCard from './RiddleCard.vue';

const route = useRoute();
const router = useRouter();
const questStore = useQuestStore();

const blockId = ref(route.params.id);

// --- Логика загрузки данных --- 
onMounted(() => {
  questStore.fetchBlockData(blockId.value);
});

onUnmounted(() => {
  // Опционально: Сбрасываем currentBlock в сторе, если нужно
  // questStore.currentBlock = null;
});

</script>

<style scoped>
.riddles-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 0 auto;
  width: 100%;
  max-width: 700px;
  align-self: center;
}

.riddles-container-skeleton {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 0 auto;
  width: 100%;
  max-width: 700px; 
  align-self: center;
}

.riddle-block-skeleton {
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

.skeleton-form {
  display: flex;
  justify-content: space-between;
  width: 90%;
  max-width: 600px;
  gap: 5px;
  margin-top: 1rem;
}

.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 1rem; }
.mb-4 { margin-bottom: 1.5rem; }

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

.back-btn {
  background-color: var(--croc-green);
  color: var(--text-color);
  border: none;
  border-radius: 12px;
  padding: 16px 32px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s ease;
  margin: 0 auto 15px;
  display: block;
}

.back-btn:hover {
  box-shadow: 0px 0px 10px 0px #FFF;
}
</style>
