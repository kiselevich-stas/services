<script setup lang="ts">
import { RouterLink } from 'vue-router'

type MatchTeam = {
  name?: string
  image?: string | null
}

type MatchItem = {
  id: number
  teamA?: MatchTeam | null
  teamB?: MatchTeam | null
  startAt?: number | string | null
  stageName?: string | null
  score?: string | null
}

const props = defineProps<{
  title: string
  matches: MatchItem[]
  emptyText: string
  isLoading?: boolean
}>()

const sectionSubtitle = {
  'Последние игры': 'Недавние результаты команды.',
  'Будущие игры': 'Ближайшие встречи и расписание.',
}

const formatMatchDate = (value?: number | string | null) => {
  if (!value) return 'Дата неизвестна'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Дата неизвестна'
  }

  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <section class="section-card">
    <div class="section-card__top">
      <div>
        <p class="section-card__eyebrow">Schedule</p>
        <h2 class="section-card__title">{{ title }}</h2>
        <p class="section-card__subtitle">
          {{ sectionSubtitle[title as keyof typeof sectionSubtitle] || 'Список матчей команды.' }}
        </p>
      </div>

    </div>

    <div
        v-if="isLoading"
        class="upcoming-grid"
    >
      <div
          v-for="index in 3"
          :key="index"
          class="upcoming-card upcoming-card--skeleton"
      />
    </div>

    <div
        v-else-if="!matches.length"
        class="info-state"
    >
      {{ emptyText }}
    </div>

    <div
        v-else
        class="upcoming-grid"
    >
      <RouterLink
          v-for="match in matches"
          :key="`match-${match.id}`"
          :to="`/hockey/${match.id}`"
          class="upcoming-card"
      >
        <div class="upcoming-card__top">
          <span>{{ match.stageName || 'Текущий этап' }}</span>
          <span>{{ formatMatchDate(match.startAt) }}</span>
        </div>

        <div class="upcoming-card__body">
          <div class="upcoming-team">
            <img
                v-if="match.teamA?.image"
                :src="match.teamA.image"
                :alt="match.teamA?.name"
                class="upcoming-team__logo"
            >
            <span>{{ match.teamA?.name || 'Команда 1' }}</span>
          </div>

          <div class="upcoming-card__vs">
            {{ match.score || 'VS' }}
          </div>

          <div class="upcoming-team upcoming-team--right">
            <img
                v-if="match.teamB?.image"
                :src="match.teamB.image"
                :alt="match.teamB?.name"
                class="upcoming-team__logo"
            >
            <span>{{ match.teamB?.name || 'Команда 2' }}</span>
          </div>
        </div>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped lang="scss">
.section-card {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 28px;
  background:
      radial-gradient(circle at top right, var(--team-color-12), transparent 30%),
      rgba(13, 18, 35, 0.86);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
}

.section-card__top {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
}

.section-card__eyebrow {
  margin: 0 0 10px;
  color: var(--team-color);
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.14em;
}

.section-card__title {
  margin: 0;
  font-size: 28px;
  color: #fff;
}

.section-card__subtitle {
  margin: 12px 0 0;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.6;
}

.section-card__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 0 16px;
  border-radius: 12px;
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  text-decoration: none;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.section-card__link:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--team-color-24);
}

.info-state {
  padding: 18px;
  border-radius: 18px;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.03);
}

.upcoming-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.upcoming-card {
  display: grid;
  gap: 18px;
  padding: 18px;
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  text-decoration: none;
  color: #fff;
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.upcoming-card:hover {
  transform: translateY(-2px);
  border-color: var(--team-color-24);
  background: var(--team-color-08);
}

.upcoming-card--skeleton {
  min-height: 150px;
  position: relative;
  overflow: hidden;
}

.upcoming-card--skeleton::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.12), transparent);
  animation: shimmer 1.4s infinite;
}

.upcoming-card__top {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  color: rgba(255, 255, 255, 0.66);
  font-size: 12px;
}

.upcoming-card__body {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 10px;
  align-items: center;
}

.upcoming-team {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.upcoming-team span {
  font-weight: 600;
  line-height: 1.4;
}

.upcoming-team--right {
  justify-content: flex-end;
  text-align: right;
}

.upcoming-team__logo {
  width: 36px;
  height: 36px;
  object-fit: contain;
  flex-shrink: 0;
}

.upcoming-card__vs {
  color: var(--team-color);
  font-weight: 700;
  font-size: 14px;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

@media (max-width: 768px) {
  .section-card {
    padding: 18px;
  }

  .section-card__top {
    flex-direction: column;
    align-items: stretch;
  }

  .section-card__title {
    font-size: 24px;
  }

  .upcoming-card__body {
    grid-template-columns: 1fr;
  }

  .upcoming-team,
  .upcoming-team--right {
    justify-content: center;
    text-align: center;
  }
}
</style>