<template>
  <div class="countdown-page">
    <UiBreadcrumbs :items="breadcrumbs" />

    <template v-if="store.loading">
      <CountdownHeroSkeleton />
      <CountdownListSkeleton />
    </template>

    <div v-else-if="store.error" class="countdown-page__state">
      {{ store.error }}
    </div>

    <template v-else>
      <CountdownHero :event="store.selectedEvent" :diff="store.selectedDiff" />

      <CountdownEventList
          :events="store.sortedEvents"
          :active-id="store.selectedEventId"
          @select="store.selectEvent"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, onUnmounted} from 'vue'

import CountdownEventList from '../components/CountdownEventList.vue'
import { useCountdownStore } from '../stores/countdown'
import UiBreadcrumbs from "../../../components/ui/breadcrumbs/UiBreadcrumbs.vue";
import CountdownHero from "../components/card/CountdownHero.vue";
import CountdownHeroSkeleton from "../components/skeleton/CountdownHeroSkeleton.vue";
import CountdownListSkeleton from "../components/skeleton/CountdownListSkeleton.vue";

const store = useCountdownStore()

const breadcrumbs = computed(() => [
  { label: 'Главная', to: '/' },
  { label: 'Обратный отсчёт' },
])

onMounted(async () => {
  store.startTicker()
  await store.hydrate()
})

onUnmounted(() => {
  store.stopTicker()
})
</script>

<style scoped lang="scss">
.countdown-page {
  display: flex;
  flex-direction: column;
  gap: 20px;

  &__state {
    padding: 24px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.04);
  }
}
</style>
