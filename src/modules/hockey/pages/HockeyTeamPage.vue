<script setup lang="ts">
import { computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { storeToRefs } from 'pinia'

import { hockey } from '../store/hockey'
import { useHockeyTeamPage } from '../composables/useHockeyTeamPage'
import { useHockeyTeamEloSnapshots } from '../composables/useHockeyTeamEloSnapshots'
import { getHockeySeasons } from '../api/getHockeySeasons'
import { getTeamColor, hexToRgba } from '../utils/khlTeamColors'

import HockeyTeamHero from '../components/team/HockeyTeamHero.vue'
import HockeyTeamOverviewCards from '../components/team/HockeyTeamOverviewCards.vue'
import HockeyTeamStats from '../components/team/HockeyTeamStats.vue'
import HockeyTeamMatchesList from '../components/team/HockeyTeamMatchesList.vue'
import HockeyTeamRoster from '../components/team/HockeyTeamRoster.vue'
import HockeyTeamEloChart from '../components/team/HockeyTeamEloChart.vue'
import HockeyFilterToolbar from '../components/toolbar/HockeyFilterToolbar.vue'
import UiBreadcrumbs from '../../../components/ui/breadcrumbs/UiBreadcrumbs.vue'

const route = useRoute()
const router = useRouter()
const hockeyStore = hockey()

const {
  eloSeasons,
  eloSeasonsLoading,
  selectedEloSeasonId,
} = storeToRefs(hockeyStore)

const teamId = computed(() => String(route.params.teamId || ''))

const routeStageId = computed(() =>
    route.query.stageId ? String(route.query.stageId) : undefined,
)

const seasonsQuery = useQuery({
  queryKey: ['hockey-stage-options'],
  queryFn: getHockeySeasons,
  retry: false,
})

const resolvedStageId = computed(() => {
  return (
      routeStageId.value ||
      (seasonsQuery.data.value?.current_stage_id
          ? String(seasonsQuery.data.value.current_stage_id)
          : undefined)
  )
})

const stageSelectOptions = computed(() => {
  return (seasonsQuery.data.value?.items ?? []).map((stage) => ({
    value: String(stage.id),
    label: stage.label,
  }))
})

const selectedStageLabel = computed(() => {
  const selectedStage = (seasonsQuery.data.value?.items ?? []).find(
      (stage) => String(stage.id) === String(resolvedStageId.value),
  )

  return selectedStage?.label ?? 'Статистика по выбранной стадии'
})

const eloSeasonOptions = computed(() => {
  return eloSeasons.value.map((season) => ({
    label: `${season.seasonLabel}${season.isActive ? ' · текущий' : ''}`,
    value: season.seasonId,
  }))
})

const selectedTeamEloSeasonId = computed(() => {
  return (
      selectedEloSeasonId.value ||
      eloSeasons.value.find((season) => season.isActive)?.seasonId ||
      ''
  )
})

const {
  data,
  isLoading,
  isFetching,
  isError,
  error,
  refetch,
} = useHockeyTeamPage(
    teamId,
    resolvedStageId,
)

const {
  data: eloSnapshotsData,
  isLoading: isEloSnapshotsLoading,
  isFetching: isEloSnapshotsFetching,
  isError: isEloSnapshotsError,
  error: eloSnapshotsError,
} = useHockeyTeamEloSnapshots(
    teamId,
    selectedTeamEloSeasonId,
)

const isInitialLoading = computed(() => {
  return (isLoading.value || seasonsQuery.isLoading.value) && !data.value
})

const isStageUpdating = computed(() => {
  return isFetching.value && !!data.value
})

const eloChartPoints = computed(() => eloSnapshotsData.value?.chart ?? [])
const eloSummary = computed(() => eloSnapshotsData.value?.summary ?? null)
const eloSplits = computed(() => eloSnapshotsData.value?.splits ?? null)

const teamThemeStyle = computed(() => {
  const teamName = data.value?.team?.name
  const teamColor = getTeamColor(teamName)

  return {
    '--team-color': teamColor,
    '--team-color-08': hexToRgba(teamColor, 0.08),
    '--team-color-12': hexToRgba(teamColor, 0.12),
    '--team-color-16': hexToRgba(teamColor, 0.16),
    '--team-color-20': hexToRgba(teamColor, 0.2),
    '--team-color-24': hexToRgba(teamColor, 0.24),
    '--team-color-32': hexToRgba(teamColor, 0.32),
    '--team-color-40': hexToRgba(teamColor, 0.4),
    '--team-color-55': hexToRgba(teamColor, 0.55),
    '--team-color-70': hexToRgba(teamColor, 0.7),
  }
})

async function handleStageChange(value: string) {
  const normalizedValue = value || undefined

  if (normalizedValue === routeStageId.value) {
    return
  }

  await router.replace({
    query: {
      ...route.query,
      stageId: normalizedValue,
    },
  })
}

function onTeamEloSeasonChange(seasonId: string | number) {
  const normalizedSeasonId = String(seasonId)
  hockeyStore.setSelectedEloSeason(normalizedSeasonId)
}

onMounted(() => {
  void hockeyStore.fetchEloSeasons()
})

/**
 * Если в URL нет stageId, но мы уже получили current_stage_id,
 * синхронизируем его в query-параметр.
 */
watch(
    resolvedStageId,
    async (value) => {
      if (!value || routeStageId.value === value) {
        return
      }

      await router.replace({
        query: {
          ...route.query,
          stageId: value,
        },
      })
    },
    { immediate: true },
)

/**
 * Принудительный refetch при смене teamId или stageId.
 * Это исправляет ситуацию, когда composable/useQuery
 * не перезапрашивает данные автоматически.
 */
watch(
    [teamId, resolvedStageId],
    async ([newTeamId, newStageId], [oldTeamId, oldStageId]) => {
      if (!newTeamId || !newStageId) {
        return
      }

      if (newTeamId === oldTeamId && newStageId === oldStageId) {
        return
      }

      await refetch()
    },
)

const breadcrumbs = computed(() => [
  { label: 'Главная', to: '/' },
  { label: 'Хоккейный центр', to: '/hockey' },
  { label: 'Команды', to: '/hockey/teams' },
  {
    label: data.value?.team?.name || 'Команда',
    to: '',
  },
])
</script>

<template>
  <section
      class="hockey-team-page"
      :style="teamThemeStyle"
  >
    <UiBreadcrumbs :items="breadcrumbs" />

    <div
        v-if="isError"
        class="hockey-team-page__state"
    >
      {{ error?.message || 'Не удалось загрузить страницу команды' }}
    </div>

    <div
        v-else-if="!isInitialLoading && !data?.team"
        class="hockey-team-page__state"
    >
      Команда не найдена
    </div>

    <template v-else>
      <HockeyTeamHero
          :team="data?.team"
          :is-loading="isInitialLoading"
      />

      <HockeyFilterToolbar
          :options="eloSeasonOptions"
          :model-value="selectedTeamEloSeasonId"
          :is-loading="eloSeasonsLoading"
          label="Сезон Elo"
          placeholder="Выберите сезон"
          @update:modelValue="onTeamEloSeasonChange"
      />

      <div
          v-if="isEloSnapshotsError"
          class="hockey-team-page__state"
      >
        {{ eloSnapshotsError?.message || 'Не удалось загрузить график Elo' }}
      </div>

      <HockeyTeamEloChart
          v-else
          :points="eloChartPoints"
          :summary="eloSummary"
          :team-name="data?.team?.name"
          :splits="eloSplits"
          :is-loading="isEloSnapshotsLoading || isEloSnapshotsFetching"
      />

      <HockeyTeamOverviewCards
          :arena="data?.arena"
          :next-match="data?.nextMatch"
          :head-coach="data?.team?.headCoach"
          :is-loading="isInitialLoading"
      />

      <HockeyTeamStats
          :stats="data?.stats"
          :subtitle="selectedStageLabel"
          :stage-options="stageSelectOptions"
          :stage-value="resolvedStageId ?? ''"
          :stage-loading="seasonsQuery.isLoading.value"
          :is-loading="isInitialLoading || isStageUpdating"
          @change-stage="handleStageChange"
      />

      <div class="hockey-team-page__matches">
        <HockeyTeamMatchesList
            title="Последние игры"
            :matches="data?.recentMatches ?? []"
            empty-text="Нет прошедших матчей"
            :is-loading="isInitialLoading || isStageUpdating"
        />

        <HockeyTeamMatchesList
            title="Будущие игры"
            :matches="data?.upcomingMatches ?? []"
            empty-text="Нет будущих матчей"
            :is-loading="isInitialLoading || isStageUpdating"
        />
      </div>

      <HockeyTeamRoster
          :roster="data?.roster"
          :is-loading="isInitialLoading || isStageUpdating"
      />
    </template>
  </section>
</template>

<style scoped lang="scss">
.hockey-team-page {
  display: grid;
  gap: 20px;
}

.hockey-team-page__state {
  padding: 32px 20px;
  border-radius: 24px;
  text-align: center;
  background: rgba(13, 18, 35, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.74);
}

.hockey-team-page__matches {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

@media (max-width: 1180px) {
  .hockey-team-page__matches {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .hockey-team-page {
    padding: 0;
  }
}
</style>