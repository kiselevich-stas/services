<script setup lang="ts">
import HockeyFilterToolbar from '../toolbar/HockeyFilterToolbar.vue'

type StatItem = {
  id: string
  title: string
  value: number
}

type SelectOption = {
  value: string
  label: string
}

defineProps<{
  stats?: StatItem[]
  subtitle?: string
  stageOptions?: SelectOption[]
  stageValue?: string
  stageLoading?: boolean
  isLoading?: boolean
}>()

const emit = defineEmits<{
  (event: 'change-stage', value: string): void
}>()

const skeletonItems = Array.from({ length: 6 }, (_, index) => index)
</script>

<template>
  <section class="panel">
    <div class="section-head">
      <div class="section-head__top">
        <div>
          <p class="section-head__eyebrow">Статистика</p>
          <h2 class="section-head__title">Ключевые показатели</h2>
          <p
              v-if="subtitle"
              class="section-head__subtitle"
          >
            {{ subtitle }}
          </p>
        </div>

        <div class="section-head__filter">
          <HockeyFilterToolbar
              :options="stageOptions ?? []"
              :model-value="stageValue ?? ''"
              :is-loading="stageLoading"
              label="Сезон / стадия"
              placeholder="Выберите сезон"
              @update:modelValue="emit('change-stage', $event)"
          />
        </div>
      </div>
    </div>

    <div
        v-if="isLoading"
        class="stats-grid"
    >
      <article
          v-for="item in skeletonItems.slice(0,6)"
          :key="item"
          class="stat-card stat-card--skeleton"
      >
        <div class="skeleton skeleton--value" />
        <div class="skeleton skeleton--title" />
      </article>
    </div>

    <div
        v-else-if="stats?.length"
        class="stats-grid"
    >
      <article
          v-for="stat in stats"
          :key="stat.id"
          class="stat-card"
      >
        <p class="stat-card__value">
          {{ stat.value }}
        </p>
        <p class="stat-card__title">
          {{ stat.title }}
        </p>
      </article>
    </div>

    <p
        v-else
        class="panel__text"
    >
      Нет статистики
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

.section-head__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.section-head__filter {
  width: 100%;
  max-width: 320px;
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

.section-head__subtitle {
  margin: 6px 0 0;
  color: rgba(255, 255, 255, 0.62);
  font-size: 14px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 12px;
}

.stat-card {
  padding: 16px;
  border-radius: 18px;
  background: var(--team-color-08);
  border: 1px solid var(--team-color-16);
}

.stat-card__value {
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: 700;
  color: var(--team-color);
}

.stat-card__title {
  margin: 0;
  font-size: 13px;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.76);
}

.panel__text {
  margin: 0;
  color: rgba(255, 255, 255, 0.82);
}

.stat-card--skeleton {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.06);
}

.skeleton {
  border-radius: 10px;
  background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0.06) 25%,
          rgba(255, 255, 255, 0.14) 50%,
          rgba(255, 255, 255, 0.06) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.4s infinite linear;
}

.skeleton--value {
  width: 64px;
  height: 30px;
  margin-bottom: 10px;
}

.skeleton--title {
  width: 100%;
  max-width: 120px;
  height: 14px;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

@media (max-width: 1180px) {
  .section-head__top {
    flex-direction: column;
    align-items: stretch;
  }

  .section-head__filter {
    max-width: none;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>