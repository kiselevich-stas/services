<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import UiBreadcrumbs from '../../../components/ui/breadcrumbs/UiBreadcrumbs.vue'
import { hockey } from '../store/hockey'

import HomeHockeyHero from '../components/home/HomeHockeyHero.vue'
import HomeHockeyQuickLinks from '../components/home/HomeHockeyQuickLinks.vue'
import HomeHockeyLiveSection from '../components/home/HomeHockeyLiveSection.vue'
import HomeHockeyUpcomingSection from '../components/home/HomeHockeyUpcomingSection.vue'
import HomeHockeyTeamsSection from '../components/home/HomeHockeyTeamsSection.vue'
import HomeHockeyPageSkeleton from '../components/skeleton/HomeHockeyPageSkeleton.vue'

const hockeyStore = hockey()

const liveMatchesPreview = computed(() => {
  return (hockeyStore.liveMatches ?? []).slice(0, 2)
})

const upcomingMatchesPreview = computed(() => {
  return (hockeyStore.matches ?? []).slice(0, 6)
})

const teamsPreview = computed(() => {
  return hockeyStore.teamCards ?? []
})

const selectedStageLabel = computed(() => {
  const selectedStage = (hockeyStore.stageOptions ?? []).find(
      (stage) => String(stage.id) === String(hockeyStore.selectedStageId),
  )

  return selectedStage?.label ?? 'Текущий этап'
})

const isInitialLoading = computed(() => {
  const hasUpcoming = upcomingMatchesPreview.value.length > 0
  const hasTeams = teamsPreview.value.length > 0
  const hasLive = liveMatchesPreview.value.length > 0

  return (
      (hockeyStore.isLoading || hockeyStore.loadingLive || hockeyStore.teamCardsLoading) &&
      !hasUpcoming &&
      !hasTeams &&
      !hasLive
  )
})

function formatMatchDate(date: string | null | undefined) {
  if (!date) {
    return 'Дата уточняется'
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

async function initPage() {
  await Promise.all([
    !hockeyStore.matches?.length ? hockeyStore.fetchUpcomingMatches() : Promise.resolve(),
    !hockeyStore.stageOptions?.length ? hockeyStore.fetchStageOptions() : Promise.resolve(),
    hockeyStore.loadLiveMatches(),
  ])

  hockeyStore.startLivePolling(15_000)

  if (hockeyStore.selectedStageId) {
    await hockeyStore.fetchTeamCards(true)
  }
}

onMounted(() => {
  void initPage()
})

onUnmounted(() => {
  hockeyStore.stopLivePolling()
})

const breadcrumbs = computed(() => [
  { label: 'Главная', to: '/' },
  { label: 'Хоккейный центр', to: '/hockey' },
])
</script>

<template>
  <section class="home-hockey-page">
    <UiBreadcrumbs :items="breadcrumbs" />

    <HomeHockeyPageSkeleton v-if="isInitialLoading" />

    <template v-else>
      <HomeHockeyHero
          :live-count="hockeyStore.liveMatches?.length ?? 0"
          :upcoming-count="hockeyStore.matches?.length ?? 0"
          :teams-count="hockeyStore.teamCards?.length ?? 0"
      />

      <HomeHockeyQuickLinks />

      <HomeHockeyLiveSection
          :items="liveMatchesPreview"
          :is-loading="hockeyStore.loadingLive"
          :error-message="hockeyStore.liveError"
      />

      <HomeHockeyUpcomingSection
          :items="upcomingMatchesPreview"
          :is-loading="hockeyStore.isLoading"
          :error-message="hockeyStore.errorMessage"
          :format-match-date="formatMatchDate"
      />

      <HomeHockeyTeamsSection
          :items="teamsPreview"
          :is-loading="hockeyStore.teamCardsLoading"
          :error-message="hockeyStore.teamCardsError"
          :stage-label="selectedStageLabel"
      />
    </template>
  </section>
</template>

<style scoped lang="scss">
.home-hockey-page {
  display: grid;
  gap: 24px;
}

.home-hockey-page > * {
  animation: page-fade 0.35s ease;
}

@keyframes page-fade {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>