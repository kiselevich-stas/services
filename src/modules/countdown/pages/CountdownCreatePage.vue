<template>
  <div class="countdown-create-page">
    <CountdownEventForm submit-label="Создать событие" @submit="handleSubmit" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import CountdownEventForm from '../components/CountdownEventForm.vue'
import type { CountdownFormValues } from '../types/countdown'
import { useCountdownStore } from '../stores/countdown'

const router = useRouter()
const countdownStore = useCountdownStore()

function handleSubmit(values: CountdownFormValues): void {
  const event = countdownStore.addEvent(values)
  router.push(`/countdowns/${event.id}`)
}
</script>
