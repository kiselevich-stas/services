<template>
  <section class="match-page">
    <UiBreadcrumbs :items="breadcrumbs" />

    <MatchPageSkeleton v-if="matchDetailsLoading" />

    <div
        v-else-if="matchDetailsError"
        class="match-page__state match-page__state--error"
    >
      {{ matchDetailsError }}
    </div>

    <div
        v-else-if="!matchDetails"
        class="match-page__state"
    >
      Матч не найден
    </div>

    <Transition name="page-fade" appear>
      <div
          v-if="matchDetails"
          class="match-page__content"
      >
        <MatchHero
            :match-details="matchDetails"
            :formatted-score="formattedScore"
            :formatted-start-at="formattedStartAt"
            :arena-label="arenaLabel"
            :match-status-label="matchStatusLabel"
        />

        <div class="match-grid">
          <template v-if="shouldShowEloBlock">
            <MatchEloPredictionCard
                v-if="matchEloPrediction"
                class="match-card--full"
                :home-team-name="matchEloPrediction.homeTeamName"
                :away-team-name="matchEloPrediction.awayTeamName"
                :home-rating="matchEloPrediction.homeRating"
                :away-rating="matchEloPrediction.awayRating"
            />

            <div
                v-else-if="matchEloPredictionLoading"
                class="match-elo-skeleton match-card--full"
            >
              <div class="match-elo-skeleton__head">
                <div class="skeleton match-elo-skeleton__eyebrow" />
                <div class="skeleton match-elo-skeleton__title" />
              </div>

              <div class="match-elo-skeleton__teams">
                <div class="match-elo-skeleton__team">
                  <div class="skeleton match-elo-skeleton__team-name" />
                  <div class="skeleton match-elo-skeleton__bar" />
                </div>

                <div class="match-elo-skeleton__team">
                  <div class="skeleton match-elo-skeleton__team-name" />
                  <div class="skeleton match-elo-skeleton__bar" />
                </div>
              </div>
            </div>

            <div
                v-else-if="matchEloPredictionError"
                class="match-page__state match-page__state--error match-card--full"
            >
              {{ matchEloPredictionError }}
            </div>
          </template>

          <MatchPeriodsCard
              class="match-card--full"
              :items="periodItems"
          />

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

          <MatchHeadToHeadCard
              :head-to-head="matchDetails.headToHead"
              :team-a="matchDetails.teamA"
              :team-b="matchDetails.teamB"
          />

          <MatchSummaryCard :match-details="matchDetails" />

          <MatchInfoCard
              class="match-card--full"
              :match-details="matchDetails"
          />

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
import MatchEloPredictionCard from '../components/match/MatchEloPredictionCard.vue'
import UiBreadcrumbs from '../../../components/ui/breadcrumbs/UiBreadcrumbs.vue'

import { useMatchDetailsView } from '../composables/useMatchDetailsView'

const route = useRoute()
const hockeyStore = hockey()

const {
  matchDetails,
  matchDetailsLoading,
  matchDetailsError,
  matchEloPrediction,
  matchEloPredictionLoading,
  matchEloPredictionError,
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


const shouldShowEloBlock = computed(() => {
  return matchDetails.value?.gameStateKey !== 'finished'
})

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
    label: matchDetails.value
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

.match-elo-skeleton {
  display: grid;
  gap: 20px;
  padding: 24px;
  border-radius: 24px;
  background: linear-gradient(180deg, rgba(13, 18, 35, 0.92), rgba(18, 25, 48, 0.95));
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.match-elo-skeleton__head {
  display: grid;
  gap: 10px;
}

.match-elo-skeleton__eyebrow {
  width: 90px;
  height: 14px;
  border-radius: 10px;
}

.match-elo-skeleton__title {
  width: 220px;
  max-width: 100%;
  height: 28px;
  border-radius: 12px;
}

.match-elo-skeleton__teams {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.match-elo-skeleton__team {
  display: grid;
  gap: 10px;
}

.match-elo-skeleton__team-name {
  width: 120px;
  height: 16px;
  border-radius: 10px;
}

.match-elo-skeleton__bar {
  width: 100%;
  height: 14px;
  border-radius: 999px;
}

.skeleton {
  background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0.06) 25%,
          rgba(255, 255, 255, 0.14) 50%,
          rgba(255, 255, 255, 0.06) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.4s infinite linear;
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

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
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

  .match-elo-skeleton__teams {
    grid-template-columns: 1fr;
  }
}
</style>