<template>
  <article v-if="match" class="live-card">
    <div class="live-card__top">
      <div class="live-card__badge">
        <span class="live-card__dot" />
        LIVE
      </div>

      <span v-if="match.stageName" class="live-card__stage">
        {{ match.stageName }}
      </span>
    </div>

    <div class="live-card__teams">
      <div class="live-card__team">
        <img
            v-if="match.teamA?.image"
            :src="match.teamA.image"
            :alt="match.teamA?.name || 'team-a'"
            class="live-card__logo"
        />
        <span class="live-card__team-name">
          {{ match.teamA?.name || 'Команда 1' }}
        </span>
      </div>

      <div class="live-card__score-wrap">
        <div class="live-card__score">
          {{ formattedScore }}
        </div>
        <div class="live-card__status">
          {{ liveStatusLabel }}
        </div>
      </div>

      <div class="live-card__team live-card__team--right">
        <img
            v-if="match.teamB?.image"
            :src="match.teamB.image"
            :alt="match.teamB?.name || 'team-b'"
            class="live-card__logo"
        />
        <span class="live-card__team-name">
          {{ match.teamB?.name || 'Команда 2' }}
        </span>
      </div>
    </div>

    <div class="live-card__bottom">
      <span>{{ match.location || '—' }}</span>
      <span v-if="match.startAt">{{ formattedStartAt }}</span>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import type { HockeyMatch } from '../types'

const props = defineProps<{
  match: HockeyMatch
}>()

const match = toRef(props, 'match')

const formattedScore = computed(() => {
  return match.value?.score || '— : —'
})

const formattedStartAt = computed(() => {
  if (!match.value?.startAt) {
    return '—'
  }

  return new Date(match.value.startAt).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
})

const liveStatusLabel = computed(() => {
  const state = String(match.value?.gameStateKey || '').toLowerCase()

  if (state === 'in_progress') {
    return 'Матч идёт'
  }

  return match.value?.gameStateKey || 'В эфире'
})
</script>

<style scoped lang="scss">
.live-card {
  display: grid;
  gap: 14px;
  padding: 16px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(180deg, rgba(13, 18, 35, 0.9), rgba(18, 25, 48, 0.95));
}

.live-card__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.live-card__badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(239, 68, 68, 0.16);
  color: #fca5a5;
  font-size: 12px;
  font-weight: 700;
}

.live-card__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #ef4444;
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.8);
}

.live-card__stage {
  color: rgba(255, 255, 255, 0.68);
  font-size: 12px;
  text-align: right;
}

.live-card__teams {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 12px;
  align-items: center;
}

.live-card__team {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.live-card__team--right {
  justify-content: flex-end;
}

.live-card__logo {
  width: 34px;
  height: 34px;
  object-fit: contain;
  flex-shrink: 0;
}

.live-card__team-name {
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
}

.live-card__score-wrap {
  display: grid;
  justify-items: center;
  gap: 6px;
  min-width: 96px;
}

.live-card__score {
  font-size: 28px;
  font-weight: 800;
  line-height: 1;
  white-space: nowrap;
}

.live-card__status {
  padding: 4px 8px;
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.14);
  color: #93c5fd;
  font-size: 12px;
  font-weight: 600;
}

.live-card__bottom {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  color: rgba(255, 255, 255, 0.62);
  font-size: 12px;
}

@media (max-width: 700px) {
  .live-card__teams {
    grid-template-columns: 1fr;
    justify-items: center;
  }

  .live-card__team,
  .live-card__team--right {
    justify-content: center;
  }

  .live-card__bottom {
    flex-direction: column;
    align-items: center;
  }

  .live-card__top {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>