import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUpcomingMatches } from '../api/hockeyApi'
import { getLiveMatches } from '../api/getLiveMatches'
import { getMatchDetails } from '../api/getMatchDetails'
import { getHockeySeasons } from '../api/getHockeySeasons'
import { getTeamCards } from '../api/getTeamCards'

import type {
  HockeyUpcomingMatch,
  HockeyMatch,
  HockeyMatchDetails,
  HockeyStageOption,
  HockeyTeamCard,
} from '../types'

import { useToastStore } from '../../../stores/toast.ts'

export const hockey = defineStore('hockey', () => {
  const toast = useToastStore()

  const matches = ref<HockeyUpcomingMatch[]>([])
  const isLoading = ref(false)
  const errorMessage = ref('')

  const liveMatches = ref<HockeyMatch[]>([])
  const loadingLive = ref(false)
  const liveError = ref('')
  const liveDebug = ref<Record<string, unknown> | null>(null)
  const isLiveInitialized = ref(false)

  const pollingIntervalId = ref<number | null>(null)

  const matchDetails = ref<HockeyMatchDetails | null>(null)
  const matchDetailsLoading = ref(false)
  const matchDetailsError = ref('')
  const currentMatchId = ref<number | string | null>(null)

  const stageOptions = ref<HockeyStageOption[]>([])
  const stageOptionsLoading = ref(false)
  const stageOptionsError = ref('')
  const selectedStageId = ref<string | null>(null)

  const teamCards = ref<HockeyTeamCard[]>([])
  const teamCardsLoading = ref(false)
  const teamCardsError = ref('')

  function clearTeamCards() {
    teamCards.value = []
    teamCardsError.value = ''
  }

  function setSelectedStage(stageId: string | number | null | undefined) {
    const normalizedStageId = stageId != null ? String(stageId) : null

    if (selectedStageId.value === normalizedStageId) {
      return
    }

    selectedStageId.value = normalizedStageId
    clearTeamCards()
  }

  async function fetchStageOptions() {
    if (stageOptionsLoading.value) {
      return
    }

    stageOptionsLoading.value = true
    stageOptionsError.value = ''

    try {
      const response = await getHockeySeasons()

      stageOptions.value = Array.isArray(response?.items) ? response.items : []

      if (response?.current_stage_id != null) {
        setSelectedStage(response.current_stage_id)
      } else if (!selectedStageId.value && stageOptions.value.length) {
        setSelectedStage(stageOptions.value[0].id)
      }
    } catch (error) {
      stageOptionsError.value =
          error instanceof Error ? error.message : 'Не удалось загрузить стадии'

      stageOptions.value = []
      selectedStageId.value = null
    } finally {
      stageOptionsLoading.value = false
    }
  }

  async function fetchTeamCards(force = false) {
    if (teamCardsLoading.value) {
      return
    }

    if (!selectedStageId.value) {
      clearTeamCards()
      return
    }

    if (!force && teamCards.value.length > 0) {
      return
    }

    teamCardsLoading.value = true
    teamCardsError.value = ''

    try {
      const cards = await getTeamCards(selectedStageId.value)
      teamCards.value = cards
    } catch (error) {
      const message =
          error instanceof Error ? error.message : 'Не удалось загрузить команды'

      teamCardsError.value = message
      teamCards.value = []

      toast.error({
        title: 'Ошибка загрузки команд',
        message,
      })
    } finally {
      teamCardsLoading.value = false
    }
  }

  async function fetchUpcomingMatches() {
    isLoading.value = true
    errorMessage.value = ''

    try {
      const response = await getUpcomingMatches()
      matches.value = Array.isArray(response) ? response : []
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

      liveMatches.value = Array.isArray(response?.items) ? response.items : []
      liveDebug.value = response?.debug ?? null
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
    if (loadingLive.value) {
      return
    }

    loadingLive.value = true
    liveError.value = ''

    try {
      const response = await getLiveMatches(10, 'ru')

      liveMatches.value = Array.isArray(response?.items) ? response.items : []
      liveDebug.value = response?.debug ?? null
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

  async function fetchMatchDetails(matchId: number | string, force = false) {
    if (matchDetailsLoading.value) {
      return
    }

    if (!force && currentMatchId.value === matchId && matchDetails.value) {
      return
    }

    matchDetailsLoading.value = true
    matchDetailsError.value = ''

    try {
      const response = await getMatchDetails(matchId, 'ru')

      matchDetails.value = response ?? null
      currentMatchId.value = matchId
    } catch (error) {
      const message =
          error instanceof Error
              ? error.message
              : 'Не удалось загрузить страницу матча'

      matchDetailsError.value = message

      toast.error({
        title: 'Ошибка загрузки матча',
        message,
      })
    } finally {
      matchDetailsLoading.value = false
    }
  }

  async function refreshMatchDetails() {
    if (!currentMatchId.value || matchDetailsLoading.value) {
      return
    }

    matchDetailsLoading.value = true
    matchDetailsError.value = ''

    try {
      const response = await getMatchDetails(currentMatchId.value, 'ru')
      matchDetails.value = response ?? null
    } catch (error) {
      const message =
          error instanceof Error
              ? error.message
              : 'Не удалось обновить страницу матча'

      matchDetailsError.value = message

      toast.error({
        title: 'Ошибка обновления матча',
        message,
      })
    } finally {
      matchDetailsLoading.value = false
    }
  }

  function clearMatchDetails() {
    matchDetails.value = null
    matchDetailsError.value = ''
    currentMatchId.value = null
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

    matchDetails,
    matchDetailsLoading,
    matchDetailsError,
    currentMatchId,
    fetchMatchDetails,
    refreshMatchDetails,
    clearMatchDetails,

    stageOptions,
    stageOptionsLoading,
    stageOptionsError,
    selectedStageId,
    fetchStageOptions,
    setSelectedStage,

    teamCards,
    teamCardsLoading,
    teamCardsError,
    fetchTeamCards,
    clearTeamCards,
  }
})