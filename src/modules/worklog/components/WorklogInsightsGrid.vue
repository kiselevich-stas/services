<script setup lang="ts">
import { computed } from 'vue'
import { useWorklogStore } from '../store/worklog'

const worklogStore = useWorklogStore()

const weekDeltaLabel = computed(() => {
  const delta = worklogStore.stats.weekDeltaHours

  if (delta > 0) {
    return `+${delta} ч к прошлой неделе`
  }

  if (delta < 0) {
    return `${delta} ч к прошлой неделе`
  }

  return 'Столько же, сколько на прошлой неделе'
})

const weekDeltaTone = computed(() => {
  const delta = worklogStore.stats.weekDeltaHours

  if (delta > 0) {
    return 'success'
  }

  if (delta < 0) {
    return 'danger'
  }

  return 'neutral'
})

const weekDeltaPercentLabel = computed(() => {
  const percent = worklogStore.stats.weekDeltaPercent

  if (percent === null) {
    return 'Нет данных для сравнения'
  }

  if (percent > 0) {
    return `+${percent}%`
  }

  if (percent < 0) {
    return `${percent}%`
  }

  return '0%'
})

const weeklySummary = computed(() => {
  const weekHours = worklogStore.stats.weekHours
  const previousWeekHours = worklogStore.stats.previousWeekHours
  const topProject = worklogStore.stats.topProjectName
  const bestWeekday = worklogStore.stats.bestWeekday

  if (weekHours === 0) {
    return 'На этой неделе пока нет записей. Самое время открыть новую серию.'
  }

  if (previousWeekHours === 0) {
    return `На этой неделе уже ${weekHours} ч. Главный фокус сейчас — ${topProject}.`
  }

  if (weekHours > previousWeekHours) {
    return `Неделя идёт сильнее прошлой: ${weekHours} ч против ${previousWeekHours} ч. Лучший ритм обычно в ${bestWeekday}.`
  }

  if (weekHours < previousWeekHours) {
    return `Пока темп ниже прошлой недели: ${weekHours} ч против ${previousWeekHours} ч. Можно добрать время на главном проекте — ${topProject}.`
  }

  return `Темп ровный: ${weekHours} ч, как и на прошлой неделе. Лучший день по ритму — ${bestWeekday}.`
})

const recentProjectsText = computed(() => {
  if (!worklogStore.stats.recentProjects.length) {
    return 'Пока нет проектов'
  }

  return worklogStore.stats.recentProjects.join(' • ')
})
</script>

<template>
  <section class="worklog-insights">
    <div class="worklog-insights__hero panel">
      <div class="worklog-insights__hero-glow" />

      <div class="worklog-insights__hero-content">
        <p class="worklog-insights__eyebrow">Insights</p>

        <h2 class="worklog-insights__title">
          Твой worklog стал умнее
        </h2>

        <p class="worklog-insights__text">
          {{ weeklySummary }}
        </p>

        <div class="worklog-insights__badges">
          <span
              class="worklog-insights__badge"
              :class="`worklog-insights__badge--${weekDeltaTone}`"
          >
            {{ weekDeltaLabel }}
          </span>

          <span class="worklog-insights__badge worklog-insights__badge--ghost">
            {{ weekDeltaPercentLabel }}
          </span>
        </div>
      </div>
    </div>

    <div class="worklog-insights__grid">
      <article class="worklog-metric-card panel">
        <p class="worklog-metric-card__label">Прошлая неделя</p>
        <p class="worklog-metric-card__value">
          {{ worklogStore.stats.previousWeekHours }} ч
        </p>
        <p class="worklog-metric-card__hint">
          База для сравнения с текущей неделей
        </p>
      </article>

      <article class="worklog-metric-card panel">
        <p class="worklog-metric-card__label">Разница по неделе</p>
        <p
            class="worklog-metric-card__value"
            :class="{
            'worklog-metric-card__value--success': worklogStore.stats.weekDeltaHours > 0,
            'worklog-metric-card__value--danger': worklogStore.stats.weekDeltaHours < 0,
          }"
        >
          {{ weekDeltaLabel }}
        </p>
        <p class="worklog-metric-card__hint">
          {{ weekDeltaPercentLabel }}
        </p>
      </article>

      <article class="worklog-metric-card panel">
        <p class="worklog-metric-card__label">Лучший день недели</p>
        <p class="worklog-metric-card__value">
          {{ worklogStore.stats.bestWeekday }}
        </p>
        <p class="worklog-metric-card__hint">
          В среднем {{ worklogStore.stats.bestWeekdayHours }} ч
        </p>
      </article>

      <article class="worklog-metric-card panel">
        <p class="worklog-metric-card__label">Рекорд серии</p>
        <p class="worklog-metric-card__value">
          {{ worklogStore.stats.bestStreak }} дн.
        </p>
        <p class="worklog-metric-card__hint">
          Сейчас серия: {{ worklogStore.stats.streakDays }} дн.
        </p>
      </article>

      <article class="worklog-metric-card panel">
        <p class="worklog-metric-card__label">Топ проект месяца</p>
        <p class="worklog-metric-card__value">
          {{ worklogStore.stats.monthlyTopProject }}
        </p>
        <p class="worklog-metric-card__hint">
          {{ worklogStore.stats.monthlyTopProjectHours }} ч за месяц
        </p>
      </article>

      <article class="worklog-metric-card panel">
        <p class="worklog-metric-card__label">Недавние проекты</p>
        <p class="worklog-metric-card__value worklog-metric-card__value--small">
          {{ recentProjectsText }}
        </p>
        <p class="worklog-metric-card__hint">
          Быстрые ориентиры для новых записей
        </p>
      </article>
    </div>
  </section>
</template>

<style scoped lang="scss">
.worklog-insights {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.worklog-insights__hero {
  position: relative;
  overflow: hidden;
  min-height: 180px;
}

.worklog-insights__hero-glow {
  position: absolute;
  inset: auto auto -30% -10%;
  width: 260px;
  height: 260px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.24), transparent 68%);
  pointer-events: none;
}

.worklog-insights__hero-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.worklog-insights__eyebrow {
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(236, 72, 153, 0.9);
}

.worklog-insights__title {
  margin: 0;
  font-size: clamp(24px, 2.4vw, 32px);
  line-height: 1.05;
  color: #fff;
}

.worklog-insights__text {
  margin: 0;
  max-width: 760px;
  color: rgba(255, 255, 255, 0.76);
  line-height: 1.6;
}

.worklog-insights__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.worklog-insights__badge {
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  backdrop-filter: blur(8px);

  &--success {
    background: rgba(34, 197, 94, 0.14);
    color: #86efac;
    border: 1px solid rgba(34, 197, 94, 0.2);
  }

  &--danger {
    background: rgba(248, 113, 113, 0.14);
    color: #fca5a5;
    border: 1px solid rgba(248, 113, 113, 0.2);
  }

  &--neutral {
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.86);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  &--ghost {
    background: rgba(255, 255, 255, 0.06);
    color: rgba(255, 255, 255, 0.72);
    border: 1px solid rgba(255, 255, 255, 0.06);
  }
}

.worklog-insights__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.worklog-metric-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 140px;
}

.worklog-metric-card__label {
  margin: 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.58);
}

.worklog-metric-card__value {
  margin: 0;
  font-size: clamp(22px, 2vw, 28px);
  font-weight: 700;
  line-height: 1.15;
  color: #fff;

  &--small {
    font-size: 18px;
    line-height: 1.4;
  }

  &--success {
    color: #86efac;
  }

  &--danger {
    color: #fca5a5;
  }
}

.worklog-metric-card__hint {
  margin: 0;
  color: rgba(255, 255, 255, 0.66);
  line-height: 1.5;
}

@media (max-width: 1100px) {
  .worklog-insights__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .worklog-insights__grid {
    grid-template-columns: 1fr;
  }

  .worklog-insights__hero {
    min-height: unset;
  }
}
</style>