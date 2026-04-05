import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'

import { COUNTDOWN_STORAGE_KEY, DEFAULT_COUNTDOWN } from '../constants/presets'
import type { CountdownEvent, CountdownFormValues } from '../types/countdown'
import { getCountdownDiff } from '../utils/date'

function createId(): string {
  return `countdown-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`
}

function readStorage(): CountdownEvent[] {
  if (typeof window === 'undefined') return []

  const raw = window.localStorage.getItem(COUNTDOWN_STORAGE_KEY)
  if (!raw) return []

  try {
    return JSON.parse(raw) as CountdownEvent[]
  } catch {
    return []
  }
}

export const useCountdownStore = defineStore('countdown', () => {
  const events = ref<CountdownEvent[]>([])
  const selectedEventId = ref<string | null>(null)
  const now = ref(Date.now())
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
    return getCountdownDiff(selectedEvent.value.targetDate, new Date(now.value))
  })

  function hydrate(): void {
    const saved = readStorage()

    if (saved.length) {
      events.value = saved
      selectedEventId.value = saved[0].id
      return
    }

    const defaultEvent: CountdownEvent = {
      id: createId(),
      createdAt: new Date().toISOString(),
      ...DEFAULT_COUNTDOWN,
    }

    events.value = [defaultEvent]
    selectedEventId.value = defaultEvent.id
  }

  function persist(): void {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(COUNTDOWN_STORAGE_KEY, JSON.stringify(events.value))
  }

  function startTicker(): void {
    if (typeof window === 'undefined' || timer) return
    timer = window.setInterval(() => {
      now.value = Date.now()
    }, 1000)
  }

  function stopTicker(): void {
    if (timer) {
      window.clearInterval(timer)
      timer = null
    }
  }

  function addEvent(values: CountdownFormValues): CountdownEvent {
    const event: CountdownEvent = {
      id: createId(),
      createdAt: new Date().toISOString(),
      ...values,
    }

    events.value.push(event)
    selectedEventId.value = event.id
    return event
  }

  function updateEvent(id: string, values: CountdownFormValues): void {
    events.value = events.value.map((event) => {
      if (event.id !== id) return event
      return { ...event, ...values }
    })
  }

  function removeEvent(id: string): void {
    events.value = events.value.filter((event) => event.id !== id)

    if (selectedEventId.value === id) {
      selectedEventId.value = events.value[0]?.id ?? null
    }
  }

  function selectEvent(id: string): void {
    selectedEventId.value = id
  }

  function getEventById(id: string): CountdownEvent | null {
    return events.value.find((event) => event.id === id) ?? null
  }

  watch(events, persist, { deep: true })

  return {
    now,
    events,
    sortedEvents,
    selectedEventId,
    selectedEvent,
    selectedDiff,
    hydrate,
    startTicker,
    stopTicker,
    addEvent,
    updateEvent,
    removeEvent,
    selectEvent,
    getEventById,
  }
})
