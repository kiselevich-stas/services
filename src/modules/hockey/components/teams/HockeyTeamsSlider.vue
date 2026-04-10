<template>
  <section >
    <div v-if="loading" class="teams__loading">
      Загрузка команд...
    </div>

    <div v-else-if="error" class="teams__error">
      {{ error }}
    </div>

    <div v-else-if="!teams.length" class="teams__empty">
      Нет команд для выбранного этапа
    </div>

    <div v-else class="teams__grid">
      <div
          v-for="item in teams"
          :key="item.team.id"
          class="team-card"
      >
        <img
            v-if="item.team.image"
            :src="item.team.image"
            :alt="item.team.name"
            class="team-card__logo"
        />

        <div class="team-card__name">
          {{ item.team.name }}
        </div>

        <div
            v-if="item.team.location"
            class="team-card__city"
        >
          {{ item.team.location }}
        </div>

        <div
            v-if="item.team.division"
            class="team-card__meta"
        >
          {{ item.team.division }}
        </div>

        <div
            v-if="item.team.conference"
            class="team-card__meta"
        >
          {{ item.team.conference }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { HockeyTeamCard } from '../../types'

defineProps<{
  teams: HockeyTeamCard[]
  loading: boolean
  error: string
  title?: string
  subtitle?: string
}>()
</script>

<style scoped lang="scss">
.teams {
  display: grid;
  gap: 16px;
  padding: 24px;
  border-radius: 24px;
  background: rgba(13, 18, 35, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.teams__title {
  margin: 0;
  font-size: 28px;
}

.teams__subtitle {
  margin-top: 6px;
  color: rgba(255, 255, 255, 0.7);
}

.teams__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

.team-card {
  display: grid;
  gap: 10px;
  padding: 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
  text-align: center;
  min-height: 220px;
  transition: 0.2s ease;
}

.team-card:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}

.team-card__logo {
  width: 72px;
  height: 72px;
  object-fit: contain;
  margin: 0 auto;
}

.team-card__name {
  font-weight: 600;
}

.team-card__city {
  font-size: 12px;
  opacity: 0.7;
}

.team-card__meta {
  font-size: 12px;
  opacity: 0.7;
}

.teams__loading,
.teams__error,
.teams__empty {
  text-align: center;
  padding: 20px;
  opacity: 0.7;
}
</style>