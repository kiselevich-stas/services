<script setup lang="ts">
import { computed, onMounted } from 'vue'

import WorklogCharts from '../components/WorklogCharts.vue'
import WorklogEmptyState from '../components/WorklogEmptyState.vue'
import WorklogHeroSection from '../components/WorklogHeroSection.vue'
import WorklogHistoryList from '../components/WorklogHistoryList.vue'
import WorklogInsightsPanel from '../components/WorklogInsightsPanel.vue'
import WorklogSummaryCards from '../components/WorklogSummaryCards.vue'

import { useProjectStore } from '../store/project'
import { useWorklogStore } from '../store/worklog'
import UiBreadcrumbs from "../../../components/ui/breadcrumbs/UiBreadcrumbs.vue";

const worklogStore = useWorklogStore()
const projectStore = useProjectStore()

const stats = computed(() => worklogStore.stats)
const sortedLogs = computed(() => worklogStore.sortedLogs)
const topProjectHours = computed(() => worklogStore.topProjectHours)



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

const topProjectName = computed(() => {
  return stats.value.topProjectName || 'Нет проектов'
})

const monthlyTopProjectName = computed(() => {
  return stats.value.monthlyTopProject || '—'
})

const isEmptyState = computed(() => {
  return !sortedLogs.value.length && !projectStore.projects.length
})

onMounted(async () => {
  try {
    await Promise.all([
      projectStore.loadProjects(),
      worklogStore.loadLogs(),
    ])
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

const breadcrumbs = computed(() => [
  { label: 'Главная', to: '/' },
  { label: 'Worklog', to: '/worklog' },
])

</script>

<template>
  <div class="worklog-page">
    <UiBreadcrumbs :items="breadcrumbs" />
    <WorklogHeroSection
        :top-project-name="topProjectName"
        :top-project-hours="topProjectHours"
        :total-hours="stats.totalHours"
        :monthly-top-project-name="monthlyTopProjectName"
        :best-streak="stats.bestStreak"
    />

    <WorklogEmptyState v-if="isEmptyState" />

    <template v-else>
      <WorklogSummaryCards :stats="stats" />

      <WorklogInsightsPanel
          :previous-week-hours="stats.previousWeekHours"
          :week-delta-label="weekDeltaLabel"
          :week-delta-percent-label="weekDeltaPercentLabel"
          :week-delta-class="weekDeltaClass"
          :best-weekday="stats.bestWeekday"
          :best-weekday-hours="stats.bestWeekdayHours"
          :monthly-top-project-name="monthlyTopProjectName"
          :monthly-top-project-hours="stats.monthlyTopProjectHours"
          :week-delta-text="weekDeltaText"
          :weekly-summary-text="weeklySummaryText"
          :recent-projects="recentProjects"
      />

      <section class="worklog-layout">
        <WorklogCharts :stats="stats" />

      </section>
      <WorklogHistoryList
          :logs="sortedLogs"
          :deleting-id="worklogStore.deletingId"
          @remove="handleRemove"
      />
    </template>
  </div>
</template>

<style scoped lang="scss">
.worklog-page {
  display: grid;
  gap: 18px;
}

.worklog-layout {
  display: grid;
  gap: 18px;
}
</style>