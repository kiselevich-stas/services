<script setup lang="ts">
import { computed } from 'vue'
import type { WorkLogStats } from '../types'

const props = defineProps<{
  stats: WorkLogStats
}>()

const cards = computed(() => [
  {
    key: 'todayHours',
    title: 'Сегодня',
    value: props.stats.todayHours,
    suffix: 'ч',
    accent: 'pink',
  },
  {
    key: 'weekHours',
    title: 'За неделю',
    value: props.stats.weekHours,
    suffix: 'ч',
    accent: 'violet',
  },
  {
    key: 'monthHours',
    title: 'За месяц',
    value: props.stats.monthHours,
    suffix: 'ч',
    accent: 'blue',
  },
  {
    key: 'averagePerActiveDay',
    title: 'Среднее в активный день',
    value: props.stats.averagePerActiveDay,
    suffix: 'ч',
    accent: 'cyan',
  },
  {
    key: 'activeDays',
    title: 'Активные дни',
    value: props.stats.activeDays,
    suffix: 'дн.',
    accent: 'orange',
  },
  {
    key: 'streakDays',
    title: 'Серия подряд',
    value: props.stats.streakDays,
    suffix: 'дн.',
    accent: 'green',
  },
])
</script>

<template>
  <section class="worklog-summary-grid">
    <article
      v-for="card in cards"
      :key="card.key"
      class="worklog-summary-card"
      :class="`worklog-summary-card--${card.accent}`"
    >
      <span class="worklog-summary-card__shine" />
      <div class="worklog-summary-card__body">
        <p class="worklog-summary-card__label">{{ card.title }}</p>
        <div class="worklog-summary-card__value-row">
          <strong class="worklog-summary-card__value">{{ card.value }}</strong>
          <span class="worklog-summary-card__suffix">{{ card.suffix }}</span>
        </div>
      </div>
    </article>
  </section>
</template>

<style scoped lang="scss">
.worklog-summary-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 16px;
}

.worklog-summary-card {
  position: relative;
  overflow: hidden;
  min-height: 132px;
  padding: 18px;
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04)),
    rgba(10, 14, 24, 0.9);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(18px);
  animation: worklog-card-in 0.45s ease both;

  &__shine {
    position: absolute;
    inset: auto -16% -40% auto;
    width: 140px;
    height: 140px;
    border-radius: 999px;
    opacity: 0.95;
    filter: blur(8px);
  }

  &__body {
    position: relative;
    z-index: 1;
  }

  &__label {
    margin: 0 0 18px;
    font-size: 13px;
    line-height: 1.4;
    color: rgba(255, 255, 255, 0.68);
  }

  &__value-row {
    display: flex;
    align-items: flex-end;
    gap: 8px;
  }

  &__value {
    font-size: clamp(28px, 2.6vw, 40px);
    line-height: 0.95;
    letter-spacing: -0.04em;
    color: #fff;
  }

  &__suffix {
    padding-bottom: 4px;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.6);
  }

  &--pink .worklog-summary-card__shine {
    background: radial-gradient(circle, rgba(236, 72, 153, 0.42), transparent 65%);
  }

  &--violet .worklog-summary-card__shine {
    background: radial-gradient(circle, rgba(139, 92, 246, 0.42), transparent 65%);
  }

  &--blue .worklog-summary-card__shine {
    background: radial-gradient(circle, rgba(59, 130, 246, 0.42), transparent 65%);
  }

  &--cyan .worklog-summary-card__shine {
    background: radial-gradient(circle, rgba(6, 182, 212, 0.42), transparent 65%);
  }

  &--orange .worklog-summary-card__shine {
    background: radial-gradient(circle, rgba(249, 115, 22, 0.42), transparent 65%);
  }

  &--green .worklog-summary-card__shine {
    background: radial-gradient(circle, rgba(34, 197, 94, 0.42), transparent 65%);
  }
}

@keyframes worklog-card-in {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.985);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 1180px) {
  .worklog-summary-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .worklog-summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 520px) {
  .worklog-summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
