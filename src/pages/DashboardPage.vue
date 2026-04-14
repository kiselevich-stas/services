<script setup lang="ts">
import {computed, onMounted, onUnmounted} from 'vue'
import {useRouter} from 'vue-router'

import {useAuthStore} from '../stores/auth'
import {usePreferencesStore} from '../stores/preferences'
import {useWorklogStore} from '../modules/worklog/store/worklog'
import {useProfileStore} from "../modules/profile";
import HomeHockeyLiveSection from "../modules/hockey/components/home/HomeHockeyLiveSection.vue";
import HomeHockeyUpcomingSection from "../modules/hockey/components/home/HomeHockeyUpcomingSection.vue";
import {hockey} from "../modules/hockey/store/hockey.ts";

interface DashboardShortcut {
  title: string
  description: string
  route: string
  theme: 'worklog' | 'weather' | 'countdowns' | 'workspace' | 'hockey' | 'vacation'
  requiresAuth: boolean
  enabled: boolean
}

const router = useRouter()

const profileStore = useProfileStore()
const authStore = useAuthStore()
const preferencesStore = usePreferencesStore()
const worklogStore = useWorklogStore()

const isAuthorized = computed(() => Boolean(authStore.user))

const greeting = computed(() => {
  const hour = new Date().getHours()

  if (hour < 6) {
    return 'Доброй ночи'
  }

  if (hour < 12) {
    return 'Доброе утро'
  }

  if (hour < 18) {
    return 'Добрый день'
  }

  return 'Добрый вечер'
})

const userName = computed(() => {
  return authStore.user?.name ?? 'гость'
})

const todayDateLabel = computed(() => {
  return new Intl.DateTimeFormat('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date())
})

const todayHours = computed(() => worklogStore.stats.todayHours ?? 0)
const weekHours = computed(() => worklogStore.stats.weekHours ?? 0)
const monthHours = computed(() => worklogStore.stats.monthHours ?? 0)
const streakDays = computed(() => worklogStore.stats.streakDays ?? 0)
const bestStreak = computed(() => worklogStore.stats.bestStreak ?? 0)
const activeDays = computed(() => worklogStore.stats.activeDays ?? 0)
const averagePerActiveDay = computed(() => worklogStore.stats.averagePerActiveDay ?? 0)
const topProjectName = computed(() => worklogStore.stats.topProjectName ?? '—')
const todayFocus = computed(() => worklogStore.todayFocus)
const recentProjects = computed(() => worklogStore.stats.recentProjects ?? [])

const weeklyTrendText = computed(() => {
  const delta = worklogStore.stats.weekDeltaHours ?? 0
  const percent = worklogStore.stats.weekDeltaPercent

  if (delta > 0) {
    return percent === null
        ? `+${delta} ч к прошлой неделе`
        : `+${delta} ч (${percent}%) к прошлой неделе`
  }

  if (delta < 0) {
    return percent === null
        ? `${delta} ч к прошлой неделе`
        : `${delta} ч (${percent}%) к прошлой неделе`
  }

  return 'На уровне прошлой недели'
})

const hockeyStore = hockey()

const liveMatchesPreview = computed(() => {
  return (hockeyStore.liveMatches ?? []).slice(0, 2)
})

const upcomingMatchesPreview = computed(() => {
  return (hockeyStore.matches ?? []).slice(0, 6)
})

function formatMatchDate(date: string | null | undefined) {
  if (!date) {
    return 'Дата уточняется'
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

const dashboardShortcuts = computed<DashboardShortcut[]>(() => {
  return [
    {
      title: 'Учет времени',
      description: 'Добавить запись и посмотреть статистику',
      route: '/worklog',
      theme: 'worklog',
      requiresAuth: true,
      enabled: preferencesStore.isModuleEnabled('worklog'),
    },
    {
      title: 'Погода',
      description: 'Открыть прогноз и рекомендации',
      route: '/weather',
      theme: 'weather',
      requiresAuth: false,
      enabled: true,
    },
    {
      title: 'Таймеры',
      description: 'Проверить ближайшие события',
      route: '/countdowns',
      theme: 'countdowns',
      requiresAuth: true,
      enabled: preferencesStore.isModuleEnabled('countdown'),
    },
    {
      title: 'Пространство',
      description: 'Профиль, настройки и личные данные',
      route: '/spaces',
      theme: 'workspace',
      requiresAuth: true,
      enabled: preferencesStore.isModuleEnabled('workspace'),
    },
    {
      title: 'Отпуск',
      description: 'Маршрут, документы и план поездки',
      route: '/vacation',
      theme: 'vacation',
      requiresAuth: true,
      enabled: true,
    },
    {
      title: 'KHL Head-to-Head',
      description: 'Сравнение команд и последние матчи',
      route: '/hockey',
      theme: 'hockey',
      requiresAuth: false,
      enabled: true,
    },
  ].filter((item) => item.enabled)
})

const weekChartBars = computed(() => {
  const distribution = worklogStore.stats.weekDistribution ?? []
  const maxValue = Math.max(...distribution.map((item) => item.value), 0)

  return distribution.map((item) => {
    const height = maxValue > 0 ? Math.max((item.value / maxValue) * 100, 10) : 10

    return {
      ...item,
      height,
    }
  })
})

function goTo(route: string, requiresAuth = false): void {
  if (requiresAuth && !isAuthorized.value) {
    return
  }

  router.push(route)
}

async function initPage() {
  await Promise.all([
    !hockeyStore.matches?.length ? hockeyStore.fetchUpcomingMatches() : Promise.resolve(),
    !hockeyStore.stageOptions?.length ? hockeyStore.fetchStageOptions() : Promise.resolve(),
    hockeyStore.loadLiveMatches(),
  ])

  hockeyStore.startLivePolling(15_000)

  if (hockeyStore.selectedStageId) {
    await hockeyStore.fetchTeamCards(true)
  }
}

onMounted(async () => {
  if (!isAuthorized.value) {
    return
  }

  try {
    await worklogStore.loadLogs()
    await profileStore.ensureProfile(authStore.user)
  } catch {
    // Ошибка уже обработана в store
  }
  void initPage()
})

onUnmounted(() => {
  hockeyStore.stopLivePolling()
})
</script>

<template>
  <div class="dashboard-page">
    <section class="dashboard-hero">
      <div class="dashboard-hero__content">
        <div class="dashboard-hero__eyebrow">Dashboard</div>

        <h1 class="dashboard-hero__title">
          {{ greeting }}, {{ profileStore?.profile?.firstName }} {{ profileStore?.profile?.lastName }}
        </h1>

        <p class="dashboard-hero__subtitle">
          Сегодня {{ todayDateLabel }}. Здесь собрана краткая сводка по активности, рабочим часам и быстрым переходам в
          основные модули.
        </p>

        <div class="dashboard-hero__actions">
          <button
              class="dashboard-button dashboard-button--primary"
              type="button"
              @click="goTo('/worklog/create', true)"
          >
            Добавить часы
          </button>

          <button
              class="dashboard-button dashboard-button--secondary"
              type="button"
              @click="goTo('/worklog', true)"
          >
            Открыть worklog
          </button>
        </div>
      </div>

      <div class="dashboard-hero__stats">
        <div class="hero-stat-card">
          <div class="hero-stat-card__label">Сегодня</div>
          <div class="hero-stat-card__value">
            {{ todayHours }} ч
          </div>
          <div class="hero-stat-card__hint">
            Текущая дневная нагрузка
          </div>
        </div>

        <div class="hero-stat-card">
          <div class="hero-stat-card__label">Неделя</div>
          <div class="hero-stat-card__value">
            {{ weekHours }} ч
          </div>
          <div class="hero-stat-card__hint">
            {{ weeklyTrendText }}
          </div>
        </div>

        <div class="hero-stat-card">
          <div class="hero-stat-card__label">Серия</div>
          <div class="hero-stat-card__value">
            {{ streakDays }} д.
          </div>
          <div class="hero-stat-card__hint">
            Лучший streak: {{ bestStreak }} д.
          </div>
        </div>
      </div>
    </section>

    <section class="dashboard-grid">
      <article class="dashboard-card dashboard-card--feature">
        <div class="dashboard-card__head">
          <div>
            <div class="dashboard-card__eyebrow">Worklog</div>
            <h2 class="dashboard-card__title">Сводка по времени</h2>
          </div>

          <button
              class="dashboard-link-button"
              type="button"
              @click="goTo('/worklog', true)"
          >
            Все записи
          </button>
        </div>

        <div class="worklog-summary">
          <div class="worklog-summary__main">
            <div class="worklog-summary__big">
              {{ todayHours }} ч
            </div>

            <div class="worklog-summary__text">
              <p>
                Сегодня в фокусе:
                <strong>{{ todayFocus.project || 'Пока без проекта' }}</strong>
              </p>

              <p>
                По этому проекту сегодня:
                <strong>{{ todayFocus.hours || 0 }} ч</strong>
              </p>
            </div>
          </div>

          <div class="worklog-summary__meta">
            <div class="mini-stat">
              <span class="mini-stat__label">За месяц</span>
              <span class="mini-stat__value">{{ monthHours }} ч</span>
            </div>

            <div class="mini-stat">
              <span class="mini-stat__label">Активных дней</span>
              <span class="mini-stat__value">{{ activeDays }}</span>
            </div>

            <div class="mini-stat">
              <span class="mini-stat__label">Среднее</span>
              <span class="mini-stat__value">{{ averagePerActiveDay }} ч</span>
            </div>

            <div class="mini-stat">
              <span class="mini-stat__label">Топ проект</span>
              <span class="mini-stat__value mini-stat__value--truncate">
                {{ topProjectName }}
              </span>
            </div>
          </div>
        </div>
      </article>

      <article class="dashboard-card">
        <div class="dashboard-card__head">
          <div>
            <div class="dashboard-card__eyebrow">Активность</div>
            <h2 class="dashboard-card__title">Неделя по дням</h2>
          </div>
        </div>

        <div class="week-chart">
          <div
              v-for="bar in weekChartBars"
              :key="bar.label"
              class="week-chart__item"
          >
            <div class="week-chart__bar-wrap">
              <div
                  class="week-chart__bar"
                  :style="{ height: `${bar.height}%` }"
              />
            </div>

            <div class="week-chart__label">
              {{ bar.label }}
            </div>

            <div class="week-chart__value">
              {{ bar.value }}
            </div>
          </div>
        </div>
      </article>

      <article class="dashboard-hockey-card">
        <HomeHockeyLiveSection
            :items="liveMatchesPreview"
            :is-loading="hockeyStore.loadingLive"
            :error-message="hockeyStore.liveError"
        />
      </article>
      <article class="dashboard-hockey-card">
        <HomeHockeyUpcomingSection
            :items="upcomingMatchesPreview"
            :is-loading="hockeyStore.isLoading"
            :error-message="hockeyStore.errorMessage"
            :format-match-date="formatMatchDate"
        />
      </article>

      <article class="dashboard-card dashboard-card--wide">
        <div class="dashboard-card__head">
          <div>
            <div class="dashboard-card__eyebrow">Модули</div>
            <h2 class="dashboard-card__title">Быстрый доступ</h2>
          </div>
          <button
              class="dashboard-link-button"
              type="button"
              @click="goTo('/modules', true)"
          >
            Моудли
          </button>
        </div>

        <div class="shortcut-grid">
          <button
              v-for="item in dashboardShortcuts"
              :key="item.route"
              class="shortcut-card"
              :class="[
              `shortcut-card--${item.theme}`,
              {
                'shortcut-card--locked': item.requiresAuth && !isAuthorized,
              },
            ]"
              type="button"
              @click="goTo(item.route, item.requiresAuth)"
          >
            <div class="shortcut-card__title">
              {{ item.title }}
            </div>

            <div class="shortcut-card__text">
              {{ item.description }}
            </div>

            <div class="shortcut-card__footer">
              <span>
                {{ item.requiresAuth && !isAuthorized ? 'Вход нужен' : 'Открыть' }}
              </span>

              <span>→</span>
            </div>
          </button>
        </div>
      </article>
    </section>
  </div>
</template>

<style scoped lang="scss">
.dashboard-page {
  display: grid;
  gap: 20px;
}

.dashboard-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(320px, 0.9fr);
  gap: 18px;
  padding: 28px;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: radial-gradient(circle at top left, rgba(236, 72, 153, 0.18), transparent 28%),
  radial-gradient(circle at top right, rgba(6, 182, 212, 0.14), transparent 30%),
  linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03)),
  rgba(10, 14, 24, 0.92);
  box-shadow: 0 20px 56px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(18px);
}

.dashboard-hero__content {
  display: grid;
  align-content: start;
  gap: 14px;
}

.dashboard-hero__eyebrow {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  min-height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.8);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.dashboard-hero__title {
  margin: 0;
  font-size: clamp(30px, 4vw, 42px);
  line-height: 1.05;
  color: #fff;
}

.dashboard-hero__subtitle {
  margin: 0;
  max-width: 760px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.65;
  font-size: 15px;
}

.dashboard-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 4px;
}

.dashboard-button {
  min-height: 44px;
  padding: 0 18px;
  border-radius: 14px;
  border: 0;
  cursor: pointer;
  font-weight: 600;
  transition: transform 0.2s ease,
  box-shadow 0.2s ease,
  background 0.2s ease;
}

.dashboard-button:hover {
  transform: translateY(-1px);
}

.dashboard-button--primary {
  color: #fff;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.88), rgba(139, 92, 246, 0.88));
  box-shadow: 0 12px 28px rgba(139, 92, 246, 0.22);
}

.dashboard-button--secondary {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.dashboard-hero__stats {
  display: grid;
  gap: 12px;
}

.hero-stat-card {
  padding: 18px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.07);
}

.hero-stat-card__label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.56);
  margin-bottom: 8px;
}

.hero-stat-card__value {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  line-height: 1.1;
}

.hero-stat-card__hint {
  margin-top: 8px;
  color: rgba(255, 255, 255, 0.68);
  line-height: 1.5;
  font-size: 13px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 16px;
}

.dashboard-hockey-card {
  grid-column: span 12;
  height: 100%;
  :deep(.section-card){
    height: 100%;
  }
}

.dashboard-card {
  grid-column: span 4;
  padding: 20px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.03)),
  rgba(255, 255, 255, 0.03);
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.18);
}

.dashboard-card--feature {
  grid-column: span 8;
}

.dashboard-card--wide {
  grid-column: span 12;
}

.dashboard-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.dashboard-card__eyebrow {
  margin-bottom: 6px;
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(236, 72, 153, 0.84);
}

.dashboard-card__title {
  margin: 0;
  font-size: 24px;
  line-height: 1.1;
  color: #fff;
}

.dashboard-link-button {
  min-height: 36px;
  padding: 0 12px;
  border-radius: 12px;
  border: 0;
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
}

.worklog-summary {
  display: grid;
  gap: 18px;
}

.worklog-summary__main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 18px;
  border-radius: 20px;
  background: radial-gradient(circle at top left, rgba(236, 72, 153, 0.14), transparent 34%),
  rgba(255, 255, 255, 0.04);
}

.worklog-summary__big {
  font-size: clamp(38px, 4vw, 56px);
  font-weight: 800;
  line-height: 1;
  color: #fff;
  flex-shrink: 0;
}

.worklog-summary__text {
  color: rgba(255, 255, 255, 0.76);
  line-height: 1.6;
}

.worklog-summary__text p {
  margin: 0;
}

.worklog-summary__text p + p {
  margin-top: 8px;
}

.worklog-summary__meta {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.mini-stat {
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
}

.mini-stat__label {
  display: block;
  margin-bottom: 8px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.56);
}

.mini-stat__value {
  display: block;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
}

.mini-stat__value--truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.week-chart {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  align-items: end;
  gap: 10px;
  min-height: 220px;
}

.week-chart__item {
  display: grid;
  justify-items: center;
  gap: 8px;
}

.week-chart__bar-wrap {
  width: 100%;
  height: 150px;
  display: flex;
  align-items: end;
}

.week-chart__bar {
  width: 100%;
  border-radius: 14px 14px 10px 10px;
  background: linear-gradient(180deg, rgba(236, 72, 153, 0.88), rgba(139, 92, 246, 0.78));
  box-shadow: 0 10px 24px rgba(139, 92, 246, 0.2);
  min-height: 10%;
}

.week-chart__label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.62);
}

.week-chart__value {
  font-size: 13px;
  font-weight: 700;
  color: #fff;
}

.action-list {
  display: grid;
  gap: 12px;
}

.action-tile {
  width: 100%;
  padding: 16px;
  border: 0;
  border-radius: 18px;
  text-align: left;
  cursor: pointer;
  color: #fff;
  transition: transform 0.2s ease,
  box-shadow 0.2s ease;
}

.action-tile:hover {
  transform: translateY(-1px);
}

.action-tile__title {
  display: block;
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 6px;
}

.action-tile__text {
  display: block;
  font-size: 13px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.76);
}

.action-tile--worklog {
  background: radial-gradient(circle at top left, rgba(236, 72, 153, 0.16), transparent 34%),
  rgba(255, 255, 255, 0.05);
}

.action-tile--countdowns {
  background: radial-gradient(circle at top left, rgba(139, 92, 246, 0.16), transparent 34%),
  rgba(255, 255, 255, 0.05);
}

.action-tile--vacation {
  background: radial-gradient(circle at top left, rgba(34, 197, 94, 0.14), transparent 34%),
  rgba(255, 255, 255, 0.05);
}

.action-tile--weather {
  background: radial-gradient(circle at top left, rgba(6, 182, 212, 0.16), transparent 34%),
  rgba(255, 255, 255, 0.05);
}

.project-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.project-pill {
  display: inline-flex;
  align-items: center;
  min-height: 36px;
  padding: 0 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
}

.dashboard-empty {
  color: rgba(255, 255, 255, 0.68);
  line-height: 1.6;
}

.shortcut-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 12px;
}

.shortcut-card {
  padding: 16px;
  border-radius: 20px;
  border: 0;
  text-align: left;
  cursor: pointer;
  color: #fff;
  transition: transform 0.25s ease,
  box-shadow 0.25s ease;
}

.shortcut-card:hover {
  transform: translateY(-2px);
}

.shortcut-card__title {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 8px;
}

.shortcut-card__text {
  min-height: 42px;
  font-size: 13px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.76);
}

.shortcut-card__footer {
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 600;
}

.shortcut-card--locked {
  opacity: 0.72;
}

.shortcut-card--worklog {
  background: radial-gradient(circle at top left, rgba(236, 72, 153, 0.18), transparent 34%),
  rgba(255, 255, 255, 0.05);
}

.shortcut-card--weather {
  background: radial-gradient(circle at top left, rgba(6, 182, 212, 0.18), transparent 34%),
  rgba(255, 255, 255, 0.05);
}

.shortcut-card--countdowns {
  background: radial-gradient(circle at top left, rgba(139, 92, 246, 0.18), transparent 34%),
  rgba(255, 255, 255, 0.05);
}

.shortcut-card--workspace {
  background: radial-gradient(circle at top left, rgba(168, 85, 247, 0.18), transparent 34%),
  rgba(255, 255, 255, 0.05);
}

.shortcut-card--hockey {
  background: radial-gradient(circle at top left, rgba(59, 130, 246, 0.18), transparent 34%),
  rgba(255, 255, 255, 0.05);
}

.shortcut-card--vacation {
  background: radial-gradient(circle at top left, rgba(34, 197, 94, 0.16), transparent 34%),
  rgba(255, 255, 255, 0.05);
}

@media (max-width: 1180px) {
  .dashboard-hero {
    grid-template-columns: 1fr;
  }

  .dashboard-hockey-card{
    grid-column: span 12;
  }
  .dashboard-card {
    grid-column: span 6;
  }

  .dashboard-hockey-card--feature,
  .dashboard-card--feature,
  .dashboard-card--wide {
    grid-column: span 12;
  }

  .shortcut-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .worklog-summary__meta {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .dashboard-page {
    gap: 16px;
  }

  .dashboard-hero {
    padding: 22px 20px;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-hockey-card,
  .dashboard-card,
  .dashboard-card--feature,
  .dashboard-card--wide {
    grid-column: auto;
  }

  .shortcut-grid {
    grid-template-columns: 1fr;
  }

  .week-chart {
    min-height: 180px;
  }

  .week-chart__bar-wrap {
    height: 110px;
  }

  .worklog-summary__main {
    flex-direction: column;
    align-items: flex-start;
  }

  .worklog-summary__meta {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .dashboard-card {
    padding: 16px;
    border-radius: 20px;
  }

  .dashboard-card__title {
    font-size: 22px;
  }

  .dashboard-hero__title {
    font-size: 28px;
  }

  .hero-stat-card__value {
    font-size: 24px;
  }
}
</style>