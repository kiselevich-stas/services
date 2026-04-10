import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { getUpcomingMatches } from '../api/hockeyApi'
import { getLiveMatches } from '../api/getLiveMatches'
import { getMatchDetails } from '../api/getMatchDetails'
import { getHockeySeasons } from '../api/getHockeySeasons'
import { getTeamCards } from '../api/getTeamCards'

import { getEloSeasons } from '../api/getEloSeasons'
import { getEloRating } from '../api/getEloRating'
import { recalculateElo } from '../api/recalculateElo'

import type {
  HockeyUpcomingMatch,
  HockeyMatch,
  HockeyMatchDetails,
  HockeyStageOption,
  HockeyTeamCard,
  HockeyEloSeason,
  HockeyEloRatingTeam,
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

  const eloSeasons = ref<HockeyEloSeason[]>([])
  const eloSeasonsLoading = ref(false)
  const eloSeasonsError = ref('')

  const selectedEloSeasonId = ref<string | null>(null)
  const currentEloSeasonId = ref<string | null>(null)

  const eloRating = ref<HockeyEloRatingTeam[]>([])
  const eloRatingLoading = ref(false)
  const eloRatingError = ref('')
  const eloCalculatedAt = ref<string | null>(null)
  const eloSeasonLabel = ref<string | null>(null)
  const eloHasData = ref(false)

  const eloRecalculateLoading = ref(false)

  const selectedEloSeason = computed(() => {
    return (
        eloSeasons.value.find((season) => season.seasonId === selectedEloSeasonId.value) ??
        null
    )
  })

  const canRecalculateSelectedSeason = computed(() => {
    return Boolean(
        selectedEloSeason.value &&
        currentEloSeasonId.value &&
        selectedEloSeason.value.seasonId === currentEloSeasonId.value,
    )
  })

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

  function resetEloRatingState() {
    eloRating.value = []
    eloRatingError.value = ''
    eloCalculatedAt.value = null
    eloSeasonLabel.value = null
    eloHasData.value = false
  }

  function setSelectedEloSeason(seasonId: string | null | undefined) {
    const normalizedSeasonId = seasonId ? String(seasonId) : null

    if (selectedEloSeasonId.value === normalizedSeasonId) {
      return
    }

    selectedEloSeasonId.value = normalizedSeasonId
    resetEloRatingState()
  }

  async function fetchEloSeasons(force = false) {
    if (eloSeasonsLoading.value) {
      return
    }

    if (!force && eloSeasons.value.length > 0) {
      return
    }

    eloSeasonsLoading.value = true
    eloSeasonsError.value = ''

    try {
      const response = await getEloSeasons()

      eloSeasons.value = Array.isArray(response?.items) ? response.items : []
      currentEloSeasonId.value = response?.currentSeasonId ?? null

      if (!selectedEloSeasonId.value) {
        selectedEloSeasonId.value =
            response?.currentSeasonId ??
            eloSeasons.value[0]?.seasonId ??
            null
      }
    } catch (error) {
      const message =
          error instanceof Error ? error.message : 'Не удалось загрузить сезоны Elo'

      eloSeasonsError.value = message
      eloSeasons.value = []
      currentEloSeasonId.value = null
      selectedEloSeasonId.value = null

      toast.error({
        title: 'Ошибка загрузки сезонов Elo',
        message,
      })
    } finally {
      eloSeasonsLoading.value = false
    }
  }

  async function fetchEloRating(seasonId?: string | null, force = false) {
    const resolvedSeasonId = seasonId ?? selectedEloSeasonId.value

    if (!resolvedSeasonId) {
      resetEloRatingState()
      return
    }

    if (eloRatingLoading.value) {
      return
    }

    if (!force && eloHasData.value && selectedEloSeasonId.value === resolvedSeasonId) {
      return
    }

    eloRatingLoading.value = true
    eloRatingError.value = ''

    try {
      const response = await getEloRating(resolvedSeasonId)

      selectedEloSeasonId.value = resolvedSeasonId
      eloRating.value = Array.isArray(response?.items) ? response.items : []
      eloCalculatedAt.value = response?.calculatedAt ?? null
      eloSeasonLabel.value = response?.seasonLabel ?? null
      eloHasData.value = Boolean(response?.hasData)
    } catch (error) {
      const message =
          error instanceof Error ? error.message : 'Не удалось загрузить рейтинг Elo'

      eloRatingError.value = message
      resetEloRatingState()

      toast.error({
        title: 'Ошибка загрузки рейтинга Elo',
        message,
      })
    } finally {
      eloRatingLoading.value = false
    }
  }

  async function recalculateSelectedSeasonElo() {
    if (!selectedEloSeasonId.value) {
      return
    }

    if (!canRecalculateSelectedSeason.value) {
      toast.error({
        title: 'Пересчёт недоступен',
        message: 'Пересчитать Elo можно только для текущего активного сезона',
      })
      return
    }

    if (eloRecalculateLoading.value) {
      return
    }

    eloRecalculateLoading.value = true

    try {
      const response = await recalculateElo(selectedEloSeasonId.value, true)

      if (!response?.ok) {
        throw new Error(response?.error || 'Не удалось пересчитать рейтинг Elo')
      }

      toast.success({
        title: 'Elo рейтинг пересчитан',
        message: response.fromCache
            ? 'Загружен актуальный кеш сезона'
            : 'Рейтинг для текущего сезона успешно обновлён',
      })

      await fetchEloRating(selectedEloSeasonId.value, true)
    } catch (error) {
      const message =
          error instanceof Error ? error.message : 'Не удалось пересчитать рейтинг Elo'

      toast.error({
        title: 'Ошибка пересчёта Elo',
        message,
      })
    } finally {
      eloRecalculateLoading.value = false
    }
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

    eloSeasons,
    eloSeasonsLoading,
    eloSeasonsError,
    selectedEloSeasonId,
    currentEloSeasonId,
    selectedEloSeason,
    eloRating,
    eloRatingLoading,
    eloRatingError,
    eloCalculatedAt,
    eloSeasonLabel,
    eloHasData,
    eloRecalculateLoading,
    canRecalculateSelectedSeason,
    fetchEloSeasons,
    fetchEloRating,
    recalculateSelectedSeasonElo,
    setSelectedEloSeason,
    resetEloRatingState,
  }
})