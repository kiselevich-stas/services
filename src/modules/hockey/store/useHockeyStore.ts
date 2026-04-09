import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { getHockeyBootstrap } from '../api/hockey.functions'
import type { HockeyStage, HockeyTeam } from '../types'

export const useHockeyStore = defineStore('hockey', () => {
  const loading = ref(false)
  const isLoaded = ref(false)

  const teams = ref<HockeyTeam[]>([])
  const stages = ref<HockeyStage[]>([])
  const currentStageId = ref<number | null>(null)

  const selectedTeamAId = useStorage<string>('hockey:selected-team-a', '')
  const selectedTeamBId = useStorage<string>('hockey:selected-team-b', '')
  const selectedStageId = useStorage<string>('hockey:selected-stage', '')

  const teamOptions = computed(() => {
    return (Array.isArray(teams.value) ? teams.value : []).map((team) => ({
      label: `${team.location ?? ''} ${team.name ?? ''}`.trim(),
      value: String(team.id),
    }))
  })

  const stageOptions = computed(() => {
    return (Array.isArray(stages.value) ? stages.value : []).map((stage) => ({
      label: `${stage.title ?? ''}${stage.season ? ` · ${stage.season}` : ''}`,
      value: String(stage.id),
    }))
  })

  const hasValidTeamPair = computed(() => {
    return Boolean(
        selectedTeamAId.value &&
        selectedTeamBId.value &&
        selectedTeamAId.value !== selectedTeamBId.value,
    )
  })

  const canSubmit = computed(() => {
    return Boolean(
        selectedTeamAId.value &&
        selectedTeamBId.value &&
        selectedTeamAId.value !== selectedTeamBId.value &&
        selectedStageId.value,
    )
  })

  async function ensureLoaded(): Promise<void> {
    if (isLoaded.value || loading.value) {
      return
    }

    loading.value = true

    try {
      const data = await getHockeyBootstrap()

      teams.value = Array.isArray(data?.teams) ? data.teams : []
      stages.value = Array.isArray(data?.stages) ? data.stages : []
      currentStageId.value =
          typeof data?.currentStageId === 'number' ? data.currentStageId : null

      if (!selectedStageId.value && currentStageId.value) {
        selectedStageId.value = String(currentStageId.value)
      }

      isLoaded.value = true
    } catch (error) {
      console.error('Failed to load hockey bootstrap:', error)

      teams.value = []
      stages.value = []
      currentStageId.value = null
      isLoaded.value = false

      throw error
    } finally {
      loading.value = false
    }
  }

  function swapTeams(): void {
    const previousFirst = selectedTeamAId.value
    selectedTeamAId.value = selectedTeamBId.value
    selectedTeamBId.value = previousFirst
  }

  function resetSelections(): void {
    selectedTeamAId.value = ''
    selectedTeamBId.value = ''
    selectedStageId.value = currentStageId.value ? String(currentStageId.value) : ''
  }

  return {
    loading,
    isLoaded,
    teams,
    stages,
    currentStageId,
    selectedTeamAId,
    selectedTeamBId,
    selectedStageId,
    teamOptions,
    stageOptions,
    hasValidTeamPair,
    canSubmit,
    ensureLoaded,
    swapTeams,
    resetSelections,
  }
})