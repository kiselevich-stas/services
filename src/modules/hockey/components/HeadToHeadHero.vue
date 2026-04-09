<script setup lang="ts">
import type { HockeyHeadToHeadSummary } from '../types'
import { formatDateTime, formatTeamTitle } from '../utils/h2h'

const props = defineProps<{
  summary: HockeyHeadToHeadSummary
}>()

function getShare(value: number, total: number): string {
  if (!total) {
    return '0%'
  }

  return `${Math.round((value / total) * 100)}%`
}
</script>

<template>
  <section class="panel h2h-hero">
    <div class="h2h-hero__teams">
      <div class="h2h-hero__team">
        <img :src="summary.teams.teamA.image" :alt="summary.teams.teamA.name" class="h2h-hero__logo" />
        <div>
          <div class="h2h-hero__team-name">{{ formatTeamTitle(summary.teams.teamA) }}</div>
          <div class="h2h-hero__team-share">{{ getShare(summary.total.teamAWins, summary.total.totalGames) }} побед</div>
        </div>
      </div>

      <div class="h2h-hero__vs">VS</div>

      <div class="h2h-hero__team h2h-hero__team--right">
        <div>
          <div class="h2h-hero__team-name">{{ formatTeamTitle(summary.teams.teamB) }}</div>
          <div class="h2h-hero__team-share">{{ getShare(summary.total.teamBWins, summary.total.totalGames) }} побед</div>
        </div>
        <img :src="summary.teams.teamB.image" :alt="summary.teams.teamB.name" class="h2h-hero__logo" />
      </div>
    </div>

    <div class="h2h-hero__meta">
      <div class="metric-box">
        <span>Матчей в выбранной стадии</span>
        <strong>{{ summary.total.totalGames }}</strong>
      </div>
      <div class="metric-box">
        <span>{{ summary.teams.teamA.name }} · шайбы</span>
        <strong>{{ summary.total.teamAGoals }}</strong>
      </div>
      <div class="metric-box">
        <span>{{ summary.teams.teamB.name }} · шайбы</span>
        <strong>{{ summary.total.teamBGoals }}</strong>
      </div>
      <div class="metric-box" v-if="summary.allTimePairStat">
        <span>Личные встречи за всё время</span>
        <strong>{{ summary.allTimePairStat.eventsCount }}</strong>
      </div>
    </div>

    <div class="h2h-hero__stage">
      <span>Стадия:</span>
      <strong>{{ summary.stage?.title || 'Неизвестно' }}</strong>
      <span class="h2h-hero__divider">•</span>
      <span>{{ summary.stage?.season || '—' }}</span>
    </div>

    <div v-if="summary.recentGames[0]" class="h2h-hero__latest">
      Последний матч: {{ formatDateTime(summary.recentGames[0].startAt) }} · {{ summary.recentGames[0].score }}
    </div>
  </section>
</template>

<style scoped lang="scss">
.h2h-hero {
  display: grid;
  gap: 20px;
  background:
    radial-gradient(circle at left top, rgba(56, 189, 248, 0.18), transparent 28%),
    radial-gradient(circle at right bottom, rgba(139, 92, 246, 0.18), transparent 30%),
    rgba(255, 255, 255, 0.04);
}

.h2h-hero__teams {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 16px;
  align-items: center;
}

.h2h-hero__team {
  display: flex;
  align-items: center;
  gap: 16px;
}

.h2h-hero__team--right {
  justify-content: flex-end;
  text-align: right;
}

.h2h-hero__logo {
  width: 68px;
  height: 68px;
  object-fit: contain;
}

.h2h-hero__team-name {
  font-size: 22px;
  font-weight: 700;
}

.h2h-hero__team-share {
  margin-top: 6px;
  color: rgba(246, 248, 255, 0.7);
}

.h2h-hero__vs {
  font-size: 18px;
  font-weight: 800;
  opacity: 0.55;
}

.h2h-hero__meta {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.h2h-hero__stage,
.h2h-hero__latest {
  color: rgba(246, 248, 255, 0.76);
}

.h2h-hero__divider {
  opacity: 0.45;
}

@media (max-width: 980px) {
  .h2h-hero__teams {
    grid-template-columns: 1fr;
  }

  .h2h-hero__team,
  .h2h-hero__team--right {
    justify-content: flex-start;
    text-align: left;
  }

  .h2h-hero__vs {
    display: none;
  }

  .h2h-hero__meta {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 680px) {
  .h2h-hero__meta {
    grid-template-columns: 1fr;
  }
}
</style>
