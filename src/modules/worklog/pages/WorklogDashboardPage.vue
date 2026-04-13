<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import UiButton from '../../../components/ui/UiButton.vue'
import WorklogCharts from '../components/WorklogCharts.vue'
import WorklogHistoryList from '../components/WorklogHistoryList.vue'
import WorklogSummaryCards from '../components/WorklogSummaryCards.vue'
import { useWorklogStore } from '../store/worklog'

const worklogStore = useWorklogStore()

const stats = computed(() => worklogStore.stats)
const sortedLogs = computed(() => worklogStore.sortedLogs)

const weekDeltaLabel = computed(() => {
  const delta = stats.value.weekDeltaHours

  if (delta > 0) {
    return `+${delta} ч`
  }

  if (delta < 0) {
    return `${delta} ч`
  }

  return '0 ч'
})

const weekDeltaText = computed(() => {
  const delta = stats.value.weekDeltaHours

  if (delta > 0) {
    return `Ты идёшь лучше прошлой недели на ${delta} ч`
  }

  if (delta < 0) {
    return `Пока меньше прошлой недели на ${Math.abs(delta)} ч`
  }

  return 'Темп совпадает с прошлой неделей'
})

const weekDeltaPercentLabel = computed(() => {
  const percent = stats.value.weekDeltaPercent

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

const weekDeltaClass = computed(() => {
  if (stats.value.weekDeltaHours > 0) {
    return 'worklog-insight-card__value--success'
  }

  if (stats.value.weekDeltaHours < 0) {
    return 'worklog-insight-card__value--danger'
  }

  return ''
})

const weeklySummaryText = computed(() => {
  if (stats.value.weekHours === 0) {
    return 'На этой неделе пока нет записей. Самое время начать новую серию.'
  }

  if (stats.value.previousWeekHours === 0) {
    return `На этой неделе уже ${stats.value.weekHours} ч. Больше всего времени сейчас уходит на ${stats.value.topProjectName}.`
  }

  if (stats.value.weekHours > stats.value.previousWeekHours) {
    return `Неделя выглядит сильнее прошлой: ${stats.value.weekHours} ч против ${stats.value.previousWeekHours} ч. Лучший ритм обычно в ${stats.value.bestWeekday}.`
  }

  if (stats.value.weekHours < stats.value.previousWeekHours) {
    return `Пока темп ниже прошлой недели: ${stats.value.weekHours} ч против ${stats.value.previousWeekHours} ч. Можно усилить фокус на проекте ${stats.value.topProjectName}.`
  }

  return `Темп стабильный: ${stats.value.weekHours} ч, как и на прошлой неделе. Лучший день по ритму — ${stats.value.bestWeekday}.`
})

const recentProjects = computed(() => {
  return stats.value.recentProjects.slice(0, 4)
})

onMounted(async () => {
  try {
    await worklogStore.loadLogs()
  } catch {
    // тост уже показан в store
  }
})

async function handleRemove(id: string): Promise<void> {
  try {
    await worklogStore.removeLog(id)
  } catch {
    // тост уже показан в store
  }
}
</script>

<template>
  <div class="worklog-page">
    <section class="worklog-hero">
      <div class="worklog-hero__content">
        <p class="worklog-hero__eyebrow">Worklog</p>
        <h1 class="worklog-hero__title">Статистика рабочего времени</h1>
        <p class="worklog-hero__text">
          Отслеживай, сколько времени уходит на проекты, смотри динамику нагрузки
          и анализируй распределение рабочих часов в аккуратном стиле приложения.
        </p>

        <div class="worklog-hero__chips">
          <span class="worklog-chip">Привязка к профилю</span>
          <span class="worklog-chip">Анимированная статистика</span>
          <span class="worklog-chip">История записей</span>
        </div>

        <div class="worklog-hero__actions">
          <RouterLink to="/worklog/create" class="worklog-hero__link">
            <UiButton>
              Добавить запись
            </UiButton>
          </RouterLink>
        </div>
      </div>

      <div class="worklog-hero__aside">
        <div class="worklog-highlight-card">
          <span class="worklog-highlight-card__label">Топ проект</span>
          <strong class="worklog-highlight-card__value">
            {{ stats.topProjectName }}
          </strong>
          <span class="worklog-highlight-card__meta">
            Всего часов: {{ stats.totalHours }}
          </span>

          <div class="worklog-highlight-card__divider" />

          <div class="worklog-highlight-card__extra">
            <div class="worklog-highlight-card__extra-item">
              <span class="worklog-highlight-card__extra-label">Этот месяц</span>
              <span class="worklog-highlight-card__extra-value">
                {{ stats.monthlyTopProject }}
              </span>
            </div>

            <div class="worklog-highlight-card__extra-item">
              <span class="worklog-highlight-card__extra-label">Рекорд серии</span>
              <span class="worklog-highlight-card__extra-value">
                {{ stats.bestStreak }} дн.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <WorklogSummaryCards :stats="stats" />

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
            {{ stats.previousWeekHours }} ч
          </p>
          <p class="worklog-insight-card__hint">
            База для сравнения текущего темпа
          </p>
        </article>

        <article class="worklog-insight-card">
          <p class="worklog-insight-card__label">Разница по неделе</p>
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
            {{ stats.bestWeekday }}
          </p>
          <p class="worklog-insight-card__hint">
            В среднем {{ stats.bestWeekdayHours }} ч
          </p>
        </article>

        <article class="worklog-insight-card">
          <p class="worklog-insight-card__label">Топ проект месяца</p>
          <p class="worklog-insight-card__value">
            {{ stats.monthlyTopProject }}
          </p>
          <p class="worklog-insight-card__hint">
            {{ stats.monthlyTopProjectHours }} ч за месяц
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

    <section class="worklog-layout">
      <WorklogCharts :stats="stats" />
    </section>

    <WorklogHistoryList
        :logs="sortedLogs"
        :deleting-id="worklogStore.deletingId"
        @remove="handleRemove"
    />
  </div>
</template>

<style scoped lang="scss">
.worklog-page {
  display: grid;
  gap: 18px;
}

.worklog-hero {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(300px, 0.7fr);
  gap: 18px;
  padding: 28px;
  border-radius: 32px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background:
      radial-gradient(circle at top left, rgba(236, 72, 153, 0.2), transparent 26%),
      radial-gradient(circle at bottom right, rgba(6, 182, 212, 0.18), transparent 24%),
      linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04)),
      rgba(10, 14, 24, 0.92);
  box-shadow: 0 22px 60px rgba(0, 0, 0, 0.32);
  backdrop-filter: blur(18px);
}

.worklog-hero__eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(236, 72, 153, 0.9);
}

.worklog-hero__title {
  margin: 0;
  font-size: clamp(30px, 3vw, 44px);
  line-height: 1;
  letter-spacing: -0.04em;
  color: #fff;
}

.worklog-hero__text {
  margin: 14px 0 0;
  max-width: 760px;
  font-size: 16px;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.72);
}

.worklog-hero__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.worklog-chip {
  display: inline-flex;
  align-items: center;
  min-height: 36px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
}

.worklog-hero__actions {
  margin-top: 20px;
}

.worklog-hero__link {
  display: inline-flex;
  text-decoration: none;
}

.worklog-hero__aside {
  display: flex;
  align-items: stretch;
}

.worklog-highlight-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 100%;
  padding: 22px;
  border-radius: 26px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04));
  border: 1px solid rgba(255, 255, 255, 0.08);

  &__label {
    color: rgba(255, 255, 255, 0.56);
    font-size: 13px;
  }

  &__value {
    margin-top: 8px;
    font-size: clamp(24px, 2.4vw, 34px);
    line-height: 1.05;
    color: #fff;
  }

  &__meta {
    margin-top: 10px;
    color: rgba(255, 255, 255, 0.68);
    font-size: 14px;
  }

  &__divider {
    width: 100%;
    height: 1px;
    margin: 18px 0 14px;
    background: rgba(255, 255, 255, 0.08);
  }

  &__extra {
    display: grid;
    gap: 12px;
  }

  &__extra-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__extra-label {
    color: rgba(255, 255, 255, 0.5);
    font-size: 12px;
  }

  &__extra-value {
    color: #fff;
    font-size: 15px;
    font-weight: 600;
  }
}

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

    &--success {
      color: #86efac;
    }

    &--danger {
      color: #fca5a5;
    }
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

.worklog-layout {
  display: grid;
  gap: 18px;
}

.worklog-insight-card__value--success {
  color: #86efac;
}

.worklog-insight-card__value--danger {
  color: #fca5a5;
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

@media (max-width: 1100px) {
  .worklog-hero {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .worklog-hero,
  .worklog-highlight-card,
  .worklog-insights-panel {
    padding: 20px;
  }

  .worklog-insights-grid {
    grid-template-columns: 1fr;
  }
}
</style>