<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import CountdownModulePreview from '../components/preview/CountdownModulePreview.vue'
import WorkspaceModulePreview from '../components/preview/WorkspaceModulePreview.vue'
import WeatherModulePreview from '../components/preview/WeatherModulePreview.vue'
import WorklogModulePreview from '../components/preview/WorklogModulePreview.vue'
import HockeyModulePreview from '../components/preview/HockeyModulePreview.vue'
import VacationModulePreview from '../components/preview/VacationModulePreview.vue'

import { usePreferencesStore } from '../stores/preferences.ts'
import { useAuthStore } from '../stores/auth.ts'

interface ModuleCard {
  title: string
  description: string
  route: string
  theme: string
  enabled: boolean
  requiresAuth: boolean
  badge: string
}

const router = useRouter()
const preferencesStore = usePreferencesStore()
const authStore = useAuthStore()

const isAuthorized = computed(() => Boolean(authStore.user))

const modules = computed<ModuleCard[]>(() => {
  return [
    {
      title: 'Учет времени',
      description: 'Часы, нагрузка и статистика по проектам.',
      route: '/worklog',
      theme: 'worklog',
      enabled: preferencesStore.isModuleEnabled('worklog'),
      requiresAuth: true,
      badge: 'Работа',
    },
    {
      title: 'Планировщик отпуска',
      description: 'Маршрут, места, чеклисты и билеты.',
      route: '/vacation',
      theme: 'vacation',
      enabled: true,
      requiresAuth: true,
      badge: 'Поездки',
    },
    {
      title: 'Таймеры',
      description: 'Все обратные отсчёты в одном месте.',
      route: '/countdowns',
      theme: 'countdowns',
      enabled: preferencesStore.isModuleEnabled('countdown'),
      requiresAuth: true,
      badge: 'Личное',
    },
    {
      title: 'Рабочее пространство',
      description: 'Профиль, настройки и быстрый доступ.',
      route: '/spaces',
      theme: 'workspace',
      enabled: preferencesStore.isModuleEnabled('workspace'),
      requiresAuth: true,
      badge: 'Профиль',
    },
    {
      title: 'Погода',
      description: 'Прогноз и рекомендации на день.',
      route: '/weather',
      theme: 'weather',
      enabled: true,
      requiresAuth: false,
      badge: 'Открытый',
    },
    {
      title: 'KHL Head-to-Head',
      description: 'Сравнение команд и последние матчи.',
      route: '/hockey',
      theme: 'hockey',
      enabled: true,
      requiresAuth: false,
      badge: 'Спорт',
    },
  ].filter((module) => module.enabled)
})

function goTo(route: string, requiresAuth: boolean): void {
  if (requiresAuth && !isAuthorized.value) {
    return
  }

  router.push(route)
}
</script>

<template>
  <div class="home">
    <section class="home-hero">
      <div class="home-hero__content">
        <div class="home-hero__badge">Dashboard</div>

        <h1 class="home-hero__title">
          Модули приложения
        </h1>

        <p class="home-hero__subtitle">
          Выберите нужный раздел и переходите к работе.
        </p>
      </div>
    </section>

    <section class="modules-grid">
      <article
          v-for="module in modules"
          :key="module.route"
          class="module-card"
          :class="[
          `module-card--${module.theme}`,
          {
            'module-card--locked': module.requiresAuth && !isAuthorized,
          },
        ]"
          @click="goTo(module.route, module.requiresAuth)"
      >
        <div class="module-card__inner">
          <div class="module-card__head">
            <span class="module-card__badge">
              {{ module.badge }}
            </span>

            <span
                v-if="module.requiresAuth"
                class="module-card__status"
            >
              {{ isAuthorized ? 'Доступен' : 'Вход нужен' }}
            </span>
          </div>

          <div class="module-card__preview">
            <CountdownModulePreview v-if="module.theme === 'countdowns'" />
            <WeatherModulePreview v-else-if="module.theme === 'weather'" />
            <WorkspaceModulePreview v-else-if="module.theme === 'workspace'" />
            <HockeyModulePreview v-else-if="module.theme === 'hockey'" />
            <WorklogModulePreview v-else-if="module.theme === 'worklog'" />
            <VacationModulePreview v-else-if="module.theme === 'vacation'" />
          </div>

          <div class="module-card__content">
            <h2 class="module-card__title">
              {{ module.title }}
            </h2>

            <p class="module-card__description">
              {{ module.description }}
            </p>
          </div>

          <div class="module-card__footer">
            <span class="module-card__action">
              {{ module.requiresAuth && !isAuthorized ? 'Требуется авторизация' : 'Открыть модуль' }}
            </span>

            <span class="module-card__arrow">→</span>
          </div>
        </div>

        <div
            v-if="module.requiresAuth && !isAuthorized"
            class="module-card__overlay"
        >
          <div class="module-card__overlay-content">
            <div class="module-card__overlay-title">
              Требуется авторизация
            </div>

            <div class="module-card__overlay-description">
              Войдите в аккаунт, чтобы открыть модуль.
            </div>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>

<style scoped lang="scss">
.home {
  margin: 0 auto;
  display: grid;
  gap: 20px;
}

.home-hero {
  position: relative;
  overflow: hidden;
  padding: 26px 28px;
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background:
      radial-gradient(circle at top left, rgba(236, 72, 153, 0.16), transparent 28%),
      radial-gradient(circle at top right, rgba(6, 182, 212, 0.14), transparent 32%),
      linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03)),
      rgba(10, 14, 24, 0.92);
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.24);
  backdrop-filter: blur(18px);
}

.home-hero__content {
  position: relative;
  z-index: 1;
  max-width: 760px;
}

.home-hero__badge {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 12px;
  margin-bottom: 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.78);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.home-hero__title {
  margin: 0 0 8px;
  font-size: clamp(30px, 4vw, 42px);
  line-height: 1.05;
  color: #fff;
}

.home-hero__subtitle {
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.68);
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.module-card {
  position: relative;
  overflow: hidden;
  min-height: 290px;
  border-radius: 24px;
  padding: 16px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  transition:
      transform 0.3s ease,
      box-shadow 0.3s ease,
      border-color 0.3s ease;
}

.module-card:hover {
  transform: translateY(-4px);
}

.module-card__inner {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  gap: 12px;
  width: 100%;
  height: 100%;
  transition:
      filter 0.3s ease,
      transform 0.3s ease,
      opacity 0.3s ease;
}

.module-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.module-card__badge,
.module-card__status {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

.module-card__badge {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.module-card__status {
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.58);
}

.module-card__preview {
  min-height: 96px;
  padding: 8px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
}

.module-card__content {
  display: grid;
  align-content: start;
  gap: 8px;
}

.module-card__title {
  margin: 0;
  font-size: 22px;
  line-height: 1.08;
  color: #fff;
}

.module-card__description {
  margin: 0;
  font-size: 14px;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.72);
}

.module-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 2px;
}

.module-card__action {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.88);
}

.module-card__arrow {
  font-size: 18px;
  line-height: 1;
  color: rgba(255, 255, 255, 0.8);
  transition: transform 0.25s ease;
}

.module-card:hover .module-card__arrow {
  transform: translateX(3px);
}

.module-card--locked {
  cursor: default;
}

.module-card--locked:hover {
  transform: none;
}

.module-card--locked .module-card__inner {
  filter: blur(8px);
  transform: scale(1.01);
  pointer-events: none;
  user-select: none;
}

.module-card__overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 18px;
  z-index: 2;
  background: rgba(7, 17, 31, 0.32);
  backdrop-filter: blur(6px);
}

.module-card__overlay-content {
  max-width: 240px;
  text-align: center;
  padding: 18px;
  border-radius: 18px;
  background: rgba(11, 18, 32, 0.62);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.module-card__overlay-title {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
}

.module-card__overlay-description {
  font-size: 13px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.72);
}

.module-card--countdowns {
  background:
      radial-gradient(circle at top left, rgba(139, 92, 246, 0.22), transparent 34%),
      radial-gradient(circle at bottom right, rgba(59, 130, 246, 0.16), transparent 36%),
      rgba(255, 255, 255, 0.04);
}

.module-card--countdowns:hover {
  border-color: rgba(139, 92, 246, 0.34);
  box-shadow: 0 14px 34px rgba(139, 92, 246, 0.14);
}

.module-card--weather {
  background:
      radial-gradient(circle at top right, rgba(56, 189, 248, 0.2), transparent 34%),
      radial-gradient(circle at bottom left, rgba(14, 165, 233, 0.15), transparent 38%),
      rgba(255, 255, 255, 0.04);
}

.module-card--weather:hover {
  border-color: rgba(56, 189, 248, 0.34);
  box-shadow: 0 14px 34px rgba(56, 189, 248, 0.13);
}

.module-card--hockey {
  background:
      radial-gradient(circle at 12% 16%, rgba(34, 211, 238, 0.16), transparent 26%),
      radial-gradient(circle at 82% 18%, rgba(236, 72, 153, 0.16), transparent 28%),
      radial-gradient(circle at 70% 85%, rgba(59, 130, 246, 0.14), transparent 34%),
      rgba(255, 255, 255, 0.04);
}

.module-card--hockey:hover {
  border-color: rgba(34, 211, 238, 0.32);
  box-shadow: 0 14px 34px rgba(59, 130, 246, 0.14);
}

.module-card--workspace {
  background:
      radial-gradient(circle at 18% 18%, rgba(244, 114, 182, 0.2), transparent 28%),
      radial-gradient(circle at 80% 22%, rgba(168, 85, 247, 0.18), transparent 32%),
      radial-gradient(circle at 70% 85%, rgba(59, 130, 246, 0.14), transparent 36%),
      rgba(255, 255, 255, 0.04);
}

.module-card--workspace:hover {
  border-color: rgba(192, 132, 252, 0.36);
  box-shadow: 0 14px 34px rgba(168, 85, 247, 0.16);
}

.module-card--worklog {
  background:
      radial-gradient(circle at 18% 18%, rgba(236, 72, 153, 0.2), transparent 28%),
      radial-gradient(circle at 80% 22%, rgba(139, 92, 246, 0.18), transparent 32%),
      radial-gradient(circle at 72% 84%, rgba(6, 182, 212, 0.14), transparent 36%),
      rgba(255, 255, 255, 0.04);
}

.module-card--worklog:hover {
  border-color: rgba(236, 72, 153, 0.34);
  box-shadow: 0 14px 34px rgba(139, 92, 246, 0.16);
}

.module-card--vacation {
  background:
      radial-gradient(circle at 16% 18%, rgba(236, 72, 153, 0.18), transparent 28%),
      radial-gradient(circle at 82% 18%, rgba(6, 182, 212, 0.16), transparent 32%),
      radial-gradient(circle at 72% 84%, rgba(34, 197, 94, 0.12), transparent 34%),
      rgba(255, 255, 255, 0.04);
}

.module-card--vacation:hover {
  border-color: rgba(236, 72, 153, 0.32);
  box-shadow: 0 14px 34px rgba(139, 92, 246, 0.16);
}

@media (max-width: 1180px) {
  .modules-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .home {
    gap: 16px;
  }

  .home-hero {
    padding: 22px 20px;
  }

  .modules-grid {
    grid-template-columns: 1fr;
  }

  .module-card {
    min-height: 250px;
  }
}

@media (max-width: 480px) {
  .home-hero__title {
    font-size: 28px;
  }

  .module-card {
    padding: 14px;
  }

  .module-card__title {
    font-size: 20px;
  }

  .module-card__description {
    font-size: 13px;
  }
}
</style>