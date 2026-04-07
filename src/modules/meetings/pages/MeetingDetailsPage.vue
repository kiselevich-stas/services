<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import MeetingVoteChips from '../components/MeetingVoteChips.vue'
import { useMeetingsStore } from '../store/meetings'
import { formatMeetingDate } from '../utils/date'
import type { MeetingVoteStatus } from '../types'
import { useAuthStore } from '../../../stores/auth'

const route = useRoute()
const meetingsStore = useMeetingsStore()
const authStore = useAuthStore()
const voteStatus = ref<MeetingVoteStatus>('pending')

const meeting = computed(() => meetingsStore.currentMeeting)

const groupedVotes = computed(() => {
  const result = {
    going: 0,
    maybe: 0,
    not_going: 0,
    pending: 0,
  }

  for (const participant of meeting.value?.participants || []) {
    result[participant.status] += 1
  }

  return result
})

const currentParticipant = computed(() => {
  return meeting.value?.participants.find((participant) => participant.user_id === authStore.user?.id) || null
})

const mapPreviewUrl = computed(() => {
  if (!meeting.value) {
    return ''
  }

  const marker = `${meeting.value.place_lng},${meeting.value.place_lat},pm2rdm`
  const center = `${meeting.value.place_lng},${meeting.value.place_lat}`

  return `https://staticmap.openstreetmap.de/staticmap.php?center=${center}&zoom=15&size=1200x480&markers=${marker}`
})

const previewImageUrl = computed(() => {
  if (!meeting.value) {
    return ''
  }

  return meeting.value.place_image_url || mapPreviewUrl.value
})

onMounted(async () => {
  await meetingsStore.fetchMeeting(String(route.params.id))

  if (currentParticipant.value) {
    voteStatus.value = currentParticipant.value.status
  }
})

async function updateVote(status: MeetingVoteStatus) {
  if (!authStore.user?.id || !meeting.value) {
    return
  }

  voteStatus.value = status
  await meetingsStore.setVote(meeting.value.id, authStore.user.id, status)
}
</script>

<template>
  <section class="meeting-details-page" v-if="meeting">
    <div class="meeting-details-page__layout">
      <article class="panel meeting-details-page__main">
        <img :src="previewImageUrl" :alt="meeting.place_title" class="meeting-details-page__image" />

        <div class="meeting-details-page__content">
          <p class="meeting-details-page__eyebrow">{{ formatMeetingDate(meeting.starts_at) }}</p>
          <h1 class="meeting-details-page__title">{{ meeting.title }}</h1>
          <p class="meeting-details-page__place">{{ meeting.place_name }}</p>
          <p class="meeting-details-page__address">{{ meeting.place_address }}</p>
          <p class="meeting-details-page__description">{{ meeting.description }}</p>
        </div>
      </article>

      <aside class="meeting-details-page__side">
        <section class="panel">
          <h2 class="meeting-details-page__side-title">Твой ответ</h2>
          <MeetingVoteChips v-model="voteStatus" @update:modelValue="updateVote" />
        </section>

        <section class="panel vote-summary">
          <div class="vote-summary__row">
            <span>Придут</span>
            <strong>{{ groupedVotes.going }}</strong>
          </div>
          <div class="vote-summary__row">
            <span>Возможно</span>
            <strong>{{ groupedVotes.maybe }}</strong>
          </div>
          <div class="vote-summary__row">
            <span>Не придут</span>
            <strong>{{ groupedVotes.not_going }}</strong>
          </div>
          <div class="vote-summary__row">
            <span>Без ответа</span>
            <strong>{{ groupedVotes.pending }}</strong>
          </div>
        </section>
      </aside>
    </div>
  </section>

  <section v-else class="meeting-details-page panel">Загрузка…</section>
</template>

<style scoped lang="scss">
.meeting-details-page {
  display: grid;
  gap: 24px;
  padding: 24px;

  &__layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 320px;
    gap: 24px;
  }

  &__main {
    overflow: hidden;
    padding: 0;
  }

  &__image {
    display: block;
    width: 100%;
    height: 280px;
    object-fit: cover;
  }

  &__content {
    padding: 24px;
  }

  &__eyebrow {
    margin: 0 0 8px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: rgba(255, 255, 255, 0.45);
    font-size: 12px;
  }

  &__title {
    margin: 0 0 8px;
    color: #fff;
    font-size: 34px;
  }

  &__place {
    margin: 0 0 6px;
    color: rgba(255, 255, 255, 0.92);
    font-size: 18px;
  }

  &__address,
  &__description {
    margin: 0 0 12px;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.6;
  }

  &__side {
    display: grid;
    gap: 16px;
    align-content: start;
  }

  &__side-title {
    margin: 0 0 14px;
    color: #fff;
    font-size: 18px;
  }
}

.vote-summary {
  display: grid;
  gap: 12px;

  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: rgba(255, 255, 255, 0.74);
  }
}

.panel {
  border-radius: 28px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(16px);
}

@media (max-width: 980px) {
  .meeting-details-page__layout {
    grid-template-columns: 1fr;
  }
}
</style>
