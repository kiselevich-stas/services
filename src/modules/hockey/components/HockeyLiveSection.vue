ч<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useHockeyStore } from '../store/hockey'
import HockeyLiveMatchCard from './HockeyLiveMatchCard.vue'

const hockeyStore = useHockeyStore()

const {
  liveMatches,
  loadingLive,
  liveError,
  hasLiveMatches,
} = storeToRefs(hockeyStore)

onMounted(async () => {
  try {
    await hockeyStore.loadLiveMatches()
    hockeyStore.startLivePolling(15_000)
  } catch {
    // уже обработано в store
  }
})

onUnmounted(() => {
  hockeyStore.stopLivePolling()
})

async function handleRefresh() {
  try {
    await hockeyStore.refreshLiveMatches()
  } catch {
    // уже обработано в store
  }
}
</script>

<template>
  <section class="hockey-live">
    <div class="hockey-live__header">
      <div>
        <h1 class="hockey-live__title">Хоккей Live</h1>
        <p class="hockey-live__subtitle">
          Текущие матчи и счёт в прямом эфире
        </p>
      </div>

      <button
          class="hockey-live__refresh"
          type="button"
          :disabled="loadingLive"
          @click="handleRefresh"
      >
        {{ loadingLive ? 'Обновляем...' : 'Обновить' }}
      </button>
    </div>

    <div v-if="loadingLive && !hasLiveMatches" class="hockey-live__state">
      Загружаем live-матчи...
    </div>

    <div v-else-if="liveError && !hasLiveMatches" class="hockey-live__state hockey-live__state--error">
      {{ liveError }}
    </div>

    <div v-else-if="!hasLiveMatches" class="hockey-live__state">
      Сейчас live-матчей нет
    </div>

    <div v-else class="hockey-live__list">
      <HockeyLiveMatchCard
          v-for="match in liveMatches"
          :key="match.id"
          :match="match"
      />
    </div>
  </section>
</template>

<style scoped lang="scss">
.hockey-live {
  display: grid;
  gap: 20px;
}

.hockey-live__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.hockey-live__title {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
}

.hockey-live__subtitle {
  margin: 6px 0 0;
  color: #667085;
}

.hockey-live__refresh {
  border: 1px solid #d0d5dd;
  background: #fff;
  border-radius: 12px;
  padding: 10px 14px;
  cursor: pointer;
  font-weight: 600;
}

.hockey-live__refresh:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.hockey-live__state {
  padding: 18px;
  border-radius: 16px;
  background: #f8fafc;
}

.hockey-live__state--error {
  color: #b42318;
}

.hockey-live__list {
  display: grid;
  gap: 12px;
}
</style>