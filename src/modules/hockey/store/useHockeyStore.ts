import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getUpcomingMatches } from '../api/hockey.functions'
import type { HockeyUpcomingMatch } from '../types'

export const useHockeyStore = defineStore('hockey', () => {
  const loading = ref(false)
  const isLoaded = ref(false)
  const upcomingMatches = ref<HockeyUpcomingMatch[]>([])

  async function loadUpcomingMatches(limit = 12): Promise<void> {
    if (loading.value) return

    loading.value = true

    try {
      upcomingMatches.value = await getUpcomingMatches(limit)
      isLoaded.value = true
    } catch (error) {
      console.error('Failed to load upcoming hockey matches:', error)
      upcomingMatches.value = []
      isLoaded.value = false
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    isLoaded,
    upcomingMatches,
    loadUpcomingMatches,
  }
})