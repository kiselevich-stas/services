<template>
  <section class="panel weather-card" :style="temperatureGlowStyle">
    <Transition name="weather-card-fade" mode="out-in">
      <div
          v-if="weather && cityName"
          :key="`${cityName}-${weather.temperature}-${weather.weatherCode}`"
          class="weather-card__content"
      >
        <div class="weather-card__top">
          <div class="weather-card__hero">
            <p class="weather-card__place">{{ cityName }}</p>
            <h2 class="weather-card__temp">{{ weather.temperature }}°</h2>
            <p class="weather-card__desc">{{ weatherLabel }}</p>
            <p class="weather-card__feels">Ощущается как {{ weather.feelsLike }}°</p>
          </div>
          <WeatherIcon size="md" :icon="weatherIcon" />

        </div>

        <div class="metric-grid">
          <div class="metric-box" style="--delay: 0.08s">
            <span>Ветер</span>
            <strong>{{ weather.windSpeed }} км/ч</strong>
          </div>
          <div class="metric-box" style="--delay: 0.14s">
            <span>Влажность</span>
            <strong>{{ weather.humidity }}%</strong>
          </div>
          <div class="metric-box" style="--delay: 0.2s">
            <span>Осадки</span>
            <strong>{{ weather.precipitationProbability }}%</strong>
          </div>
          <div class="metric-box" style="--delay: 0.26s">
            <span>Air Quality</span>
            <strong>{{ weather.airQuality }}</strong>
          </div>
          <div class="metric-box" style="--delay: 0.32s">
            <span>UV</span>
            <strong>{{ weather.uvIndex }}</strong>
          </div>
        </div>
      </div>
    </Transition>
    <WeatherTemperatureChart v-if="weatherStore.hourlyForecast.length"/>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWeatherStore} from "../store/weather.ts";
import { getWeatherCodeLabel} from "../utils/weatherCode.ts";
import WeatherTemperatureChart from "./WeatherTemperatureChart.vue";

import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import { GraphicComponent, TooltipComponent } from 'echarts/components'
import WeatherIcon from "./WeatherIcon.vue";
import { getWeatherCodeIcon } from "../utils/weatherIcon.ts";

use([
  CanvasRenderer,
  PieChart,
  GraphicComponent,
  TooltipComponent
])

const weatherStore = useWeatherStore()

const weather = computed(() => weatherStore.weather)
const cityName = computed(() => weatherStore.selectedCity?.name)


const weatherLabel = computed(() => {
  if (!weather.value) return ''
  return getWeatherCodeLabel(weather.value.weatherCode)
})

const temperatureGlowStyle = computed(() => {
  const temp = weather.value?.temperature ?? 0

  const clamp = (value: number, min: number, max: number) =>
      Math.min(max, Math.max(min, value))

  const coldMin = -25
  const coldMax = 10
  const warmMin = 10
  const warmMax = 40

  let hue = 210
  let saturation = 90
  let lightness = 65
  let alpha = 0.22
  let size = 240

  if (temp <= 10) {
    const t = clamp((temp - coldMin) / (coldMax - coldMin), 0, 1)
    // синий -> голубой, но не до зелёного
    hue = 220 - t * 30 // 220 -> 190
    saturation = 85
    lightness = 68
  } else {
    const t = clamp((temp - warmMin) / (warmMax - warmMin), 0, 1)
    // тёплый светлый -> жёлтый -> оранжевый
    hue = 55 - t * 20 // 55 -> 35
    saturation = 95
    lightness = 68
  }

  return {
    '--temp-glow-color': `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`,
    '--temp-glow-size': `${size}px`,
  }
})

const weatherIcon = computed(() => {
  if (!weather.value) return null
  return getWeatherCodeIcon(weather.value.weatherCode)
})

</script>
<style lang="scss">
.weather-card {
  overflow: hidden;

  &::before,
  &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }

  &::before {
    top: -90px;
    right: -70px;
    width: calc(var(--temp-glow-size, 240px) * 1.15);
    height: calc(var(--temp-glow-size, 240px) * 1.15);
    background: var(--temp-glow-color, hsla(220, 90%, 65%, 0.12));
    filter: blur(60px);
  }

  &::after {
    top: -70px;
    right: -50px;
    width: var(--temp-glow-size, 240px);
    height: var(--temp-glow-size, 240px);
    background: var(--temp-glow-color, hsla(220, 90%, 65%, 0.22));
    filter: blur(36px);
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }

  &__hero {
    animation: weatherHeroSlide 0.3s ease both;
  }

  &__place {
    margin: 0 0 8px;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.72);
  }

  &__temp {
    margin: 0;
    font-size: 56px;
    line-height: 1;
    font-weight: 700;
  }

  &__desc {
    margin: 8px 0 4px;
    font-size: 16px;
    font-weight: 500;
  }

  &__feels {
    margin: 0;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
  }
}



.metric-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.metric-box {
  --delay: 0s;

  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.06);

  display: flex;
  flex-direction: column;
  gap: 6px;

  opacity: 0;
  transform: translateY(18px) scale(0.96);
  animation: metricBoxIn 0.3s ease forwards;
  animation-delay: var(--delay);

  span {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.68);
  }

  strong {
    font-size: 16px;
    color: #fff;
  }
}

/* transition для всей карточки */
.weather-card-fade-enter-active,
.weather-card-fade-leave-active {
  transition:
      opacity 0.45s ease,
      transform 0.45s ease,
      filter 0.45s ease;
}

.weather-card-fade-enter-from,
.weather-card-fade-leave-to {
  opacity: 0;
  transform: translateY(18px) scale(0.98);
  filter: blur(8px);
}

.weather-card-fade-enter-to,
.weather-card-fade-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0);
}

/* keyframes */
@keyframes weatherHeroSlide {
  from {
    opacity: 0;
    transform: translateY(20px) translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0) translateX(0);
  }
}

@keyframes scoreRingPop {
  0% {
    opacity: 0;
    transform: scale(0.72) rotate(-10deg);
    filter: blur(8px);
  }
  60% {
    opacity: 1;
    transform: scale(1.05) rotate(2deg);
    filter: blur(0);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0);
    filter: blur(0);
  }
}

@keyframes scoreCenterGlow {
  0% {
    box-shadow:
        inset 0 1px 1px rgba(255, 255, 255, 0.04),
        0 0 0 rgba(0, 0, 0, 0);
  }
  100% {
    box-shadow:
        inset 0 1px 1px rgba(255, 255, 255, 0.08),
        0 10px 30px rgba(0, 0, 0, 0.22);
  }
}

@keyframes scoreValueRise {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes scoreLabelFade {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes metricBoxIn {
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}


.weather-card__empty{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  min-height: 220px;
  text-align: center;
  img{
    width: 100%;
    max-width: 360px;
  }
}
</style>