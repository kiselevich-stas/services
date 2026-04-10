<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { hockey } from '../store/hockey'

import UiBreadcrumbs from '../../../components/ui/breadcrumbs/UiBreadcrumbs.vue'
import HockeyEloHero from '../components/elo/HockeyEloHero.vue'
import HockeyEloContent from '../components/elo/HockeyEloContent.vue'
import HockeyEloPageSkeleton from '../components/skeleton/HockeyEloPageSkeleton.vue'
import HockeyFilterToolbar from '../components/toolbar/HockeyFilterToolbar.vue'

const hockeyStore = hockey()

const {
  eloSeasons,
  eloSeasonsLoading,
  eloSeasonsError,
  selectedEloSeasonId,
  eloRating,
  eloRatingLoading,
  eloRatingError,
  eloCalculatedAt,
  eloSeasonLabel,
  eloHasData,
  eloRecalculateLoading,
  canRecalculateSelectedSeason,
} = storeToRefs(hockeyStore)

const breadcrumbs = computed(() => [
  { label: 'Главная', to: '/' },
  { label: 'Хоккейный центр', to: '/hockey' },
  { label: 'Elo рейтинг' },
])

const seasonOptions = computed(() => {
  return eloSeasons.value.map((season) => ({
    label: `${season.seasonLabel}${season.isActive ? ' · текущий' : ''}`,
    value: season.seasonId,
  }))
})

const selectedSeasonLabel = computed(() => {
  return (
      eloSeasons.value.find((season) => season.seasonId === selectedEloSeasonId.value)
          ?.seasonLabel ?? '—'
  )
})

const formattedCalculatedAt = computed(() => {
  if (!eloCalculatedAt.value) {
    return '—'
  }

  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(eloCalculatedAt.value))
})

const isInitialContentLoading = computed(() => {
  return eloSeasonsLoading.value || eloRatingLoading.value
})

async function initPage() {
  await hockeyStore.fetchEloSeasons()
  await hockeyStore.fetchEloRating()
}

async function onSeasonChange(seasonId: string | number) {
  const normalizedSeasonId = String(seasonId)

  hockeyStore.setSelectedEloSeason(normalizedSeasonId)
  await hockeyStore.fetchEloRating(normalizedSeasonId, true)
}

async function onRecalculate() {
  await hockeyStore.recalculateSelectedSeasonElo()
}

onMounted(() => {
  void initPage()
})
</script>

<template>
  <section class="hockey-elo-page">
    <UiBreadcrumbs :items="breadcrumbs" />

    <HockeyEloHero
        :selected-season-label="selectedSeasonLabel"
        :formatted-calculated-at="formattedCalculatedAt"
    />

    <HockeyFilterToolbar
        :options="seasonOptions"
        :model-value="selectedEloSeasonId ?? ''"
        :is-loading="eloSeasonsLoading"
        label="Сезон"
        placeholder="Выберите сезон"
        @update:modelValue="onSeasonChange"
    />

    <HockeyEloPageSkeleton v-if="isInitialContentLoading" />

    <HockeyEloContent
        v-else
        :elo-seasons-error="eloSeasonsError"
        :elo-rating-error="eloRatingError"
        :elo-has-data="eloHasData"
        :elo-rating="eloRating"
        :can-recalculate-selected-season="canRecalculateSelectedSeason"
        :elo-recalculate-loading="eloRecalculateLoading"
        :season-label="eloSeasonLabel || selectedSeasonLabel"
        @recalculate="onRecalculate"
    />
  </section>
</template>

<style scoped lang="scss">
.hockey-elo-page {
  display: grid;
  gap: 24px;
  padding: 24px;
}

@media (max-width: 900px) {
  .hockey-elo-page {
    padding: 16px;
  }
}
</style>