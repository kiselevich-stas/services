<template>
  <div v-if="event && diff" class="countdown-details-page">
    <CountdownHeroCard :event="event" :diff="diff" />
    <CountdownEventForm :model-value="event" submit-label="Сохранить изменения" @submit="handleSubmit" />

    <button type="button" class="countdown-delete" @click="handleRemove">
      Удалить событие
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import CountdownEventForm from '../components/CountdownEventForm.vue'
import CountdownHeroCard from '../components/CountdownHeroCard.vue'
import type { CountdownFormValues } from '../types/countdown'
import { useCountdownStore } from '../stores/countdown'
import { getCountdownDiff } from '../utils/date'

const route = useRoute()
const router = useRouter()
const countdownStore = useCountdownStore()

const eventId = computed(() => String(route.params.id ?? ''))
const event = computed(() => countdownStore.getEventById(eventId.value))
const diff = computed(() => {
  if (!event.value) return null
  return getCountdownDiff(event.value.targetDate, new Date(countdownStore.now))
})

function handleSubmit(values: CountdownFormValues): void {
  countdownStore.updateEvent(eventId.value, values)
}

function handleRemove(): void {
  countdownStore.removeEvent(eventId.value)
  router.push('/countdowns')
}

onMounted(() => {
  countdownStore.hydrate()
  countdownStore.startTicker()
})
</script>

<style scoped lang="scss">
.countdown-details-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.countdown-delete {
  align-self: flex-start;
  padding: 12px 18px;
  border: 1px solid rgba(239, 68, 68, 0.4);
  border-radius: 14px;
  background: rgba(239, 68, 68, 0.12);
  color: #fecaca;
  cursor: pointer;
}
</style>
