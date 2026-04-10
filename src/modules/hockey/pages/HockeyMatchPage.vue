<template>
  <section class="match-page">
    <UiBreadcrumbs :items="breadcrumbs" />
    <MatchPageSkeleton v-if="matchDetailsLoading" />

    <div v-else-if="matchDetailsError" class="match-page__state match-page__state--error">
      {{ matchDetailsError }}
    </div>

    <div v-else-if="!matchDetails" class="match-page__state">
      Матч не найден
    </div>

    <Transition name="page-fade" appear>
      <div v-if="matchDetails" class="match-page__content">
        <MatchHero
            :match-details="matchDetails"
            :formatted-score="formattedScore"
            :formatted-start-at="formattedStartAt"
            :arena-label="arenaLabel"
            :match-status-label="matchStatusLabel"
        />

        <div class="match-grid">
          <MatchPeriodsCard   class="match-card--full" :items="periodItems" />


          <MatchHeadToHeadCharts
              class="match-card--full"
              :head-to-head="matchDetails.headToHead"
              :team-a="matchDetails.teamA"
              :team-b="matchDetails.teamB"
          />

          <MatchStatsComparison
              class="match-card--full"
              :items="statsComparison"
          />

          <MatchLineupCard
              :title="`Стартовая пятёрка ${matchDetails.teamA?.name || ''}`"
              :players="matchDetails.teamA?.startFives || []"
          />

          <MatchLineupCard
              :title="`Стартовая пятёрка ${matchDetails.teamB?.name || ''}`"
              :players="matchDetails.teamB?.startFives || []"
          />

          <MatchTopPlayersCard
              :title="`Топ-игроки ${matchDetails.teamA?.name || ''}`"
              :items="matchDetails.teamA?.topPlayers || []"
          />

          <MatchTopPlayersCard
              :title="`Топ-игроки ${matchDetails.teamB?.name || ''}`"
              :items="matchDetails.teamB?.topPlayers || []"
          />

          <MatchTimelineCard
              class="match-card--full"
              title="Голы"
              empty-text="Нет данных о голах"
              :items="matchDetails.goals"
              :resolve-team-name="getTeamNameById"
              type="goals"
          />

          <MatchTimelineCard
              class="match-card--full"
              title="Удаления"
              empty-text="Нет данных об удалениях"
              :items="matchDetails.violations"
              :resolve-team-name="getTeamNameById"
              type="violations"
          />

          <MatchRostersCard
              class="match-card--full"
              :team-a="matchDetails.teamA"
              :team-b="matchDetails.teamB"
          />

          <MatchHeadToHeadCard :head-to-head="matchDetails.headToHead" :team-a="matchDetails.teamA" :team-b="matchDetails.teamB" />


          <MatchSummaryCard :match-details="matchDetails" />
          <MatchInfoCard   class="match-card--full" :match-details="matchDetails" />

          <MatchTextFeedCard
              class="match-card--full"
              :items="matchDetails.textEvents"
          />
        </div>
      </div>
    </Transition>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { hockey } from '../store/hockey'

import MatchHero from '../components/match/MatchHero.vue'
import MatchPeriodsCard from '../components/match/MatchPeriodsCard.vue'
import MatchInfoCard from '../components/match/MatchInfoCard.vue'
import MatchStatsComparison from '../components/match/MatchStatsComparison.vue'
import MatchLineupCard from '../components/match/MatchLineupCard.vue'
import MatchTopPlayersCard from '../components/match/MatchTopPlayersCard.vue'
import MatchTimelineCard from '../components/match/MatchTimelineCard.vue'
import MatchRostersCard from '../components/match/MatchRostersCard.vue'
import MatchHeadToHeadCard from '../components/match/MatchHeadToHeadCard.vue'
import MatchSummaryCard from '../components/match/MatchSummaryCard.vue'
import MatchTextFeedCard from '../components/match/MatchTextFeedCard.vue'
import MatchPageSkeleton from '../components/match/MatchPageSkeleton.vue'
import MatchHeadToHeadCharts from '../components/match/MatchHeadToHeadCharts.vue'

import { useMatchDetailsView } from '../composables/useMatchDetailsView'
import UiBreadcrumbs from "../../../components/ui/breadcrumbs/UiBreadcrumbs.vue";

const route = useRoute()
const hockeyStore = hockey()

const {
  matchDetails,
  matchDetailsLoading,
  matchDetailsError,
} = storeToRefs(hockeyStore)

const matchId = computed(() => String(route.params.id || ''))

const {
  formattedScore,
  formattedStartAt,
  arenaLabel,
  matchStatusLabel,
  periodItems,
  statsComparison,
  getTeamNameById,
} = useMatchDetailsView(matchDetails)

async function loadMatch() {
  if (!matchId.value) {
    return
  }

  await hockeyStore.fetchMatchDetails(matchId.value, true)
}

onMounted(() => {
  void loadMatch()
})

watch(
    () => route.params.id,
    () => {
      void loadMatch()
    },
)

onUnmounted(() => {
  hockeyStore.clearMatchDetails()
})

const breadcrumbs = computed(() => [
  { label: 'Главная', to: '/' },
  { label: 'Хоккейный центр', to: '/hockey' },
  {
    label:
        matchDetails.value
            ? `${matchDetails.value.teamA?.name || 'Команда 1'} — ${matchDetails.value.teamB?.name || 'Команда 2'}`
            : 'Матч',
    to: '',
  },
])
</script>

<style scoped lang="scss">
.match-page {
  min-height: 100%;
  padding: 24px;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.match-page__state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 320px;
  padding: 24px;
  border-radius: 24px;
  background: linear-gradient(180deg, rgba(13, 18, 35, 0.92), rgba(18, 25, 48, 0.95));
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 18px;
  font-weight: 600;
  text-align: center;
}

.match-page__state--error {
  color: #fca5a5;
}

.match-page__content {
  display: grid;
  gap: 20px;
}

.match-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.match-card--full {
  grid-column: 1 / -1;
}

.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (max-width: 980px) {
  .match-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .match-page {
    padding: 16px;
  }
}
</style>