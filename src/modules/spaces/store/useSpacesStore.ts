import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  createSpace,
  createSpaceInvite,
  fetchInviteByCode,
  fetchSpaceDetails,
  fetchSpaces,
  joinSpaceByCode,
} from '../api/spaces.api'
import type {
  CreateSpaceInvitePayload,
  CreateSpacePayload,
  SpaceCardModel,
  SpaceDetailsModel,
  SpaceInvite,
} from '../types/spaces.types'
import { useToastStore} from "../../../stores/toast.ts";
import { getAuthErrorMessage} from "../../../lib/errors/getAuthErrorMessage.ts";

type InviteWithSpace = SpaceInvite & {
  space: {
    id: string
    title: string
    description: string
    color: string
  } | null
}

export const useSpacesStore = defineStore('spaces', () => {
  const toastStore = useToastStore()

  const spaces = ref<SpaceCardModel[]>([])
  const currentSpace = ref<SpaceDetailsModel | null>(null)
  const currentInvite = ref<InviteWithSpace | null>(null)

  const isLoading = ref(false)
  const isCreating = ref(false)

  const hasSpaces = computed(() => spaces.value.length > 0)

  function showError(title: string, error: unknown) {
    toastStore.error(title, getAuthErrorMessage(error))
  }

  async function loadSpaces() {
    isLoading.value = true

    try {
      spaces.value = await fetchSpaces()
    } catch (error) {
      showError('Ошибка загрузки пространств', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function loadSpaceById(spaceId: string) {
    isLoading.value = true

    try {
      currentSpace.value = await fetchSpaceDetails(spaceId)
    } catch (error) {
      showError('Ошибка загрузки пространства', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function createNewSpace(payload: CreateSpacePayload) {
    isCreating.value = true

    try {
      const newSpace = await createSpace(payload)
      await loadSpaces()
      return newSpace
    } catch (error) {
      showError('Ошибка создания пространства', error)
      throw error
    } finally {
      isCreating.value = false
    }
  }

  async function generateInvite(payload: CreateSpaceInvitePayload) {
    try {
      const invite = await createSpaceInvite(payload)

      if (currentSpace.value?.space.id === payload.spaceId) {
        currentSpace.value.activeInvite = invite
      }

      return invite
    } catch (error) {
      showError('Ошибка создания ссылки', error)
      throw error
    }
  }

  async function loadInvite(code: string) {
    try {
      currentInvite.value = await fetchInviteByCode(code)
    } catch (error) {
      showError('Ошибка загрузки приглашения', error)
      throw error
    }
  }

  async function joinByCode(code: string) {
    try {
      const result = await joinSpaceByCode(code)
      await loadSpaces()
      return result
    } catch (error) {
      showError('Ошибка входа', error)
      throw error
    }
  }

  function resetCurrentSpace() {
    currentSpace.value = null
  }

  function resetCurrentInvite() {
    currentInvite.value = null
  }

  return {
    spaces,
    currentSpace,
    currentInvite,
    isLoading,
    isCreating,
    hasSpaces,
    loadSpaces,
    loadSpaceById,
    createNewSpace,
    generateInvite,
    loadInvite,
    joinByCode,
    resetCurrentSpace,
    resetCurrentInvite,
  }
})