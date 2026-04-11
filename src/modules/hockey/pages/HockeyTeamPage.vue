<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import UiPageLoader from '../../../components/ui/UiPageLoader.vue'
import { useHockeyTeamPage } from '../composables/useHockeyTeamPage'
import { getHockeySeasons } from '../api/getHockeySeasons'
import { getTeamColor, hexToRgba } from '../utils/khlTeamColors'
import HockeyTeamHero from '../components/team/HockeyTeamHero.vue'
import HockeyTeamOverviewCards from '../components/team/HockeyTeamOverviewCards.vue'
import HockeyTeamStats from '../components/team/HockeyTeamStats.vue'
import HockeyTeamMatchesList from '../components/team/HockeyTeamMatchesList.vue'
import HockeyTeamRoster from '../components/team/HockeyTeamRoster.vue'

const route = useRoute()
const router = useRouter()

const teamId = computed(() => String(route.params.teamId || ''))
const stageId = computed(() =>
    route.query.stageId ? String(route.query.stageId) : undefined,
)

const seasonsQuery = useQuery({
  queryKey: ['hockey-stage-options'],
  queryFn: getHockeySeasons,
  retry: false,
})

const stageSelectOptions = computed(() => {
  return (seasonsQuery.data.value?.items ?? []).map((stage) => ({
    value: String(stage.id),
    label: stage.label,
  }))
})

const selectedStageLabel = computed(() => {
  const selectedStage = (seasonsQuery.data.value?.items ?? []).find(
      (stage) => String(stage.id) === String(stageId.value),
  )

  return selectedStage?.label ?? 'Статистика по выбранной стадии'
})

const { data, isLoading, isFetching, isError, error } = useHockeyTeamPage(teamId, stageId)

const isInitialLoading = computed(() => isLoading.value && !data.value)
const isStageUpdating = computed(() => isFetching.value && !!data.value)

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
  await router.replace({
    query: {
      ...route.query,
      stageId: value || undefined,
    },
  })
}

watch(
    () => seasonsQuery.data.value,
    async (value) => {
      if (!value?.current_stage_id || stageId.value) {
        return
      }

      await router.replace({
        query: {
          ...route.query,
          stageId: String(value.current_stage_id),
        },
      })
    },
    { immediate: true },
)
</script>

<template>
  <section
      class="hockey-team-page"
      :style="teamThemeStyle"
  >
    <UiPageLoader
        v-if="isInitialLoading"
        visible
    />

    <div
        v-else-if="isError"
        class="hockey-team-page__state"
    >
      {{ error?.message || 'Не удалось загрузить страницу команды' }}
    </div>

    <div
        v-else-if="!data?.team"
        class="hockey-team-page__state"
    >
      Команда не найдена
    </div>

    <template v-else>
      <HockeyTeamHero :team="data.team" />

      <HockeyTeamOverviewCards
          :arena="data.arena"
          :next-match="data.nextMatch"
          :head-coach="data.team.headCoach"
      />

      <HockeyTeamStats
          :stats="data.stats"
          :subtitle="selectedStageLabel"
          :stage-options="stageSelectOptions"
          :stage-value="stageId ?? ''"
          :stage-loading="seasonsQuery.isLoading.value"
          :is-loading="isStageUpdating"
          @change-stage="handleStageChange"
      />

      <div class="hockey-team-page__matches">
        <HockeyTeamMatchesList
            title="Последние игры"
            :matches="data.recentMatches"
            empty-text="Нет прошедших матчей"
            :is-loading="isStageUpdating"
        />

        <HockeyTeamMatchesList
            title="Будущие игры"
            :matches="data.upcomingMatches"
            empty-text="Нет будущих матчей"
            :is-loading="isStageUpdating"
        />
      </div>

      <HockeyTeamRoster
          :roster="data.roster"
          :is-loading="isStageUpdating"
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