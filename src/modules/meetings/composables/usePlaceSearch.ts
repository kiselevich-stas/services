import { ref } from 'vue'
import { searchPlaces } from '../api/places.api'
import type { MeetingPlace } from '../types'

export function usePlaceSearch() {
  const items = ref<MeetingPlace[]>([])
  const isLoading = ref(false)
  const errorMessage = ref('')

  async function findPlaces(query: string) {
    if (!query.trim()) {
      items.value = []
      return
    }

    isLoading.value = true
    errorMessage.value = ''

    try {
      items.value = await searchPlaces(query)
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : 'Ошибка поиска'
    } finally {
      isLoading.value = false
    }
  }

  return {
    items,
    isLoading,
    errorMessage,
    findPlaces,
  }
}
