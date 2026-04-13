<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import CountdownModulePreview from '../components/preview/CountdownModulePreview.vue'
import WorkspaceModulePreview from '../components/preview/WorkspaceModulePreview.vue'
import WeatherModulePreview from "../components/preview/WeatherModulePreview.vue";
import WorklogModulePreview from "../components/preview/WorklogModulePreview.vue";
import HockeyModulePreview from '../components/preview/HockeyModulePreview.vue'
import { usePreferencesStore } from '../stores/preferences.ts'
import { useAuthStore } from '../stores/auth.ts'
import VacationModulePreview from "../components/preview/VacationModulePreview.vue";

const router = useRouter()
const preferencesStore = usePreferencesStore()
const authStore = useAuthStore()

const isAuthorized = computed(() => Boolean(authStore.user))

const modules = computed(() => [
  {
    title: 'Учет времени',
    description: 'Фиксируй рабочие часы, анализируй нагрузку и смотри красивую статистику по проектам',
    route: '/worklog',
    theme: 'worklog',
    enabled: preferencesStore.isModuleEnabled('worklog'),
    requiresAuth: true,
  },
  {
    title: 'Планировщик отпуска',
    description: 'Маршрут по дням, точки на карте, чеклист документов и билетов в одном красивом модуле',
    route: '/vacation',
    theme: 'vacation',
    enabled: true,
    requiresAuth: true,
  },
  {
    title: 'Таймеры',
    description: 'Создавай, отслеживай и управляй обратными отсчётами в одном месте',
    route: '/countdowns',
    theme: 'countdowns',
    enabled: preferencesStore.isModuleEnabled('countdown'),
    requiresAuth: true,
  },
  {
    title: 'Рабочее пространство',
    description: 'Управляй личными данными, настройками и быстрым доступом к своим возможностям',
    route: '/spaces',
    theme: 'workspace',
    enabled: preferencesStore.isModuleEnabled('workspace'),
    requiresAuth: true,
  },
  {
    title: 'Погода',
    description: 'Смотри прогноз, комфорт и рекомендации для прогулок и поездок',
    route: '/weather',
    theme: 'weather',
    enabled: true,
    requiresAuth: false,
  },
  {
    title: 'KHL Head-to-Head',
    description: 'Сравнивай команды, смотри личные встречи, победы, шайбы и последние матчи',
    route: '/hockey',
    theme: 'hockey',
    enabled: true,
    requiresAuth: false,
  },
].filter(module => module.enabled))

function goTo(route: string, requiresAuth: boolean) {
  if (requiresAuth && !isAuthorized.value) {
    return
  }

  router.push(route)
}
</script>

<template>
  <div class="home">
    <div class="home__header">
      <h1 class="home__title">Модули приложения</h1>
      <p class="home__subtitle">
        Выберите раздел, с которым хотите работать
      </p>
    </div>

    <div class="modules-grid">
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
        </div>

        <div
            v-if="module.requiresAuth && !isAuthorized"
            class="module-card__overlay"
        >
          <div class="module-card__overlay-content">
            <div class="module-card__overlay-label">
              Ограниченный доступ
            </div>

            <div class="module-card__overlay-title">
              Требуется авторизация
            </div>

            <div class="module-card__overlay-description">
              Авторизуйтесь, чтобы получить доступ к этому модулю.
            </div>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped lang="scss">
.home {
  margin: 0 auto;
}

.home__header {
  margin-bottom: 36px;
}

.home__title {
  margin: 0 0 8px;
  font-size: 34px;
  font-weight: 700;
  line-height: 1.1;
}

.home__subtitle {
  margin: 0;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.64);
}

.modules-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.module-card {
  position: relative;
  overflow: hidden;
  min-height: 420px;
  border-radius: 28px;
  padding: 24px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  transition:
      transform 0.35s ease,
      box-shadow 0.35s ease,
      border-color 0.35s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 24px;

  &:hover {
    transform: translateY(-8px);
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0.9;
    pointer-events: none;
  }
}

.module-card__inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 24px;
  width: 100%;
  height: 100%;
  transition:
      filter 0.3s ease,
      transform 0.3s ease,
      opacity 0.3s ease;
}

.module-card--locked .module-card__inner {
  filter: blur(10px);
  transform: scale(1.01);
  pointer-events: none;
  user-select: none;
}

.module-card--countdowns {
  background:
      radial-gradient(circle at top left, rgba(139, 92, 246, 0.24), transparent 34%),
      radial-gradient(circle at bottom right, rgba(59, 130, 246, 0.18), transparent 36%),
      rgba(255, 255, 255, 0.04);

  &:hover {
    border-color: rgba(139, 92, 246, 0.4);
    box-shadow: 0 18px 45px rgba(139, 92, 246, 0.16);
  }
}

.module-card--weather {
  background:
      radial-gradient(circle at top right, rgba(56, 189, 248, 0.22), transparent 34%),
      radial-gradient(circle at bottom left, rgba(14, 165, 233, 0.16), transparent 38%),
      rgba(255, 255, 255, 0.04);

  &:hover {
    border-color: rgba(56, 189, 248, 0.38);
    box-shadow: 0 18px 45px rgba(56, 189, 248, 0.14);
  }
}

.module-card--hockey {
  background:
      radial-gradient(circle at 12% 16%, rgba(34, 211, 238, 0.18), transparent 26%),
      radial-gradient(circle at 82% 18%, rgba(236, 72, 153, 0.18), transparent 28%),
      radial-gradient(circle at 70% 85%, rgba(59, 130, 246, 0.16), transparent 34%),
      rgba(255, 255, 255, 0.04);

  &:hover {
    border-color: rgba(34, 211, 238, 0.35);
    box-shadow: 0 18px 45px rgba(59, 130, 246, 0.16);
  }
}

.module-card--workspace {
  background:
      radial-gradient(circle at 18% 18%, rgba(244, 114, 182, 0.22), transparent 28%),
      radial-gradient(circle at 80% 22%, rgba(168, 85, 247, 0.20), transparent 32%),
      radial-gradient(circle at 70% 85%, rgba(59, 130, 246, 0.16), transparent 36%),
      rgba(255, 255, 255, 0.04);

  &:hover {
    border-color: rgba(192, 132, 252, 0.4);
    box-shadow: 0 18px 45px rgba(168, 85, 247, 0.18);
  }
}
.module-card--worklog {
  background:
      radial-gradient(circle at 18% 18%, rgba(236, 72, 153, 0.22), transparent 28%),
      radial-gradient(circle at 80% 22%, rgba(139, 92, 246, 0.2), transparent 32%),
      radial-gradient(circle at 72% 84%, rgba(6, 182, 212, 0.16), transparent 36%),
      rgba(255, 255, 255, 0.04);

  &:hover {
    border-color: rgba(236, 72, 153, 0.38);
    box-shadow: 0 18px 45px rgba(139, 92, 246, 0.18);
  }
}
.module-card--locked {
  cursor: default;
}

.module-card--locked:hover {
  transform: none;
}

.module-card__title {
  margin: 0 0 12px;
  font-size: 28px;
}

.module-card__description {
  margin: 0;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.72);
}

.module-card__overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 24px;
  z-index: 2;
  background: rgba(7, 17, 31, 0.38);
  backdrop-filter: blur(6px);
}

.module-card__overlay-content {
  max-width: 280px;
  text-align: center;
}

.module-card__overlay-label {
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.58);
  margin-bottom: 12px;
}

.module-card__overlay-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 10px;
}

.module-card__overlay-description {
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.55;
}

@media (max-width: 980px) {
  .modules-grid {
    grid-template-columns: 1fr;
  }
}
.module-card--vacation {
  background:
      radial-gradient(circle at 16% 18%, rgba(236, 72, 153, 0.2), transparent 28%),
      radial-gradient(circle at 82% 18%, rgba(6, 182, 212, 0.18), transparent 32%),
      radial-gradient(circle at 72% 84%, rgba(34, 197, 94, 0.14), transparent 34%),
      rgba(255, 255, 255, 0.04);

  &:hover {
    border-color: rgba(236, 72, 153, 0.36);
    box-shadow: 0 18px 45px rgba(139, 92, 246, 0.18);
  }
}
</style>
