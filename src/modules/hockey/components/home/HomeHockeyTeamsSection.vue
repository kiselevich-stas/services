<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
  items: any[]
  isLoading: boolean
  errorMessage?: string | null
  stageLabel: string
}>()
</script>

<template>
  <section class="section-card">
    <div class="section-card__top">
      <div>
        <p class="section-card__eyebrow">Teams</p>
        <h2 class="section-card__title">Все команды</h2>
        <p class="section-card__subtitle">
          {{ stageLabel }}
        </p>
      </div>

      <RouterLink to="/hockey/teams" class="section-card__link">
        Открыть страницу команд
      </RouterLink>
    </div>

    <div v-if="isLoading && !items.length" class="teams-grid">
      <div v-for="index in 12" :key="index" class="team-home-card team-home-card--skeleton" />
    </div>

    <div v-else-if="errorMessage && !items.length" class="info-state info-state--error">
      {{ errorMessage }}
    </div>

    <div v-else-if="!items.length" class="info-state">
      Команды для выбранного этапа пока не загружены.
    </div>

    <div v-else class="teams-grid">
      <article
          v-for="item in items"
          :key="item.team.id"
          class="team-home-card"
      >
        <img
            v-if="item.team.image"
            :src="item.team.image"
            :alt="item.team.name"
            class="team-home-card__logo"
        >

        <h3 class="team-home-card__title">{{ item.team.name }}</h3>
        <p class="team-home-card__city">{{ item.team.location || 'Город не указан' }}</p>

        <div class="team-home-card__meta">
          <span v-if="item.team.conference">{{ item.team.conference }}</span>
          <span v-if="item.team.division">{{ item.team.division }}</span>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped lang="scss">
.section-card {
  display: grid;
  gap: 18px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 28px;
  background:
      radial-gradient(circle at top right, rgba(59, 130, 246, 0.12), transparent 30%),
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
  color: #a78bfa;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.14em;
}

.section-card__title {
  margin: 0;
  font-size: 28px;
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
}

.info-state {
  padding: 18px;
  border-radius: 18px;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.03);
}

.info-state--error {
  color: #fca5a5;
}

.teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.team-home-card {
  display: grid;
  justify-items: center;
  gap: 10px;
  min-height: 220px;
  padding: 18px 16px;
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  text-align: center;
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.team-home-card:hover {
  transform: translateY(-2px);
}

.team-home-card--skeleton {
  position: relative;
  overflow: hidden;
}

.team-home-card--skeleton::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.12), transparent);
  animation: shimmer 1.4s infinite;
}

.team-home-card__logo {
  width: 72px;
  height: 72px;
  object-fit: contain;
}

.team-home-card__title {
  margin: 0;
  font-size: 18px;
}

.team-home-card__city {
  margin: 0;
  color: rgba(255, 255, 255, 0.68);
}

.team-home-card__meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.team-home-card__meta span {
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.76);
  font-size: 12px;
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
}
</style>