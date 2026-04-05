<template>
  <section class="panel">
    <div class="panel__header">
      <div class="panel__title-row">
        <h2 class="panel__title">Режим активности</h2>

        <ActivityComfortTooltip :activity-mode="currentMode" />
      </div>

      <p class="panel__text">
        Подстроим интерпретацию погоды под твой сценарий.
      </p>
    </div>

    <div class="mode-switch">
      <button
          v-for="mode in modes"
          :key="mode.value"
          type="button"
          class="mode-pill"
          :class="{ 'mode-pill--active': mode.value === currentMode }"
          @click="weatherStore.setActivityMode(mode.value)"
      >
        {{ mode.label }}
      </button>
    </div>

    <div
        v-if="comfortScore > 0"
        class="score-ring score-ring--enter"
    >
      <VChart
          class="score-ring__chart"
          :option="scoreRingOption"
          autoresize
      />

      <div class="score-ring__center">
        <div class="score-ring__value">{{ comfortScore }}</div>
        <div class="score-ring__label">{{ comfortLabel }}</div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'

import ActivityComfortTooltip from './ActivityComfortTooltip.vue'
import { useWeatherStore} from "../store/weather.ts";
import type { ActivityMode} from "../types.ts";

const weatherStore = useWeatherStore()

const modes: Array<{ value: ActivityMode; label: string }> = [
  { value: 'walk', label: 'Прогулка' },
  { value: 'run', label: 'Пробежка' },
  { value: 'travel', label: 'Поездка' },
  { value: 'remote-work', label: 'Удалённая работа' },
  { value: 'family', label: 'Семейный отдых' },
]

const currentMode = computed(() => weatherStore.activityMode)
const comfortScore = computed(() => weatherStore.comfortScore)
const comfortLabel = computed(() => weatherStore.comfortLabel)

const ringColor = computed(() => {
  if (comfortScore.value >= 85) {
    return ['#22c55e', '#4ade80']
  }

  if (comfortScore.value >= 70) {
    return ['#84cc16', '#bef264']
  }

  if (comfortScore.value >= 50) {
    return ['#f59e0b', '#fbbf24']
  }

  return ['#ef4444', '#f87171']
})

const scoreRingOption = computed(() => {
  const [startColor, endColor] = ringColor.value
  const score = comfortScore.value
  const rest = Math.max(0, 100 - score)

  return {
    animationDuration: 250,
    animationEasing: 'cubicOut',
    tooltip: { show: false },
    series: [
      {
        type: 'pie',
        radius: ['78%', '92%'],
        center: ['50%', '50%'],
        startAngle: 90,
        silent: true,
        label: { show: false },
        labelLine: { show: false },
        data: [
          {
            value: score,
            itemStyle: {
              borderRadius: 12,
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 1,
                colorStops: [
                  { offset: 0, color: startColor },
                  { offset: 1, color: endColor },
                ],
              },
              shadowBlur: 14,
              shadowColor: startColor,
            },
          },
          {
            value: rest,
            itemStyle: {
              color: 'rgba(255,255,255,0.08)',
            },
          },
        ],
      },
    ],
  }
})
</script>

<style lang="scss">
.panel__title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.score-ring {
  margin: 24px auto 0;
  position: relative;
  width: 160px;
  height: 160px;
  flex-shrink: 0;

  &--enter {
    animation: scoreRingPop 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  &__chart {
    width: 100%;
    height: 100%;
  }

  &__center {
    position: absolute;
    inset: 18px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    border-radius: 50%;
    text-align: center;
    background:
        radial-gradient(circle at top, rgba(255, 255, 255, 0.14), transparent 55%),
        linear-gradient(180deg, #0f172a 0%, #111827 100%);
    box-shadow:
        inset 0 1px 1px rgba(255, 255, 255, 0.08),
        0 10px 30px rgba(0, 0, 0, 0.22);
    pointer-events: none;
    animation: scoreCenterGlow 0.3s ease both;
  }

  &__value {
    font-size: 34px;
    font-weight: 800;
    line-height: 1;
    color: #ffffff;
    animation: scoreValueRise 0.3s ease both;
  }

  &__label {
    font-size: 12px;
    line-height: 1.2;
    color: rgba(255, 255, 255, 0.72);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    animation: scoreLabelFade 0.3s ease both;
  }
}

@keyframes scoreRingPop {
  from {
    opacity: 0;
    transform: scale(0.92);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes scoreCenterGlow {
  from {
    opacity: 0;
    transform: scale(0.94);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes scoreValueRise {
  from {
    opacity: 0;
    transform: translateY(4px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scoreLabelFade {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>