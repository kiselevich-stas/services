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
        </div>
      </div>
    </section>

    <WorklogSummaryCards :stats="stats" />

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
}

.worklog-layout {
  display: grid;
  gap: 18px;
}

@media (max-width: 1100px) {
  .worklog-hero {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .worklog-hero,
  .worklog-highlight-card {
    padding: 20px;
  }
}
</style>