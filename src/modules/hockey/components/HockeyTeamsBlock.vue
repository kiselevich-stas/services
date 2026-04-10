<script setup lang="ts">
import HockeyTeamsSlider from "./teams/HockeyTeamsSlider.vue";

type TeamCard = {
  id?: string | number
  [key: string]: unknown
}

interface Props {
  items: TeamCard[]
  isLoading?: boolean
  errorMessage?: string | null
  title?: string
  subtitle?: string
  eyebrow?: string
  skeletonCount?: number
}

withDefaults(defineProps<Props>(), {
  isLoading: false,
  errorMessage: null,
  title: 'Команды',
  subtitle: '',
  eyebrow: 'KHL Teams',
  skeletonCount: 10,
})
</script>

<template>
    <HockeyTeamsSlider
        :teams="items"
        :loading="isLoading"
        :error="errorMessage"
        :title="title"
        :subtitle="subtitle"
    />
</template>

<style scoped lang="scss">
.teams-section {
  display: grid;
  gap: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  background: rgba(13, 18, 35, 0.82);
}

.teams-section__title {
  margin: 0;
  font-size: 28px;
}

.teams-section__subtitle {
  margin: 8px 0 0;
  color: rgba(255, 255, 255, 0.72);
}

.hockey-page__eyebrow {
  margin: 0 0 8px;
  color: #a78bfa;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.hockey-page__empty {
  padding: 20px;
  border-radius: 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(13, 18, 35, 0.82);
}

.teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.team-card--skeleton {
  display: grid;
  gap: 12px;
  padding: 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
}

.skeleton {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
}

.skeleton::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.12),
          transparent
  );
  animation: skeleton-shimmer 1.4s infinite;
}

.skeleton__logo {
  width: 72px;
  height: 72px;
  margin: 0 auto;
  border-radius: 50%;
}

.skeleton__title {
  height: 18px;
  width: 70%;
  margin: 0 auto;
}

.skeleton__text {
  height: 14px;
  width: 85%;
  margin: 0 auto;
}

.skeleton__text--small {
  width: 60%;
}

@keyframes skeleton-shimmer {
  100% {
    transform: translateX(100%);
  }
}

@media (max-width: 900px) {
  .teams-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>