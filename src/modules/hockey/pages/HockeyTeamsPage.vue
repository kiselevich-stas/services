<template>
  <section class="hockey-page">
    <UiBreadcrumbs :items="breadcrumbs" />

    <HockeyFilterToolbar
        :options="stageSelectOptions"
        :model-value="hockeyStore.selectedStageId ?? ''"
        :is-loading="hockeyStore.stageOptionsLoading"
        label="Сезон / стадия"
        placeholder="Выберите сезон"
        @update:modelValue="handleStageChange"
    />

    <section class="teams-section">
      <div class="teams-section__top">
        <div>
          <p class="hockey-page__eyebrow">KHL Teams</p>
          <h2 class="teams-section__title">Команды</h2>
          <p class="teams-section__subtitle">
            {{ selectedStageLabel }}
          </p>
        </div>
      </div>

      <div
          v-if="isInitialTeamsLoading"
          class="teams-grid"
      >
        <div
            v-for="index in 10"
            :key="`team-skeleton-${index}`"
            class="team-card team-card--skeleton"
        >
          <div class="skeleton skeleton__logo" />
          <div class="skeleton skeleton__title" />
          <div class="skeleton skeleton__text" />
          <div class="skeleton skeleton__text skeleton__text--small" />
        </div>
      </div>

      <HockeyTeamsBlock
          v-else
          :items="hockeyStore.teamCards"
          :is-loading="isInitialTeamsLoading"
          :error-message="hockeyStore.teamCardsError"
          title="Команды"
          :subtitle="selectedStageLabel"
      />
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { hockey } from '../store/hockey.ts'
import UiBreadcrumbs from "../../../components/ui/breadcrumbs/UiBreadcrumbs.vue";
import HockeyFilterToolbar from "../components/toolbar/HockeyFilterToolbar.vue";
import HockeyTeamsBlock from "../components/HockeyTeamsBlock.vue";

const hockeyStore = hockey()

const breadcrumbs = computed(() => [
  { label: 'Главная', to: '/' },
  { label: 'Хоккейный центр', to: '/hockey' },
  { label: 'Команды', to: '' },
])

const stageSelectOptions = computed(() => {
  return (hockeyStore.stageOptions ?? []).map((stage) => ({
    value: String(stage.id),
    label: stage.label,
  }))
})

const selectedStageLabel = computed(() => {
  const selectedStage = (hockeyStore.stageOptions ?? []).find(
      (stage) => String(stage.id) === String(hockeyStore.selectedStageId),
  )

  return selectedStage?.label ?? 'Команды выбранного этапа'
})

const isInitialTeamsLoading = computed(() => {
  return hockeyStore.stageOptionsLoading || hockeyStore.teamCardsLoading
})

function handleStageChange(value: string) {
  hockeyStore.setSelectedStage(value)
}

onMounted(async () => {
  if (!hockeyStore.stageOptions?.length) {
    await hockeyStore.fetchStageOptions()
  }

  if (hockeyStore.selectedStageId) {
    void hockeyStore.fetchTeamCards(true)
  }
})

watch(
    () => hockeyStore.selectedStageId,
    (newStageId, oldStageId) => {
      if (!newStageId || newStageId === oldStageId) {
        return
      }

      void hockeyStore.fetchTeamCards(true)
    },
)
</script>

<style scoped lang="scss">
.hockey-page {
  display: grid;
  gap: 20px;
  padding: 24px;
}

.hockey-page__hero {
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  background: rgba(13, 18, 35, 0.82);
}

.hockey-page__eyebrow {
  margin: 0 0 8px;
  color: #a78bfa;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.hockey-page__description {
  margin: 8px 0 0;
  color: rgba(255, 255, 255, 0.72);
}

.hockey-stage-filter,
.teams-section {
  display: grid;
  gap: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  background: rgba(13, 18, 35, 0.82);
}

.hockey-stage-filter__title,
.teams-section__title {
  margin: 0;
  font-size: 28px;
}

.hockey-stage-filter__subtitle,
.teams-section__subtitle {
  margin: 8px 0 0;
  color: rgba(255, 255, 255, 0.72);
}

.hockey-stage-filter__controls {
  max-width: 420px;
}

.hockey-page__empty {
  padding: 20px;
  border-radius: 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(13, 18, 35, 0.82);
}

.hockey-stage-filter__empty {
  background: rgba(255, 255, 255, 0.02);
}

.hockey-stage-filter__skeleton {
  display: grid;
  gap: 12px;
  max-width: 420px;
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

.skeleton__label {
  height: 16px;
  width: 140px;
}

.skeleton__select {
  height: 48px;
  width: 100%;
  border-radius: 14px;
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
  .hockey-page {
    padding: 16px;
  }

  .teams-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>