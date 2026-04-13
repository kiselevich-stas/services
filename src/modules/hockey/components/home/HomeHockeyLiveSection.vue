<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
  items: any[]
  isLoading: boolean
  errorMessage?: string | null
}>()
</script>

<template>
  <section class="section-card">
    <div class="section-card__top">
      <div>
        <p class="section-card__eyebrow">Live</p>
        <h2 class="section-card__title">
          <span class="live-dot" />
          Текущие матчи
        </h2>
        <p class="section-card__subtitle">
          Небольшой блок с матчами, которые идут прямо сейчас.
        </p>
      </div>

    </div>

    <div v-if="isLoading && !items.length" class="live-grid">
      <div v-for="index in 2" :key="index" class="live-mini-card live-mini-card--skeleton" />
    </div>

    <div v-else-if="errorMessage && !items.length" class="info-state info-state--error">
      {{ errorMessage }}
    </div>

    <div v-else-if="!items.length" class="info-state">
      Сейчас нет матчей в прямом эфире.
    </div>

    <div v-else class="live-grid">
      <RouterLink
          v-for="match in items"
          :key="`live-${match.id}`"
          :to="`/hockey/${match.id}`"
          class="live-mini-card"
      >
        <div class="live-mini-card__head">
          <span class="live-mini-card__badge">LIVE</span>
          <span class="live-mini-card__stage">{{ match.stageName || 'Матч сезона' }}</span>
        </div>

        <div class="live-mini-card__teams">
          <div class="live-mini-team">
            <img
                v-if="match.teamA?.image"
                :src="match.teamA.image"
                :alt="match.teamA?.name || 'team-a'"
                class="live-mini-team__logo"
            >
            <span>{{ match.teamA?.name || 'Команда 1' }}</span>
          </div>

          <strong class="live-mini-card__score">{{ match.score || '— : —' }}</strong>

          <div class="live-mini-team live-mini-team--right">
            <img
                v-if="match.teamB?.image"
                :src="match.teamB.image"
                :alt="match.teamB?.name || 'team-b'"
                class="live-mini-team__logo"
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
  display: flex;
  align-items: center;
  gap: 10px;
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

.section-card__link:hover {
  transform: translateY(-2px);
}

.live-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ef4444;
  box-shadow: 0 0 12px rgba(239, 68, 68, 0.8);
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

.live-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.live-mini-card {
  display: grid;
  gap: 16px;
  padding: 18px;
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(180deg, rgba(11, 16, 30, 0.94), rgba(18, 25, 48, 0.92));
  text-decoration: none;
  color: #fff;
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.live-mini-card:hover {
  transform: translateY(-2px);
}

.live-mini-card--skeleton {
  min-height: 132px;
  position: relative;
  overflow: hidden;
}

.live-mini-card--skeleton::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.12), transparent);
  animation: shimmer 1.4s infinite;
}

.live-mini-card__head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.live-mini-card__badge {
  display: inline-flex;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(239, 68, 68, 0.16);
  color: #fca5a5;
  font-size: 12px;
  font-weight: 700;
}

.live-mini-card__stage {
  color: rgba(255, 255, 255, 0.62);
  font-size: 12px;
  text-align: right;
}

.live-mini-card__teams {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 12px;
  align-items: center;
}

.live-mini-team {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.live-mini-team--right {
  justify-content: flex-end;
  text-align: right;
}

.live-mini-team__logo {
  width: 36px;
  height: 36px;
  object-fit: contain;
  flex-shrink: 0;
}

.live-mini-card__score {
  font-size: 30px;
  white-space: nowrap;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

@media (max-width: 1100px) {
  .live-grid {
    grid-template-columns: 1fr;
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

  .live-mini-card__teams {
    grid-template-columns: 1fr;
  }

  .live-mini-team,
  .live-mini-team--right {
    justify-content: center;
    text-align: center;
  }
}
</style>