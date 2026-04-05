<template>
  <div class="countdown-page">
    <CountdownHeroCard :event="selectedEvent" :diff="selectedDiff" />

    <div class="countdown-page__grid">
      <CountdownEventList
        :events="sortedEvents"
        :active-id="selectedEventId"
        @select="handleSelect"
      />

      <section class="panel countdown-actions">
        <div class="panel__header">
          <h2 class="panel__title">Раздел ожиданий</h2>
          <p class="panel__text">Отдельный модуль внутри проекта WeatherPulse.</p>
        </div>

        <RouterLink to="/countdowns/new" class="countdown-link">Создать новое ожидание</RouterLink>
        <RouterLink
          v-if="selectedEvent"
          :to="`/countdowns/${selectedEvent.id}`"
          class="countdown-link countdown-link--ghost"
        >
          Открыть карточку события
        </RouterLink>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'

import CountdownEventList from '../components/CountdownEventList.vue'
import CountdownHeroCard from '../components/CountdownHeroCard.vue'
import { useCountdownStore } from '../stores/countdown'

const countdownStore = useCountdownStore()

const sortedEvents = computed(() => countdownStore.sortedEvents)
const selectedEventId = computed(() => countdownStore.selectedEventId)
const selectedEvent = computed(() => countdownStore.selectedEvent)
const selectedDiff = computed(() => countdownStore.selectedDiff)

function handleSelect(id: string): void {
  countdownStore.selectEvent(id)
}

onMounted(() => {
  countdownStore.hydrate()
  countdownStore.startTicker()
})

onUnmounted(() => {
  countdownStore.stopTicker()
})
</script>

<style scoped lang="scss">
.countdown-page {
  display: flex;
  flex-direction: column;
  gap: 20px;

  &__grid {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 20px;
  }
}

.countdown-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.countdown-link {
  display: inline-flex;
  justify-content: center;
  padding: 14px 16px;
  border-radius: 16px;
  text-decoration: none;
  color: #fff;
  background: linear-gradient(135deg, #8B5CF6, #EC4899);

  &--ghost {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.08);
  }
}

@media (max-width: 920px) {
  .countdown-page__grid {
    grid-template-columns: 1fr;
  }
}
</style>
