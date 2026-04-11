<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { HockeyTeamCard } from '../../types'
import { getTeamColor, hexToRgba } from '../../utils/khlTeamColors'

defineProps<{
  teams: HockeyTeamCard[]
  loading: boolean
  error: string
  title?: string
  subtitle?: string
}>()

const getTeamCardStyle = (teamName?: string | null) => {
  const teamColor = getTeamColor(teamName)

  return {
    '--team-color': teamColor,
    '--team-color-08': hexToRgba(teamColor, 0.08),
    '--team-color-12': hexToRgba(teamColor, 0.12),
    '--team-color-16': hexToRgba(teamColor, 0.16),
    '--team-color-20': hexToRgba(teamColor, 0.2),
    '--team-color-24': hexToRgba(teamColor, 0.24),
    '--team-color-32': hexToRgba(teamColor, 0.32),
    '--team-color-40': hexToRgba(teamColor, 0.4),
    '--team-color-55': hexToRgba(teamColor, 0.55),
    '--team-color-70': hexToRgba(teamColor, 0.7),
  }
}
</script>

<template>
  <section class="teams">
    <div
        v-if="loading"
        class="teams__loading"
    >
      Загрузка команд...
    </div>

    <div
        v-else-if="error"
        class="teams__error"
    >
      {{ error }}
    </div>

    <div
        v-else-if="!teams.length"
        class="teams__empty"
    >
      Нет команд для выбранного этапа
    </div>

    <div
        v-else
        class="teams__grid"
    >
      <RouterLink
          v-for="item in teams"
          :key="item.team.id"
          :to="`/hockey/teams/${item.team.id}`"
          class="team-card team-card--link"
          :style="getTeamCardStyle(item.team.name)"
      >
        <div class="team-card__glow" />

        <div
            v-if="item.team.image"
            class="team-card__logo-wrap"
        >
          <img
              :src="item.team.image"
              :alt="item.team.name"
              class="team-card__logo"
          />
        </div>

        <div class="team-card__name">
          {{ item.team.name }}
        </div>

        <div
            v-if="item.team.location"
            class="team-card__city"
        >
          {{ item.team.location }}
        </div>

        <div class="team-card__meta-list">
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
      </RouterLink>
    </div>
  </section>
</template>

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
  position: relative;
  overflow: hidden;
  isolation: isolate;
  display: grid;
  align-content: start;
  gap: 10px;
  min-height: 220px;
  padding: 18px 16px;
  border-radius: 18px;
  text-align: center;
  border: 1px solid var(--team-color-32);
  background:
      linear-gradient(
              180deg,
              var(--team-color-12) 0%,
              rgba(255, 255, 255, 0.04) 38%,
              rgba(255, 255, 255, 0.03) 100%
      );
  box-shadow:
      0 10px 24px rgba(0, 0, 0, 0.22),
      inset 0 0 0 1px rgba(255, 255, 255, 0.03),
      0 0 20px var(--team-color-08);
  transition:
      transform 0.25s ease,
      border-color 0.25s ease,
      box-shadow 0.25s ease,
      background 0.25s ease;
}

.team-card--link {
  display: grid;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.team-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background:
      linear-gradient(
              135deg,
              var(--team-color-16) 0%,
              transparent 36%,
              transparent 100%
      );
  z-index: 0;
}

.team-card:hover {
  transform: translateY(-4px);
  border-color: var(--team-color-70);
  box-shadow:
      0 14px 32px rgba(0, 0, 0, 0.28),
      inset 0 0 0 1px rgba(255, 255, 255, 0.04),
      0 0 28px var(--team-color-20);
}

.team-card__glow {
  position: absolute;
  left: 50%;
  top: -30px;
  width: 140px;
  height: 140px;
  transform: translateX(-50%);
  border-radius: 50%;
  background: radial-gradient(circle, var(--team-color-24) 0%, transparent 72%);
  filter: blur(28px);
  pointer-events: none;
  z-index: 0;
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.team-card:hover .team-card__glow {
  transform: translateX(-50%) scale(1.08);
}

.team-card__logo-wrap,
.team-card__name,
.team-card__city,
.team-card__meta-list {
  position: relative;
  z-index: 1;
}

.team-card__logo-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 88px;
}

.team-card__logo {
  width: 72px;
  height: 72px;
  object-fit: contain;
  filter: drop-shadow(0 0 14px var(--team-color-20));
  transition: transform 0.25s ease, filter 0.25s ease;
}

.team-card:hover .team-card__logo {
  transform: scale(1.04);
  filter: drop-shadow(0 0 18px var(--team-color-32));
}

.team-card__name {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.3;
  color: var(--team-color);
}

.team-card__city {
  font-size: 12px;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.72);
}

.team-card__meta-list {
  display: grid;
  gap: 6px;
  margin-top: auto;
}

.team-card__meta {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  line-height: 1.2;
  color: rgba(255, 255, 255, 0.82);
  background: var(--team-color-12);
  border: 1px solid var(--team-color-24);
  backdrop-filter: blur(6px);
}

.teams__loading,
.teams__error,
.teams__empty {
  text-align: center;
  padding: 20px;
  opacity: 0.7;
}

@media (max-width: 768px) {
  .teams {
    padding: 16px;
  }

  .teams__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .team-card {
    min-height: 200px;
    padding: 16px 14px;
  }

  .team-card__logo {
    width: 64px;
    height: 64px;
  }

  .team-card__name {
    font-size: 15px;
  }
}

@media (max-width: 520px) {
  .teams__grid {
    grid-template-columns: 1fr;
  }
}
</style>