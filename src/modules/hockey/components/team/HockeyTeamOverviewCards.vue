<script setup lang="ts">
import { RouterLink } from 'vue-router'

type MatchTeam = {
  name?: string
}

type MatchItem = {
  id: number
  teamA?: MatchTeam | null
  teamB?: MatchTeam | null
  startAt?: number | null
  stageName?: string
}

type Arena = {
  name?: string
  city?: string
  address?: string
  capacity?: number
  website?: string
}

type HeadCoach = {
  name?: string
  photo?: string
}

defineProps<{
  nextMatch?: MatchItem | null
  arena?: Arena | null
  headCoach?: HeadCoach | null
}>()

const formatMatchDate = (timestamp?: number | null) => {
  if (!timestamp) return 'Дата неизвестна'

  return new Date(timestamp).toLocaleString('ru-RU', {
    day: '2-digit',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="overview-grid">
    <section class="panel panel--accent">
      <p class="panel__label">Ближайший матч</p>

      <template v-if="nextMatch">
        <h2 class="panel__title">
          {{ nextMatch.teamA?.name }} — {{ nextMatch.teamB?.name }}
        </h2>

        <p class="panel__text">
          {{ formatMatchDate(nextMatch.startAt) }}
        </p>

        <p
            v-if="nextMatch.stageName"
            class="panel__muted"
        >
          {{ nextMatch.stageName }}
        </p>

        <RouterLink
            :to="`/hockey/${nextMatch.id}`"
            class="panel__link"
        >
          Открыть матч
        </RouterLink>
      </template>

      <p
          v-else
          class="panel__text"
      >
        Нет ближайших матчей
      </p>
    </section>

    <section class="panel">
      <p class="panel__label">Арена</p>

      <template v-if="arena">
        <h2 class="panel__title">{{ arena.name }}</h2>
        <p class="panel__text">{{ arena.city }}</p>
        <p
            v-if="arena.address"
            class="panel__muted"
        >
          {{ arena.address }}
        </p>
        <p
            v-if="arena.capacity"
            class="panel__muted"
        >
          Вместимость: {{ arena.capacity }}
        </p>

        <a
            v-if="arena.website"
            :href="arena.website"
            target="_blank"
            rel="noopener noreferrer"
            class="panel__link"
        >
          Сайт арены
        </a>
      </template>

      <p
          v-else
          class="panel__text"
      >
        Нет информации об арене
      </p>
    </section>

    <section class="panel">
      <p class="panel__label">Главный тренер</p>

      <div
          v-if="headCoach?.name"
          class="coach-card"
      >
        <img
            v-if="headCoach.photo"
            :src="headCoach.photo"
            :alt="headCoach.name"
            class="coach-card__photo"
        >

        <div>
          <h2 class="panel__title">{{ headCoach.name }}</h2>
          <p class="panel__muted">Главный тренер</p>
        </div>
      </div>

      <p
          v-else
          class="panel__text"
      >
        Нет данных о тренере
      </p>
    </section>
  </div>
</template>

<style scoped lang="scss">
.overview-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  gap: 18px;
}

.panel {
  display: grid;
  align-content: start;
  gap: 14px;
  padding: 22px;
  border-radius: 24px;
  background: rgba(13, 18, 35, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.panel--accent {
  border-color: var(--team-color-32);
  background:
      linear-gradient(
              180deg,
              var(--team-color-12) 0%,
              rgba(13, 18, 35, 0.82) 65%,
              rgba(13, 18, 35, 0.82) 100%
      );
}

.panel__label {
  margin: 0;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.56);
}

.panel__title {
  margin: 0;
  font-size: 22px;
  color: #fff;
}

.panel__text {
  margin: 0;
  color: rgba(255, 255, 255, 0.82);
}

.panel__muted {
  margin: -4px 0 0;
  color: rgba(255, 255, 255, 0.58);
  font-size: 14px;
}

.panel__link {
  margin-top: auto;
  display: inline-flex;
  width: fit-content;
  color: var(--team-color);
  text-decoration: none;
  font-weight: 600;
}

.coach-card {
  display: flex;
  align-items: center;
  gap: 14px;
}

.coach-card__photo {
  width: 78px;
  height: 78px;
  object-fit: cover;
  border-radius: 20px;
}

@media (max-width: 1180px) {
  .overview-grid {
    grid-template-columns: 1fr;
  }
}
</style>