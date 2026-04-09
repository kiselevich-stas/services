<template>
  <article class="match-card">
    <div class="match-card__top">
      <p class="match-card__stage">
        {{ match.stageName || 'Текущий этап' }}
      </p>

      <p class="match-card__date">
        {{ formatMatchDate(match.startAt) }}
      </p>
    </div>

    <div class="match-card__body">
      <div class="match-team">
        <img
            v-if="match.teamA.image"
            :src="match.teamA.image"
            :alt="match.teamA.name"
            class="match-team__logo"
        />

        <div>
          <p class="match-team__name">{{ match.teamA.name }}</p>
          <p class="match-team__location">{{ match.teamA.location || '—' }}</p>
        </div>
      </div>

      <div class="match-card__vs">VS</div>

      <div class="match-team match-team--right">
        <img
            v-if="match.teamB.image"
            :src="match.teamB.image"
            :alt="match.teamB.name"
            class="match-team__logo"
        />

        <div>
          <p class="match-team__name">{{ match.teamB.name }}</p>
          <p class="match-team__location">{{ match.teamB.location || '—' }}</p>
        </div>
      </div>
    </div>

    <div class="match-card__bottom">
      <p class="match-card__status">
        {{ match.gameState || 'Запланирован' }}
      </p>

      <p class="match-card__time">
        {{ formatMatchTime(match.startAt) }}
      </p>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { HockeyUpcomingMatch } from '../types'
import { formatMatchDate, formatMatchTime } from '../utils/formatters'

defineProps<{
  match: HockeyUpcomingMatch
}>()
</script>

<style scoped lang="scss">
.match-card {
  display: grid;
  gap: 18px;
  padding: 20px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(13, 18, 35, 0.82);
}

.match-card__top,
.match-card__bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.match-card__stage {
  color: #f472b6;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.match-card__date,
.match-card__time,
.match-card__status,
.match-team__location {
  color: rgba(255, 255, 255, 0.68);
}

.match-card__body {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 12px;
  align-items: center;
}

.match-card__vs {
  font-size: 14px;
  font-weight: 700;
  color: #a78bfa;
}

.match-team {
  display: flex;
  align-items: center;
  gap: 12px;
}

.match-team--right {
  justify-content: flex-end;
  text-align: right;
}

.match-team__logo {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  background: rgba(255, 255, 255, 0.04);
}

.match-team__name {
  font-weight: 600;
}
</style>