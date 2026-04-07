import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import {
  createMeeting,
  getMeetingById,
  getMeetings,
  updateVote,
} from '../api/meetings.api'
import type { Meeting, MeetingCreatePayload, MeetingDetails, MeetingVoteStatus } from '../types'

export const useMeetingsStore = defineStore('meetings', () => {
  const items = ref<Meeting[]>([])
  const currentMeeting = ref<MeetingDetails | null>(null)
  const isLoading = ref(false)
  const isSaving = ref(false)

  const upcomingMeetings = computed(() => {
    const now = Date.now()

    return items.value.filter((item) => new Date(item.starts_at).getTime() >= now)
  })

  async function fetchMeetings() {
    isLoading.value = true

    try {
      items.value = await getMeetings()
    } finally {
      isLoading.value = false
    }
  }

  async function fetchMeeting(meetingId: string) {
    isLoading.value = true

    try {
      currentMeeting.value = await getMeetingById(meetingId)
    } finally {
      isLoading.value = false
    }
  }

  async function saveMeeting(payload: MeetingCreatePayload) {
    isSaving.value = true

    try {
      const meeting = await createMeeting(payload)
      items.value.unshift(meeting)

      return meeting
    } finally {
      isSaving.value = false
    }
  }

  async function setVote(meetingId: string, userId: string, status: MeetingVoteStatus) {
    await updateVote(meetingId, userId, status)

    if (!currentMeeting.value) {
      return
    }

    currentMeeting.value.participants = currentMeeting.value.participants.map((participant) => {
      if (participant.user_id !== userId) {
        return participant
      }

      return {
        ...participant,
        status,
      }
    })
  }

  return {
    items,
    currentMeeting,
    isLoading,
    isSaving,
    upcomingMeetings,
    fetchMeetings,
    fetchMeeting,
    saveMeeting,
    setVote,
  }
})