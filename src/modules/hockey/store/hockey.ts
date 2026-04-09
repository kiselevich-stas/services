import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUpcomingMatches } from '../api/hockeyApi'
import { getLiveMatches } from '../api/getLiveMatches'
import type { HockeyUpcomingMatch, HockeyMatch } from '../types'
import { useToastStore } from '../../../stores/toast.ts'

export const hockey = defineStore('hockey', () => {
  const matches = ref<HockeyUpcomingMatch[]>([])
  const isLoading = ref(false)
  const errorMessage = ref('')

  const liveMatches = ref<HockeyMatch[]>([])
  const loadingLive = ref(false)
  const liveError = ref('')
  const liveDebug = ref<Record<string, unknown> | null>(null)
  const isLiveInitialized = ref(false)

  const pollingIntervalId = ref<number | null>(null)

  const toast = useToastStore()

  async function fetchUpcomingMatches() {
    isLoading.value = true
    errorMessage.value = ''

    try {
      const response = await getUpcomingMatches()
      matches.value = response
    } catch (error) {
      const message =
          error instanceof Error
              ? error.message
              : 'Не удалось загрузить ближайшие матчи'

      errorMessage.value = message

      toast.error({
        title: 'Ошибка загрузки',
        message,
      })
    } finally {
      isLoading.value = false
    }
  }

  async function loadLiveMatches(force = false) {
    if (loadingLive.value) {
      return
    }

    if (isLiveInitialized.value && !force) {
      return
    }

    loadingLive.value = true
    liveError.value = ''

    try {
      const response = await getLiveMatches(10, 'ru')

      liveMatches.value = response.items ?? []
      liveDebug.value = response.debug ?? null
      isLiveInitialized.value = true
    } catch (error) {
      const message =
          error instanceof Error
              ? error.message
              : 'Не удалось загрузить текущие матчи'

      liveError.value = message

      toast.error({
        title: 'Ошибка загрузки live-матчей',
        message,
      })
    } finally {
      loadingLive.value = false
    }
  }

  async function refreshLiveMatches() {
    loadingLive.value = true
    liveError.value = ''

    try {
      const response = await getLiveMatches(10, 'ru')

      liveMatches.value = response.items ?? []
      liveDebug.value = response.debug ?? null
      isLiveInitialized.value = true
    } catch (error) {
      const message =
          error instanceof Error
              ? error.message
              : 'Не удалось обновить текущие матчи'

      liveError.value = message

      toast.error({
        title: 'Ошибка обновления live-матчей',
        message,
      })
    } finally {
      loadingLive.value = false
    }
  }

  function startLivePolling(intervalMs = 15_000) {
    if (typeof window === 'undefined') {
      return
    }

    stopLivePolling()

    pollingIntervalId.value = window.setInterval(() => {
      void refreshLiveMatches()
    }, intervalMs)
  }

  function stopLivePolling() {
    if (pollingIntervalId.value !== null && typeof window !== 'undefined') {
      window.clearInterval(pollingIntervalId.value)
    }

    pollingIntervalId.value = null
  }

  return {
    matches,
    isLoading,
    errorMessage,
    fetchUpcomingMatches,

    liveMatches,
    loadingLive,
    liveError,
    liveDebug,
    isLiveInitialized,
    loadLiveMatches,
    refreshLiveMatches,
    startLivePolling,
    stopLivePolling,
  }
})