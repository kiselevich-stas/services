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
  score?: string
}

defineProps<{
  title: string
  matches: MatchItem[]
  emptyText: string
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
  <section class="panel">
    <div class="section-head">
      <div>
        <p class="section-head__eyebrow">Матчи</p>
        <h2 class="section-head__title">{{ title }}</h2>
      </div>
    </div>

    <ul
        v-if="matches.length"
        class="match-list"
    >
      <li
          v-for="match in matches"
          :key="match.id"
          class="match-list__item"
      >
        <RouterLink
            :to="`/hockey/${match.id}`"
            class="match-list__link"
        >
          <span class="match-list__teams">
            {{ match.teamA?.name }} — {{ match.teamB?.name }}
          </span>

          <span class="match-list__meta">
            {{ formatMatchDate(match.startAt) }}
          </span>

          <span
              v-if="match.score"
              class="match-list__score"
          >
            {{ match.score }}
          </span>

          <span
              v-else-if="match.stageName"
              class="match-list__stage"
          >
            {{ match.stageName }}
          </span>
        </RouterLink>
      </li>
    </ul>

    <p
        v-else
        class="panel__text"
    >
      {{ emptyText }}
    </p>
  </section>
</template>

<style scoped lang="scss">
.panel {
  display: grid;
  gap: 14px;
  padding: 22px;
  border-radius: 24px;
  background: rgba(13, 18, 35, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.section-head__eyebrow {
  margin: 0;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.56);
}

.section-head__title {
  margin: 0;
  font-size: 22px;
  color: #fff;
}

.match-list {
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.match-list__link {
  display: grid;
  gap: 6px;
  padding: 14px;
  border-radius: 18px;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.match-list__teams {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
}

.match-list__meta,
.match-list__stage {
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
}

.match-list__score {
  color: var(--team-color);
  font-size: 14px;
  font-weight: 700;
}

.panel__text {
  margin: 0;
  color: rgba(255, 255, 255, 0.82);
}
</style>