import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { useAuthStore } from '../../../stores/auth'
import { createCountdown, deleteCountdown, fetchCountdowns, updateCountdown } from '../api/countdowns'
import type { CountdownEvent, CountdownFormValues } from '../types/countdown'
import { getCountdownDiff } from '../utils/date'

export const useCountdownStore = defineStore('countdown', () => {
  const events = ref<CountdownEvent[]>([])
  const selectedEventId = ref<string | null>(null)
  const now = ref(Date.now())
  const loading = ref(false)
  const loaded = ref(false)
  const error = ref<string | null>(null)
  let timer: number | null = null

  const sortedEvents = computed(() => {
    return [...events.value].sort((first, second) => {
      return new Date(first.targetDate).getTime() - new Date(second.targetDate).getTime()
    })
  })

  const selectedEvent = computed(() => {
    if (!selectedEventId.value) return sortedEvents.value[0] ?? null

    return events.value.find((event) => event.id === selectedEventId.value) ?? null
  })

  const selectedDiff = computed(() => {
    if (!selectedEvent.value) return null

    return getCountdownDiff({
      targetDate: selectedEvent.value.targetDate,
      createdAt: selectedEvent.value.createdAt,
      now: new Date(now.value),
    })
  })

  async function hydrate(force = false): Promise<void> {
    if (loaded.value && !force) return

    const authStore = useAuthStore()
    const userId = authStore.user?.id

    if (!userId) {
      events.value = []
      selectedEventId.value = null
      loaded.value = true
      return
    }

    loading.value = true
    error.value = null

    try {
      const items = await fetchCountdowns(userId)
      events.value = items

      if (!items.find((event) => event.id === selectedEventId.value)) {
        selectedEventId.value = items[0]?.id ?? null
      }

      loaded.value = true
    } catch (caughtError) {
      error.value = caughtError instanceof Error ? caughtError.message : 'Не удалось загрузить события'
      throw caughtError
    } finally {
      loading.value = false
    }
  }

  function reset(): void {
    events.value = []
    selectedEventId.value = null
    loading.value = false
    loaded.value = false
    error.value = null
  }

  function startTicker(): void {
    if (typeof window === 'undefined' || timer) return

    timer = window.setInterval(() => {
      now.value = Date.now()
    }, 1000)
  }

  function stopTicker(): void {
    if (!timer) return

    window.clearInterval(timer)
    timer = null
  }

  async function addEvent(values: CountdownFormValues): Promise<CountdownEvent> {
    const authStore = useAuthStore()
    const userId = authStore.user?.id

    if (!userId) {
      throw new Error('Пользователь не авторизован')
    }

    const event = await createCountdown(userId, values)
    events.value.push(event)
    selectedEventId.value = event.id
    error.value = null

    return event
  }

  async function updateEvent(id: string, values: CountdownFormValues): Promise<void> {
    const authStore = useAuthStore()
    const userId = authStore.user?.id

    if (!userId) {
      throw new Error('Пользователь не авторизован')
    }

    const updatedEvent = await updateCountdown(id, userId, values)

    events.value = events.value.map((event) => {
      return event.id === id ? updatedEvent : event
    })

    error.value = null
  }

  async function removeEvent(id: string): Promise<void> {
    const authStore = useAuthStore()
    const userId = authStore.user?.id

    if (!userId) {
      throw new Error('Пользователь не авторизован')
    }

    await deleteCountdown(id, userId)
    events.value = events.value.filter((event) => event.id !== id)

    if (selectedEventId.value === id) {
      selectedEventId.value = events.value[0]?.id ?? null
    }

    error.value = null
  }

  function selectEvent(id: string): void {
    selectedEventId.value = id
  }

  function getEventById(id: string): CountdownEvent | null {
    return events.value.find((event) => event.id === id) ?? null
  }

  return {
    now,
    loading,
    loaded,
    error,
    events,
    sortedEvents,
    selectedEventId,
    selectedEvent,
    selectedDiff,
    hydrate,
    reset,
    startTicker,
    stopTicker,
    addEvent,
    updateEvent,
    removeEvent,
    selectEvent,
    getEventById,
  }
})