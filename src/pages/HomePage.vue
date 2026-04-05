<script setup lang="ts">
import { useRouter } from 'vue-router'

import CountdownModulePreview from "../components/preview/CountdownModulePreview.vue";
import WeatherModulePreview from "../modules/weather/components/WeatherModulePreview.vue";

const router = useRouter()

type ModuleCard = {
  title: string
  description: string
  route: string
  theme: 'countdowns' | 'weather'
}

const modules: ModuleCard[] = [
  {
    title: 'Таймеры',
    description: 'Создавай, отслеживай и управляй обратными отсчётами в одном месте',
    route: '/countdowns',
    theme: 'countdowns',
  },
  {
    title: 'Погода',
    description: 'Смотри прогноз, комфорт и рекомендации для прогулок и поездок',
    route: '/weather',
    theme: 'weather',
  },
]

function goTo(route: string) {
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
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
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

.module-card__action {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
}

.arrow {
  transition: transform 0.25s ease;
}

.module-card:hover .arrow {
  transform: translateX(4px);
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
}
</style>