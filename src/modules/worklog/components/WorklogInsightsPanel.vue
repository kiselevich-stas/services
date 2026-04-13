<script setup lang="ts">
interface Props {
  previousWeekHours: number
  weekDeltaLabel: string
  weekDeltaPercentLabel: string
  weekDeltaClass: string
  bestWeekday: string
  bestWeekdayHours: number
  monthlyTopProjectName: string
  monthlyTopProjectHours: number
  weekDeltaText: string
  weeklySummaryText: string
  recentProjects: string[]
}

defineProps<Props>()
</script>

<template>
  <section class="worklog-insights-panel">
    <div class="worklog-insights-panel__header">
      <div>
        <p class="worklog-insights-panel__eyebrow">Новые инсайты</p>
        <h2 class="worklog-insights-panel__title">Что видно по твоему worklog</h2>
      </div>

      <p class="worklog-insights-panel__text">
        {{ weeklySummaryText }}
      </p>
    </div>

    <div class="worklog-insights-grid">
      <article class="worklog-insight-card">
        <p class="worklog-insight-card__label">Прошлая неделя</p>
        <p class="worklog-insight-card__value">
          {{ previousWeekHours }} ч
        </p>
        <p class="worklog-insight-card__hint">
          База для сравнения текущего темпа
        </p>
      </article>

      <article class="worklog-insight-card">
        <p class="worklog-insight-card__label">
          Разница по неделе
        </p>
        <p
            class="worklog-insight-card__value"
            :class="weekDeltaClass"
        >
          {{ weekDeltaLabel }}
        </p>
        <p class="worklog-insight-card__hint">
          {{ weekDeltaPercentLabel }}
        </p>
      </article>

      <article class="worklog-insight-card">
        <p class="worklog-insight-card__label">Лучший день недели</p>
        <p class="worklog-insight-card__value">
          {{ bestWeekday }}
        </p>
        <p class="worklog-insight-card__hint">
          В среднем {{ bestWeekdayHours }} ч
        </p>
      </article>

      <article class="worklog-insight-card">
        <p class="worklog-insight-card__label">Топ проект месяца</p>
        <p class="worklog-insight-card__value">
          {{ monthlyTopProjectName }}
        </p>
        <p class="worklog-insight-card__hint">
          {{ monthlyTopProjectHours }} ч за месяц
        </p>
      </article>
    </div>

    <div class="worklog-insights-footer">
      <div class="worklog-insights-footer__trend">
        <span class="worklog-insights-footer__trend-label">Темп недели</span>
        <span
            class="worklog-insights-footer__trend-value"
            :class="weekDeltaClass"
        >
          {{ weekDeltaText }}
        </span>
      </div>

      <div
          v-if="recentProjects.length"
          class="worklog-insights-footer__projects"
      >
        <span class="worklog-insights-footer__projects-label">
          Недавние проекты
        </span>

        <div class="worklog-insights-footer__chips">
          <span
              v-for="project in recentProjects"
              :key="project"
              class="worklog-mini-chip"
          >
            {{ project }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.worklog-insights-panel {
  display: grid;
  gap: 18px;
  padding: 22px;
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.03)),
      rgba(10, 14, 24, 0.82);
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.24);
  backdrop-filter: blur(14px);
}

.worklog-insights-panel__header {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 16px;
  align-items: start;
}

.worklog-insights-panel__eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(139, 92, 246, 0.9);
}

.worklog-insights-panel__title {
  margin: 0;
  font-size: clamp(22px, 2vw, 28px);
  line-height: 1.1;
  color: #fff;
}

.worklog-insights-panel__text {
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.65;
}

.worklog-insights-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.worklog-insight-card {
  padding: 18px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  gap: 10px;

  &__label {
    margin: 0;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.56);
  }

  &__value {
    margin: 0;
    font-size: clamp(22px, 1.8vw, 28px);
    line-height: 1.15;
    color: #fff;
    font-weight: 700;
  }

  &__hint {
    margin: 0;
    color: rgba(255, 255, 255, 0.66);
    font-size: 14px;
    line-height: 1.5;
  }
}

.worklog-insights-footer {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: 16px;
  align-items: start;
}

.worklog-insights-footer__trend {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.worklog-insights-footer__trend-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.56);
}

.worklog-insights-footer__trend-value {
  color: #fff;
  font-size: 15px;
  line-height: 1.55;
}

.worklog-insights-footer__projects {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.worklog-insights-footer__projects-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.56);
}

.worklog-insights-footer__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.worklog-mini-chip {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.82);
  font-size: 13px;
}

@media (max-width: 1200px) {
  .worklog-insights-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .worklog-insights-panel__header,
  .worklog-insights-footer {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .worklog-insights-panel {
    padding: 20px;
  }

  .worklog-insights-grid {
    grid-template-columns: 1fr;
  }
}
</style>