<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import CountdownModulePreview from '../components/preview/CountdownModulePreview.vue'
import WeatherModulePreview from '../modules/weather/components/WeatherModulePreview.vue'
import { usePreferencesStore } from '../stores/preferences.ts'

const router = useRouter()
const preferencesStore = usePreferencesStore()

type ModuleCardTheme = 'countdowns' | 'weather'

interface ModuleCard {
  title: string
  description: string
  route: string
  theme: ModuleCardTheme
  enabled: boolean
}

const modules = computed<ModuleCard[]>(() => [
  {
    title: 'Таймеры',
    description: 'Создавай, отслеживай и управляй обратными отсчётами в одном месте',
    route: '/countdowns',
    theme: 'countdowns',
    enabled: preferencesStore.isModuleEnabled('countdown'),
  },
  {
    title: 'Погода',
    description: 'Смотри прогноз, комфорт и рекомендации для прогулок и поездок',
    route: '/weather',
    theme: 'weather',
    enabled: true,
  },
].filter((module) => module.enabled))

function goTo(route: string) {
  router.push(route)
}

onMounted(async () => {
  if (!preferencesStore.initialized) {
    await preferencesStore.loadSettings()
  }
})
</script>

<template>
  <div class="home">
    <div class="home__header">
      <h1 class="home__title">Модули приложения</h1>
      <p class="home__subtitle">
        Выберите раздел, с которым хотите работать
      </p>
    </div>

    <div
        v-if="preferencesStore.loading"
        class="modules-grid"
    >
      <article
          v-for="index in 2"
          :key="index"
          class="module-card module-card--skeleton"
      >
        <div class="module-card__preview module-card__preview--skeleton">
          <div class="skeleton skeleton--preview" />
        </div>

        <div class="module-card__content">
          <div class="skeleton skeleton--title" />
          <div class="skeleton skeleton--description" />
          <div class="skeleton skeleton--description skeleton--description-short" />
        </div>
      </article>
    </div>

    <div
        v-else
        class="modules-grid"
    >
      <article
          v-for="module in modules"
          :key="module.route"
          class="module-card"
          :class="`module-card--${module.theme}`"
          @click="goTo(module.route)"
      >
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
  margin: 0 0 18px;
  max-width: 500px;
  font-size: 15px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.72);
}

.module-card--skeleton {
  cursor: default;
  pointer-events: none;
  background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.025), rgba(255, 255, 255, 0.012)),
      rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);

  &:hover {
    transform: none;
    box-shadow: none;
  }
}

.module-card__preview--skeleton {
  align-items: stretch;
}

.skeleton {
  position: relative;
  overflow: hidden;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.06);
}

.skeleton::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
          100deg,
          transparent 20%,
          rgba(255, 255, 255, 0.12) 40%,
          transparent 60%
  );
  animation: skeleton-shimmer 1.2s ease-in-out infinite;
}

.skeleton--preview {
  width: 100%;
  min-height: 230px;
  border-radius: 22px;
}

.skeleton--title {
  width: 220px;
  height: 28px;
  margin-bottom: 14px;
  border-radius: 10px;
}

.skeleton--description {
  width: 100%;
  max-width: 420px;
  height: 14px;
  margin-bottom: 10px;
}

.skeleton--description-short {
  max-width: 300px;
}

@keyframes skeleton-shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
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

  .skeleton--preview {
    min-height: 180px;
  }

  .skeleton--title {
    width: 180px;
    height: 24px;
  }
}
</style>