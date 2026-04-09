<script setup lang="ts">
import { computed, onMounted } from 'vue'
import TeamSelectForm from '../components/TeamSelectForm.vue'
import HeadToHeadHero from '../components/HeadToHeadHero.vue'
import { useHockeyStore } from '../store/useHockeyStore'
import { useHeadToHead } from '../composables/useHeadToHead'
import { formatDateTime, formatTeamTitle, getWinnerTeamId } from '../utils/h2h'

const hockeyStore = useHockeyStore()

onMounted(() => {
  hockeyStore.ensureLoaded()
})

const query = useHeadToHead({
  teamAId: hockeyStore.selectedTeamAId,
  teamBId: hockeyStore.selectedTeamBId,
  stageId: hockeyStore.selectedStageId,
})

const summary = computed(() => {
  const data = query.data.value

  if (!data?.teams?.teamA || !data?.teams?.teamB || !data?.total) {
    return null
  }

  return data
})

const recentGames = computed(() => summary.value?.recentGames ?? [])

function submit(): void {
  if (!hockeyStore.canSubmit) {
    return
  }

  query.refetch()
}

function swapTeams(): void {
  hockeyStore.swapTeams()

  if (hockeyStore.canSubmit) {
    query.refetch()
  }
}

function getWinnerLabel(
    eventId: number,
    winnerId: number | null,
    teamAId: number,
    teamBId: number,
): string {
  if (!winnerId) {
    return 'Ничья / серия буллитов'
  }

  return winnerId === teamAId
      ? 'Победа команды 1'
      : winnerId === teamBId
          ? 'Победа команды 2'
          : `Матч #${eventId}`
}
</script>

<template>
  <div class="hockey-page">
    <section class="panel hero-panel hockey-page__intro">
      <div>
        <p class="hero-panel__eyebrow">Новый модуль</p>
        <h1 class="hero-panel__title">KHL Head-to-Head</h1>
        <p class="hero-panel__text">
          Выбери две команды и посмотри статистику личных встреч по текущей стадии турнира.
        </p>
      </div>
    </section>

    <TeamSelectForm
        :team-a-id="hockeyStore.selectedTeamAId"
        :team-b-id="hockeyStore.selectedTeamBId"
        :stage-id="hockeyStore.selectedStageId"
        :team-options="hockeyStore.teamOptions"
        :stage-options="[]"
        @update:team-a-id="(value) => hockeyStore.selectedTeamAId = value"
        @update:team-b-id="(value) => hockeyStore.selectedTeamBId = value"
        @swap="swapTeams"
        @submit="submit"
    />

    <div v-if="hockeyStore.loading" class="panel empty-state">
      Загружаю команды…
    </div>

    <div
        v-else-if="
        hockeyStore.selectedTeamAId &&
        hockeyStore.selectedTeamBId &&
        hockeyStore.selectedTeamAId === hockeyStore.selectedTeamBId
      "
        class="panel empty-state"
    >
      Выбери две разные команды для сравнения.
    </div>

    <div v-else-if="!hockeyStore.hasValidTeamPair" class="panel empty-state">
      Выбери две команды, чтобы посмотреть статистику личных встреч.
    </div>

    <div v-else-if="query.isLoading.value || query.isFetching.value" class="panel empty-state">
      Загружаю статистику личных встреч…
    </div>

    <div v-else-if="query.isError.value" class="panel empty-state">
      Не удалось получить хоккейные данные.
    </div>

    <div v-else-if="!summary" class="panel empty-state">
      Ответ получен, но структура данных неполная.
    </div>

    <template v-else>
      <HeadToHeadHero :summary="summary" />

      <div class="hockey-page__grid">
        <section class="panel">
          <div class="panel__header">
            <h2 class="panel__title">Баланс побед</h2>
            <p class="panel__text">Сводка по текущей стадии.</p>
          </div>

          <div class="metric-grid">
            <div class="metric-box">
              <span>{{ summary.teams.teamA.name }}</span>
              <strong>{{ summary.total.teamAWins }}</strong>
            </div>

            <div class="metric-box">
              <span>{{ summary.teams.teamB.name }}</span>
              <strong>{{ summary.total.teamBWins }}</strong>
            </div>

            <div class="metric-box">
              <span>Без явного победителя</span>
              <strong>{{ summary.total.drawsOrShootoutGames }}</strong>
            </div>

            <div class="metric-box" v-if="summary.allTimePairStat">
              <span>За всё время</span>
              <strong>{{ summary.allTimePairStat.eventsCount }}</strong>
            </div>
          </div>
        </section>

        <section class="panel">
          <div class="panel__header">
            <h2 class="panel__title">Последние встречи</h2>
            <p class="panel__text">Пять свежих матчей выбранной пары.</p>
          </div>

          <div v-if="!recentGames.length" class="empty-state">
            Для текущей стадии нет матчей между выбранными командами.
          </div>

          <div v-else class="hockey-games">
            <article v-for="game in recentGames" :key="game.id" class="hockey-game">
              <div>
                <div class="hockey-game__title">
                  {{ formatTeamTitle(game.teamA) }} — {{ formatTeamTitle(game.teamB) }}
                </div>

                <div class="hockey-game__meta">
                  {{ formatDateTime(game.startAt) }} · {{ game.stageName || 'Без стадии' }}
                </div>
              </div>

              <div class="hockey-game__score-block">
                <strong class="hockey-game__score">{{ game.score }}</strong>
                <span class="hockey-game__result">
                  {{
                    getWinnerLabel(
                        game.id,
                        getWinnerTeamId(game),
                        summary.teams.teamA.id,
                        summary.teams.teamB.id,
                    )
                  }}
                </span>
              </div>
            </article>
          </div>
        </section>
      </div>
    </template>
  </div>
</template>