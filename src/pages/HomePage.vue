<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import CountdownModulePreview from '../components/preview/CountdownModulePreview.vue'
import WeatherModulePreview from '../modules/weather/components/WeatherModulePreview.vue'
import { usePreferencesStore } from '../stores/preferences.ts'
import { useAuthStore } from '../stores/auth.ts'

const router = useRouter()
const preferencesStore = usePreferencesStore()
const authStore = useAuthStore()

const isAuthorized = computed(() => Boolean(authStore.user))

const modules = computed(() => [
  {
    title: 'Таймеры',
    description: 'Создавай, отслеживай и управляй обратными отсчётами в одном месте',
    route: '/countdowns',
    theme: 'countdowns',
    enabled: preferencesStore.isModuleEnabled('countdown'),
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

.module-card--locked {
  cursor: default;
}

.module-card--locked:hover {
  transform: none;
}

.module-card__preview {
  position: relative;
  z-index: 1;
  min-height: 230px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.module-card__content {
  position: relative;
  z-index: 1;
}

.module-card__title {
  margin: 0 0 10px;
  font-size: 26px;
  font-weight: 700;
}

.module-card__description {
  margin: 0;
  max-width: 500px;
  font-size: 15px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.72);
}

.module-card__overlay {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(7, 11, 22, 0.38);
}

.module-card__overlay::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
          180deg,
          rgba(255, 255, 255, 0.03) 0%,
          rgba(255, 255, 255, 0.01) 100%
  );
  pointer-events: none;
}

.module-card__overlay-content {
  position: relative;
  z-index: 1;
  max-width: 300px;
  text-align: center;
}

.module-card__overlay-label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  padding: 0 10px;
  margin-bottom: 14px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.62);
}

.module-card__overlay-title {
  margin-bottom: 10px;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.2;
  color: #ffffff;
}

.module-card__overlay-description {
  font-size: 14px;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 900px) {
  .modules-grid {
    grid-template-columns: 1fr;
  }

  .module-card {
    min-height: 380px;
  }
}

@media (max-width: 640px) {
  .home__title {
    font-size: 28px;
  }

  .module-card {
    min-height: auto;
    padding: 20px;
    border-radius: 24px;
  }

  .module-card__title {
    font-size: 22px;
  }

  .module-card__overlay {
    padding: 20px;
  }

  .module-card__overlay-title {
    font-size: 20px;
  }

  .module-card__overlay-description {
    font-size: 13px;
  }
}
</style>