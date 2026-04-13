<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
  liveCount: number
  upcomingCount: number
  teamsCount: number
}>()
</script>

<template>
  <header class="hero-card">
    <div class="hero-card__content">
      <p class="hero-card__eyebrow">KHL Center</p>
      <h1 class="hero-card__title">Хоккейный центр на главной</h1>
      <p class="hero-card__subtitle">
        Быстрый доступ к live-матчам, ближайшим играм, Elo-рейтингу и всем
        командам текущего этапа — в одном месте.
      </p>

      <div class="hero-card__actions">
        <RouterLink to="/hockey/elo" class="hero-card__button hero-card__button--primary">
          Смотреть Elo рейтинг
        </RouterLink>
      </div>
    </div>

    <div class="hero-card__aside">
      <div class="hero-stat hero-stat--live">
        <span>Live сейчас</span>
        <strong class="hero-stat__value" :key="liveCount">{{ liveCount }}</strong>
      </div>

      <div class="hero-stat hero-stat--upcoming">
        <span>Ближайшие матчи</span>
        <strong class="hero-stat__value" :key="upcomingCount">{{ upcomingCount }}</strong>
      </div>

      <div class="hero-stat hero-stat--teams">
        <span>Команды этапа</span>
        <strong class="hero-stat__value" :key="teamsCount">{{ teamsCount }}</strong>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.hero-card {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(260px, 0.8fr);
  gap: 24px;
  padding: 32px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 28px;
  background:
      radial-gradient(circle at top right, rgba(59, 130, 246, 0.12), transparent 30%),
      rgba(13, 18, 35, 0.86);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  animation: hero-card-fade-up 0.6s ease;
}

.hero-card__content {
  animation: hero-card-content-in 0.7s ease;
}

.hero-card__eyebrow {
  margin: 0 0 10px;
  color: #a78bfa;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.14em;
}

.hero-card__title {
  margin: 0;
  font-size: 42px;
  line-height: 1.05;
}

.hero-card__subtitle {
  margin: 12px 0 0;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.6;
}

.hero-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
}

.hero-card__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0 18px;
  border-radius: 14px;
  font-weight: 700;
  text-decoration: none;
  transition:
      transform 0.25s ease,
      opacity 0.25s ease,
      box-shadow 0.25s ease,
      border-color 0.25s ease;
}

.hero-card__button:hover {
  transform: translateY(-2px);
}

.hero-card__button--primary {
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  color: #fff;
  box-shadow: 0 10px 30px rgba(37, 99, 235, 0.28);
}

.hero-card__button--primary:hover {
  box-shadow: 0 14px 34px rgba(124, 58, 237, 0.35);
}

.hero-card__button--secondary {
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #fff;
  background: rgba(255, 255, 255, 0.04);
}

.hero-card__button--secondary:hover {
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.06);
}

.hero-card__aside {
  display: grid;
  gap: 12px;
}

.hero-stat {
  position: relative;
  display: grid;
  gap: 8px;
  padding: 18px 20px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.06);
  overflow: hidden;
  backdrop-filter: blur(10px);
  transition:
      transform 0.3s ease,
      box-shadow 0.3s ease,
      border-color 0.3s ease,
      background 0.3s ease;
}

.hero-stat::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
          120deg,
          transparent 0%,
          rgba(255, 255, 255, 0.08) 35%,
          transparent 65%
  );
  transform: translateX(-120%);
  transition: transform 0.8s ease;
  pointer-events: none;
}

.hero-stat:hover {
  transform: translateY(-4px) scale(1.01);
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.24);
}

.hero-stat:hover::before {
  transform: translateX(120%);
}

.hero-stat span {
  color: rgba(255, 255, 255, 0.66);
  font-size: 13px;
}

.hero-stat strong {
  font-size: 30px;
}

.hero-stat__value {
  display: inline-block;
  line-height: 1;
  animation: hero-stat-value-in 0.55s cubic-bezier(0.22, 1, 0.36, 1);
  transform-origin: center;
  will-change: transform, opacity, filter;
}

.hero-stat--live {
  animation: hero-stat-in 0.55s ease both;
}

.hero-stat--upcoming {
  animation: hero-stat-in 0.55s ease 0.08s both;
}

.hero-stat--teams {
  animation: hero-stat-in 0.55s ease 0.16s both;
}

.hero-stat--live .hero-stat__value {
  text-shadow: 0 0 14px rgba(248, 113, 113, 0.22);
}

.hero-stat--live::after {
  content: '';
  position: absolute;
  top: 18px;
  right: 18px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ef4444;
  box-shadow:
      0 0 0 0 rgba(239, 68, 68, 0.6),
      0 0 18px rgba(239, 68, 68, 0.45);
  animation: hero-live-pulse 1.8s infinite;
}

.hero-stat--live:hover {
  box-shadow: 0 16px 40px rgba(239, 68, 68, 0.14);
}

.hero-stat--upcoming .hero-stat__value {
  text-shadow: 0 0 14px rgba(96, 165, 250, 0.18);
}

.hero-stat--teams .hero-stat__value {
  text-shadow: 0 0 14px rgba(167, 139, 250, 0.2);
}

@keyframes hero-card-fade-up {
  from {
    opacity: 0;
    transform: translateY(14px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes hero-card-content-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes hero-stat-in {
  from {
    opacity: 0;
    transform: translateY(14px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes hero-stat-value-in {
  0% {
    opacity: 0;
    transform: translateY(12px) scale(0.92);
    filter: blur(6px);
  }

  60% {
    opacity: 1;
    transform: translateY(-2px) scale(1.04);
    filter: blur(0);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

@keyframes hero-live-pulse {
  0% {
    box-shadow:
        0 0 0 0 rgba(239, 68, 68, 0.55),
        0 0 18px rgba(239, 68, 68, 0.45);
  }

  70% {
    box-shadow:
        0 0 0 10px rgba(239, 68, 68, 0),
        0 0 22px rgba(239, 68, 68, 0.25);
  }

  100% {
    box-shadow:
        0 0 0 0 rgba(239, 68, 68, 0),
        0 0 18px rgba(239, 68, 68, 0.45);
  }
}

@media (max-width: 1100px) {
  .hero-card {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .hero-card {
    padding: 18px;
  }

  .hero-card__actions {
    flex-direction: column;
    align-items: stretch;
  }

  .hero-card__title {
    font-size: 32px;
  }

  .hero-stat strong {
    font-size: 26px;
  }
}
</style>