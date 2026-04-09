<template>
  <section class="match-page">
    <div v-if="matchDetailsLoading" class="match-page__state">
      Загрузка страницы матча...
    </div>

    <div v-else-if="matchDetailsError" class="match-page__state match-page__state--error">
      {{ matchDetailsError }}
    </div>

    <div v-else-if="!matchDetails" class="match-page__state">
      Матч не найден
    </div>

    <div v-else class="match-page__content">
      <header class="match-hero">
        <div class="match-hero__team">
          <img
              v-if="matchDetails.teamA?.image"
              :src="matchDetails.teamA.image"
              :alt="matchDetails.teamA.name"
              class="match-hero__logo"
          />
          <div class="match-hero__team-meta">
            <h2>{{ matchDetails.teamA?.name || 'Команда 1' }}</h2>
            <p>{{ matchDetails.teamA?.location || '—' }}</p>
          </div>
        </div>

        <div class="match-hero__center">
          <div class="match-hero__status">
            {{ matchStatusLabel }}
          </div>

          <div class="match-hero__score">
            {{ formattedScore }}
          </div>

          <div class="match-hero__meta">
            <span>{{ formattedStartAt }}</span>
            <span v-if="matchDetails.stageName">• {{ matchDetails.stageName }}</span>
          </div>

          <div class="match-hero__arena">
            {{ arenaLabel }}
          </div>
        </div>

        <div class="match-hero__team match-hero__team--right">
          <img
              v-if="matchDetails.teamB?.image"
              :src="matchDetails.teamB.image"
              :alt="matchDetails.teamB.name"
              class="match-hero__logo"
          />
          <div class="match-hero__team-meta">
            <h2>{{ matchDetails.teamB?.name || 'Команда 2' }}</h2>
            <p>{{ matchDetails.teamB?.location || '—' }}</p>
          </div>
        </div>
      </header>

      <div class="match-grid">
        <section class="match-card">
          <h3 class="match-card__title">По периодам</h3>

          <div class="periods-grid">
            <div
                v-for="item in periodItems"
                :key="item.label"
                class="period-item"
            >
              <span class="period-item__label">{{ item.label }}</span>
              <strong class="period-item__value">{{ item.value || '—' }}</strong>
            </div>
          </div>
        </section>

        <section class="match-card">
          <h3 class="match-card__title">Информация о матче</h3>

          <div class="info-list">
            <div class="info-row">
              <span>Сезон</span>
              <strong>{{ matchDetails.season || '—' }}</strong>
            </div>

            <div class="info-row">
              <span>Стадия</span>
              <strong>{{ matchDetails.stageName || '—' }}</strong>
            </div>

            <div class="info-row">
              <span>Локация</span>
              <strong>{{ matchDetails.location || '—' }}</strong>
            </div>

            <div class="info-row">
              <span>Арена</span>
              <strong>{{ matchDetails.arena.name || '—' }}</strong>
            </div>

            <div class="info-row">
              <span>Вместимость</span>
              <strong>{{ matchDetails.arena.capacity || '—' }}</strong>
            </div>

            <div class="info-row">
              <span>Главные судьи</span>
              <strong>{{ matchDetails.referees.main.join(', ') || '—' }}</strong>
            </div>

            <div class="info-row">
              <span>Лайнсмены</span>
              <strong>{{ matchDetails.referees.linesmen.join(', ') || '—' }}</strong>
            </div>

            <div class="info-row">
              <span>Комментаторы</span>
              <strong>{{ matchDetails.commentatorsNames || '—' }}</strong>
            </div>
          </div>
        </section>

        <section class="match-card match-card--full">
          <h3 class="match-card__title">Сравнение команд</h3>

          <div class="stats-compare">
            <div
                v-for="item in statsComparison"
                :key="item.label"
                class="stats-compare__row"
            >
              <div class="stats-compare__value stats-compare__value--left">
                {{ item.teamA }}
              </div>

              <div class="stats-compare__label">
                {{ item.label }}
              </div>

              <div class="stats-compare__value stats-compare__value--right">
                {{ item.teamB }}
              </div>
            </div>
          </div>
        </section>

        <section class="match-card">
          <h3 class="match-card__title">
            Стартовая пятёрка {{ matchDetails.teamA?.name || '' }}
          </h3>

          <div class="simple-list">
            <p
                v-for="player in matchDetails.teamA?.startFives || []"
                :key="`a-start-${player.id}`"
            >
              #{{ player.shirtNumber }} {{ player.name }}
            </p>

            <p v-if="!(matchDetails.teamA?.startFives?.length)">Нет данных</p>
          </div>
        </section>

        <section class="match-card">
          <h3 class="match-card__title">
            Стартовая пятёрка {{ matchDetails.teamB?.name || '' }}
          </h3>

          <div class="simple-list">
            <p
                v-for="player in matchDetails.teamB?.startFives || []"
                :key="`b-start-${player.id}`"
            >
              #{{ player.shirtNumber }} {{ player.name }}
            </p>

            <p v-if="!(matchDetails.teamB?.startFives?.length)">Нет данных</p>
          </div>
        </section>

        <section class="match-card">
          <h3 class="match-card__title">
            Топ-игроки {{ matchDetails.teamA?.name || '' }}
          </h3>

          <div class="top-players">
            <article
                v-for="item in matchDetails.teamA?.topPlayers || []"
                :key="`a-top-${item.id}-${item.player?.id}`"
                class="top-player"
            >
              <div class="top-player__name">{{ item.name }}</div>
              <div class="top-player__player">
                {{ item.player ? `#${item.player.shirtNumber} ${item.player.name}` : '—' }}
              </div>
              <div class="top-player__value">{{ item.value || '—' }}</div>
            </article>

            <p v-if="!(matchDetails.teamA?.topPlayers?.length)">Нет данных</p>
          </div>
        </section>

        <section class="match-card">
          <h3 class="match-card__title">
            Топ-игроки {{ matchDetails.teamB?.name || '' }}
          </h3>

          <div class="top-players">
            <article
                v-for="item in matchDetails.teamB?.topPlayers || []"
                :key="`b-top-${item.id}-${item.player?.id}`"
                class="top-player"
            >
              <div class="top-player__name">{{ item.name }}</div>
              <div class="top-player__player">
                {{ item.player ? `#${item.player.shirtNumber} ${item.player.name}` : '—' }}
              </div>
              <div class="top-player__value">{{ item.value || '—' }}</div>
            </article>

            <p v-if="!(matchDetails.teamB?.topPlayers?.length)">Нет данных</p>
          </div>
        </section>

        <section class="match-card match-card--full">
          <h3 class="match-card__title">Голы</h3>

          <div v-if="matchDetails.goals.length" class="timeline">
            <article
                v-for="(goal, index) in matchDetails.goals"
                :key="`goal-${index}-${goal.time}-${goal.author.name}`"
                class="timeline-item"
                :class="goal.author.teamId === matchDetails.teamA?.id ? 'timeline-item--a' : 'timeline-item--b'"
            >
              <div class="timeline-item__head">
                <span>{{ goal.period }} период</span>
                <span>{{ formatMatchMinute(goal.time) }}</span>
                <span>{{ goal.score }}</span>
              </div>

              <div class="timeline-item__title">
                {{ getTeamNameById(goal.author.teamId) }}
              </div>

              <p class="timeline-item__text">
                Гол: #{{ goal.author.shirtNumber }} {{ goal.author.name }}
              </p>

              <p v-if="goal.assistants.length" class="timeline-item__text">
                Передачи:
                {{
                  goal.assistants
                      .map((assistant) => `#${assistant.shirtNumber} ${assistant.name}`)
                      .join(', ')
                }}
              </p>
            </article>
          </div>

          <p v-else class="empty-text">Нет данных о голах</p>
        </section>

        <section class="match-card match-card--full">
          <h3 class="match-card__title">Удаления</h3>

          <div v-if="matchDetails.violations.length" class="timeline">
            <article
                v-for="(item, index) in matchDetails.violations"
                :key="`violation-${index}-${item.time}-${item.violator.name}`"
                class="timeline-item"
                :class="item.violator.teamId === matchDetails.teamA?.id ? 'timeline-item--a' : 'timeline-item--b'"
            >
              <div class="timeline-item__head">
                <span>{{ item.period }} период</span>
                <span>{{ formatMatchMinute(item.time) }}</span>
                <span>{{ item.penaltyTime }} мин</span>
              </div>

              <div class="timeline-item__title">
                {{ getTeamNameById(item.violator.teamId) }}
              </div>

              <p class="timeline-item__text">
                #{{ item.violator.shirtNumber }} {{ item.violator.name }}
              </p>

              <p class="timeline-item__text">
                {{ item.penaltyReason || 'Нарушение' }}
              </p>
            </article>
          </div>

          <p v-else class="empty-text">Нет данных об удалениях</p>
        </section>

        <section class="match-card match-card--full">
          <h3 class="match-card__title">Составы команд</h3>

          <div class="rosters-grid">
            <div class="roster-column">
              <h4>{{ matchDetails.teamA?.name || 'Команда 1' }}</h4>

              <div class="roster-group">
                <h5>Вратари</h5>
                <p
                    v-for="player in matchDetails.teamA?.roster.goalkeepers || []"
                    :key="`a-goalie-${player.id}`"
                >
                  #{{ player.shirtNumber }} {{ player.name }}
                </p>
                <p v-if="!(matchDetails.teamA?.roster.goalkeepers?.length)">Нет данных</p>
              </div>

              <div class="roster-group">
                <h5>Защитники</h5>
                <p
                    v-for="player in matchDetails.teamA?.roster.defensemen || []"
                    :key="`a-def-${player.id}`"
                >
                  #{{ player.shirtNumber }} {{ player.name }}
                </p>
                <p v-if="!(matchDetails.teamA?.roster.defensemen?.length)">Нет данных</p>
              </div>

              <div class="roster-group">
                <h5>Нападающие</h5>
                <p
                    v-for="player in matchDetails.teamA?.roster.forwards || []"
                    :key="`a-for-${player.id}`"
                >
                  #{{ player.shirtNumber }} {{ player.name }}
                </p>
                <p v-if="!(matchDetails.teamA?.roster.forwards?.length)">Нет данных</p>
              </div>
            </div>

            <div class="roster-column">
              <h4>{{ matchDetails.teamB?.name || 'Команда 2' }}</h4>

              <div class="roster-group">
                <h5>Вратари</h5>
                <p
                    v-for="player in matchDetails.teamB?.roster.goalkeepers || []"
                    :key="`b-goalie-${player.id}`"
                >
                  #{{ player.shirtNumber }} {{ player.name }}
                </p>
                <p v-if="!(matchDetails.teamB?.roster.goalkeepers?.length)">Нет данных</p>
              </div>

              <div class="roster-group">
                <h5>Защитники</h5>
                <p
                    v-for="player in matchDetails.teamB?.roster.defensemen || []"
                    :key="`b-def-${player.id}`"
                >
                  #{{ player.shirtNumber }} {{ player.name }}
                </p>
                <p v-if="!(matchDetails.teamB?.roster.defensemen?.length)">Нет данных</p>
              </div>

              <div class="roster-group">
                <h5>Нападающие</h5>
                <p
                    v-for="player in matchDetails.teamB?.roster.forwards || []"
                    :key="`b-for-${player.id}`"
                >
                  #{{ player.shirtNumber }} {{ player.name }}
                </p>
                <p v-if="!(matchDetails.teamB?.roster.forwards?.length)">Нет данных</p>
              </div>
            </div>
          </div>
        </section>

        <section class="match-card">
          <h3 class="match-card__title">Очные встречи</h3>

          <div class="h2h-grid">
            <div class="h2h-team">
              <h4>{{ matchDetails.teamA?.name || 'Команда 1' }}</h4>
              <p>Победы: {{ matchDetails.headToHead.teamA.wins }}</p>
              <p>Голы: {{ matchDetails.headToHead.teamA.goals }}</p>
              <p>Очки: {{ matchDetails.headToHead.teamA.points }}</p>
            </div>

            <div class="h2h-team">
              <h4>{{ matchDetails.teamB?.name || 'Команда 2' }}</h4>
              <p>Победы: {{ matchDetails.headToHead.teamB.wins }}</p>
              <p>Голы: {{ matchDetails.headToHead.teamB.goals }}</p>
              <p>Очки: {{ matchDetails.headToHead.teamB.points }}</p>
            </div>
          </div>

          <div class="h2h-total">
            Всего матчей: {{ matchDetails.headToHead.totalGames }}
          </div>
        </section>

        <section class="match-card">
          <h3 class="match-card__title">Краткая сводка</h3>

          <div class="summary-list">
            <div class="summary-row">
              <span>Броски</span>
              <strong>{{ matchDetails.teamA?.shots || 0 }} / {{ matchDetails.teamB?.shots || 0 }}</strong>
            </div>

            <div class="summary-row">
              <span>Штрафные минуты</span>
              <strong>{{ matchDetails.teamA?.penaltyMinutes || 0 }} / {{ matchDetails.teamB?.penaltyMinutes || 0 }}</strong>
            </div>

            <div class="summary-row">
              <span>Владение шайбой</span>
              <strong>{{ formatSeconds(matchDetails.teamA?.puckControlTime) }} / {{ formatSeconds(matchDetails.teamB?.puckControlTime) }}</strong>
            </div>

            <div class="summary-row">
              <span>Дистанция</span>
              <strong>{{ formatDistance(matchDetails.teamA?.distanceTravelled) }} / {{ formatDistance(matchDetails.teamB?.distanceTravelled) }}</strong>
            </div>
          </div>
        </section>

        <section class="match-card match-card--full">
          <h3 class="match-card__title">Текстовая лента</h3>

          <div v-if="matchDetails.textEvents.length" class="feed">
            <article
                v-for="(entry, index) in matchDetails.textEvents"
                :key="`text-event-${index}-${entry.seconds}`"
                class="feed-item"
            >
              <div class="feed-item__meta">
                <span>{{ entry.period ? `${entry.period} период` : 'Матч' }}</span>
                <span>{{ entry.time || '—' }}</span>
                <span>{{ entry.type || 'event' }}</span>
                <span v-if="entry.score">{{ entry.score }}</span>
              </div>

              <p class="feed-item__text">
                {{ entry.text || '—' }}
              </p>
            </article>
          </div>

          <p v-else class="empty-text">Нет текстовых событий</p>
        </section>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { hockey} from "../store/hockey.ts";

const route = useRoute()
const hockeyStore = hockey()

const {
  matchDetails,
  matchDetailsLoading,
  matchDetailsError,
} = storeToRefs(hockeyStore)

const matchId = computed(() => String(route.params.id || ''))

const formattedScore = computed(() => {
  return matchDetails.value?.score || '— : —'
})

const formattedStartAt = computed(() => {
  if (!matchDetails.value?.startAt) {
    return '—'
  }

  return new Date(matchDetails.value.startAt).toLocaleString('ru-RU', {
    day: '2-digit',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  })
})

const arenaLabel = computed(() => {
  const arena = matchDetails.value?.arena

  if (!arena) {
    return '—'
  }

  const parts = [arena.name, arena.city].filter(Boolean)

  return parts.length ? parts.join(', ') : '—'
})

const matchStatusLabel = computed(() => {
  const state = String(matchDetails.value?.gameStateKey || '').toLowerCase()

  switch (state) {
    case 'finished':
      return 'Матч завершён'
    case 'in_progress':
      return 'Матч идёт'
    case 'not_yet_started':
      return 'Матч ещё не начался'
    default:
      return matchDetails.value?.gameStateKey || 'Статус неизвестен'
  }
})

const periodItems = computed(() => {
  const periods = matchDetails.value?.scoresByPeriods

  if (!periods) {
    return []
  }

  return [
    { label: '1 период', value: periods.firstPeriod },
    { label: '2 период', value: periods.secondPeriod },
    { label: '3 период', value: periods.thirdPeriod },
    { label: 'ОТ', value: periods.overtime },
    { label: 'Буллиты', value: periods.shootout },
  ]
})

const statsComparison = computed(() => {
  const teamA = matchDetails.value?.teamA
  const teamB = matchDetails.value?.teamB

  return [
    {
      label: 'Броски',
      teamA: teamA?.shots ?? 0,
      teamB: teamB?.shots ?? 0,
    },
    {
      label: 'Голы',
      teamA: teamA?.goals ?? 0,
      teamB: teamB?.goals ?? 0,
    },
    {
      label: 'Power play голы',
      teamA: teamA?.powerPlayGoals ?? 0,
      teamB: teamB?.powerPlayGoals ?? 0,
    },
    {
      label: 'Power play попытки',
      teamA: teamA?.powerPlayChances ?? 0,
      teamB: teamB?.powerPlayChances ?? 0,
    },
    {
      label: 'Штрафные минуты',
      teamA: teamA?.penaltyMinutes ?? 0,
      teamB: teamB?.penaltyMinutes ?? 0,
    },
    {
      label: 'Владение шайбой',
      teamA: formatSeconds(teamA?.puckControlTime),
      teamB: formatSeconds(teamB?.puckControlTime),
    },
    {
      label: 'Дистанция',
      teamA: formatDistance(teamA?.distanceTravelled),
      teamB: formatDistance(teamB?.distanceTravelled),
    },
    {
      label: 'Входы в зону',
      teamA: teamA?.offensiveBlueLineCrossings ?? 0,
      teamB: teamB?.offensiveBlueLineCrossings ?? 0,
    },
  ]
})

function formatSeconds(value?: number | null) {
  if (!value) {
    return '0:00'
  }

  const minutes = Math.floor(value / 60)
  const seconds = value % 60

  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

function formatDistance(value?: number | null) {
  if (!value) {
    return '0 м'
  }

  return `${value.toLocaleString('ru-RU')} м`
}

function formatMatchMinute(value?: number | null) {
  if (value == null) {
    return '—'
  }

  return `${value}'`
}

function getTeamNameById(teamId?: number | null) {
  if (!teamId) {
    return 'Команда'
  }

  if (teamId === matchDetails.value?.teamA?.id) {
    return matchDetails.value.teamA.name
  }

  if (teamId === matchDetails.value?.teamB?.id) {
    return matchDetails.value.teamB.name
  }

  return 'Команда'
}

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
</script>

<style scoped lang="scss">
.match-page {
  min-height: 100%;
  padding: 24px;
  color: #ffffff;
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

.match-hero {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 20px;
  padding: 24px;
  border-radius: 28px;
  background: linear-gradient(180deg, rgba(13, 18, 35, 0.92), rgba(18, 25, 48, 0.95));
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.match-hero__team {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.match-hero__team--right {
  justify-content: flex-end;
  text-align: right;
}

.match-hero__logo {
  width: 72px;
  height: 72px;
  object-fit: contain;
  flex-shrink: 0;
}

.match-hero__team-meta {
  min-width: 0;
}

.match-hero__team-meta h2 {
  margin: 0 0 6px;
  font-size: 24px;
  font-weight: 800;
  line-height: 1.1;
}

.match-hero__team-meta p {
  margin: 0;
  color: rgba(255, 255, 255, 0.64);
  font-size: 14px;
}

.match-hero__center {
  display: grid;
  justify-items: center;
  gap: 10px;
  min-width: 220px;
}

.match-hero__status {
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.16);
  color: #93c5fd;
  font-size: 13px;
  font-weight: 700;
}

.match-hero__score {
  font-size: 56px;
  font-weight: 900;
  line-height: 1;
  white-space: nowrap;
}

.match-hero__meta,
.match-hero__arena {
  color: rgba(255, 255, 255, 0.68);
  font-size: 14px;
  text-align: center;
}

.match-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.match-card {
  display: grid;
  gap: 16px;
  padding: 20px;
  border-radius: 24px;
  background: linear-gradient(180deg, rgba(13, 18, 35, 0.92), rgba(18, 25, 48, 0.95));
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.match-card--full {
  grid-column: 1 / -1;
}

.match-card__title {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
}

.periods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 12px;
}

.period-item {
  display: grid;
  gap: 6px;
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
}

.period-item__label {
  color: rgba(255, 255, 255, 0.62);
  font-size: 13px;
}

.period-item__value {
  font-size: 22px;
  font-weight: 800;
}

.info-list,
.summary-list {
  display: grid;
  gap: 12px;
}

.info-row,
.summary-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.info-row span,
.summary-row span {
  color: rgba(255, 255, 255, 0.64);
}

.stats-compare {
  display: grid;
  gap: 12px;
}

.stats-compare__row {
  display: grid;
  grid-template-columns: 1fr 220px 1fr;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
}

.stats-compare__label {
  text-align: center;
  color: rgba(255, 255, 255, 0.72);
  font-weight: 600;
}

.stats-compare__value {
  font-size: 18px;
  font-weight: 800;
}

.stats-compare__value--left {
  text-align: left;
}

.stats-compare__value--right {
  text-align: right;
}

.simple-list,
.top-players,
.timeline,
.feed {
  display: grid;
  gap: 12px;
}

.simple-list p,
.roster-group p,
.h2h-team p,
.empty-text {
  margin: 0;
}

.top-player,
.timeline-item,
.feed-item {
  display: grid;
  gap: 8px;
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
}

.top-player__name {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.62);
}

.top-player__player {
  font-size: 16px;
  font-weight: 700;
}

.top-player__value {
  font-size: 14px;
  color: #93c5fd;
  font-weight: 700;
}

.timeline-item {
  border-left: 4px solid transparent;
}

.timeline-item--a {
  border-left-color: #60a5fa;
}

.timeline-item--b {
  border-left-color: #f87171;
}

.timeline-item__head,
.feed-item__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  color: rgba(255, 255, 255, 0.58);
  font-size: 12px;
}

.timeline-item__title {
  font-size: 16px;
  font-weight: 800;
}

.timeline-item__text,
.feed-item__text {
  margin: 0;
  line-height: 1.45;
}

.rosters-grid,
.h2h-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.roster-column,
.roster-group,
.h2h-team {
  display: grid;
  gap: 10px;
}

.roster-column h4,
.h2h-team h4,
.roster-group h5 {
  margin: 0;
}

.roster-group {
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
}

.h2h-total {
  padding-top: 8px;
  color: rgba(255, 255, 255, 0.68);
  font-weight: 600;
}

@media (max-width: 980px) {
  .match-hero {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
  }

  .match-hero__team,
  .match-hero__team--right {
    justify-content: center;
    text-align: center;
  }

  .match-grid,
  .rosters-grid,
  .h2h-grid {
    grid-template-columns: 1fr;
  }

  .stats-compare__row {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .stats-compare__value--left,
  .stats-compare__value--right {
    text-align: center;
  }
}

@media (max-width: 640px) {
  .match-page {
    padding: 16px;
  }

  .match-hero {
    padding: 18px;
  }

  .match-card {
    padding: 16px;
  }

  .match-hero__score {
    font-size: 42px;
  }

  .match-hero__team-meta h2 {
    font-size: 20px;
  }
}
</style>