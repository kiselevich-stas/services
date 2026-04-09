import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUpcomingMatches } from '../api/hockeyApi'
import type { HockeyUpcomingMatch } from '../types'
import { useToastStore} from "../../../stores/toast.ts";

export const useHockeyStore = defineStore('hockey', () => {
  const matches = ref<HockeyUpcomingMatch[]>([])
  const isLoading = ref(false)
  const errorMessage = ref('')

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

  return {
    matches,
    isLoading,
    errorMessage,
    fetchUpcomingMatches,
  }
})