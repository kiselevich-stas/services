<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MeetingCard from '../components/MeetingCard.vue'
import { useMeetingsStore } from '../store/meetings'

const router = useRouter()
const meetingsStore = useMeetingsStore()

onMounted(() => {
  meetingsStore.fetchMeetings()
})

function openMeeting(meetingId: string) {
  router.push(`/meetings/${meetingId}`)
}

function openCreatePage() {
  router.push('/meetings/new')
}
</script>

<template>
  <section class="meetings-page">
    <header class="meetings-page__header panel">
      <div>
        <p class="meetings-page__eyebrow">Meetings</p>
        <h1 class="meetings-page__title">Встречи</h1>
        <p class="meetings-page__text">
          Спокойный список встреч в строгом стиле: без ярких кнопок и лишнего шума.
        </p>
      </div>

      <div class="meetings-page__create" @click="openCreatePage">Новая встреча</div>
    </header>

    <div v-if="meetingsStore.isLoading" class="panel meetings-page__state">Загрузка…</div>

    <div v-else-if="!meetingsStore.items.length" class="panel meetings-page__state">
      Пока нет встреч.
    </div>

    <div v-else class="meetings-grid">
      <MeetingCard
        v-for="meeting in meetingsStore.upcomingMeetings"
        :key="meeting.id"
        :meeting="meeting"
        @open="openMeeting"
      />
    </div>
  </section>
</template>

<style scoped lang="scss">
.meetings-page {
  display: grid;
  gap: 24px;
  padding: 24px;

  &__header {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    align-items: end;
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
    font-size: 32px;
  }

  &__text {
    margin: 0;
    max-width: 520px;
    color: rgba(255, 255, 255, 0.6);
  }

  &__create {
    min-height: 48px;
    padding: 0 18px;
    display: grid;
    place-items: center;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.9);
    background: rgba(255, 255, 255, 0.04);
    cursor: pointer;
    white-space: nowrap;
  }

  &__state {
    color: rgba(255, 255, 255, 0.6);
  }
}

.meetings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 18px;
}

.panel {
  border-radius: 28px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(16px);
}
</style>
