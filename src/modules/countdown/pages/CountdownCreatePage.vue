<template>
  <div class="countdown-create-page">
    <UiBreadcrumbs :items="breadcrumbs" />
    <CountdownEventForm submit-label="Создать событие" @submit="handleSubmit" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import CountdownEventForm from '../components/CountdownEventForm.vue'
import { useCountdownStore } from '../stores/countdown'
import type { CountdownFormValues } from '../types/countdown'
import UiBreadcrumbs from "../../../components/ui/breadcrumbs/UiBreadcrumbs.vue";
import {computed} from "vue";

const router = useRouter()
const store = useCountdownStore()

const breadcrumbs = computed(() => [
  { label: 'Главная', to: '/' },
  { label: 'Создание таймера' },
])

async function handleSubmit(values: CountdownFormValues): Promise<void> {
  const event = await store.addEvent(values)
  await router.push(`/countdowns/${event.id}`)
}
</script>

<style scoped lang="scss">
.countdown-create-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
