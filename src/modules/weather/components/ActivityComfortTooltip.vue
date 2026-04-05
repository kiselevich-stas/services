<template>
  <UiTooltip :width="360">
    <template #trigger>
      <button
          type="button"
          class="activity-comfort-tooltip__trigger"
          aria-label="Показать правила расчёта комфорта"
      >
        ?
      </button>
    </template>

    <div class="activity-comfort-tooltip">
      <p class="activity-comfort-tooltip__title">
        Как рассчитывается комфорт для режима «{{ activityLabel }}»
      </p>

      <p class="activity-comfort-tooltip__text">
        Мы оцениваем несколько погодных факторов и объединяем их в один итоговый балл.
        Для выбранного режима важность факторов отличается.
      </p>

      <div class="activity-comfort-tooltip__section">
        <div class="activity-comfort-tooltip__subtitle">Что влияет сильнее всего</div>

        <div class="activity-comfort-tooltip__weights">
          <div
              v-for="item in readableWeights"
              :key="item.key"
              class="activity-comfort-tooltip__weight-row"
          >
            <div
                class="activity-comfort-tooltip__weight-fill"
                :class="`activity-comfort-tooltip__weight-fill--${item.key}`"
                :style="{ width: item.value }"
            />

            <div class="activity-comfort-tooltip__weight-content">
              <div class="activity-comfort-tooltip__weight-label-wrap">
                <span
                    class="activity-comfort-tooltip__weight-marker"
                    :class="`activity-comfort-tooltip__weight-marker--${item.key}`"
                />
                <span class="activity-comfort-tooltip__weight-name">
                  {{ item.label }}
                </span>
              </div>

              <span class="activity-comfort-tooltip__weight-value">
                {{ item.value }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="activity-comfort-tooltip__section">
        <div class="activity-comfort-tooltip__subtitle">Формула простыми словами</div>

        <div class="activity-comfort-tooltip__formula">
          {{ readableFormula }}
        </div>
      </div>

      <div class="activity-comfort-tooltip__section">
        <div class="activity-comfort-tooltip__subtitle">Как читать итоговый балл</div>

        <div class="activity-comfort-tooltip__legend">
          <div class="activity-comfort-tooltip__legend-item">
            <span class="activity-comfort-tooltip__dot activity-comfort-tooltip__dot--green"></span>
            <span>85–100 — отлично</span>
          </div>

          <div class="activity-comfort-tooltip__legend-item">
            <span class="activity-comfort-tooltip__dot activity-comfort-tooltip__dot--lime"></span>
            <span>70–84 — хорошо</span>
          </div>

          <div class="activity-comfort-tooltip__legend-item">
            <span class="activity-comfort-tooltip__dot activity-comfort-tooltip__dot--yellow"></span>
            <span>50–69 — средне</span>
          </div>

          <div class="activity-comfort-tooltip__legend-item">
            <span class="activity-comfort-tooltip__dot activity-comfort-tooltip__dot--red"></span>
            <span>0–49 — слабо</span>
          </div>
        </div>
      </div>
    </div>
  </UiTooltip>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import UiTooltip from "../../../components/ui/UiTooltip.vue";
import type { ActivityMode} from "../types.ts";

interface WeightMap {
  feelsLike: number
  wind: number
  humidity: number
  precipitation: number
  air: number
  uv: number
}

interface ReadableWeightItem {
  key: keyof WeightMap
  label: string
  rawValue: number
  value: string
}

interface Props {
  activityMode: ActivityMode
}

const props = defineProps<Props>()

const activityConfigMap: Record<
    ActivityMode,
    {
      label: string
      weights: WeightMap
    }
> = {
  walk: {
    label: 'Прогулка',
    weights: {
      feelsLike: 0.3,
      wind: 0.2,
      humidity: 0.15,
      precipitation: 0.2,
      air: 0.1,
      uv: 0.05,
    },
  },
  run: {
    label: 'Пробежка',
    weights: {
      feelsLike: 0.25,
      wind: 0.25,
      humidity: 0.2,
      precipitation: 0.1,
      air: 0.1,
      uv: 0.1,
    },
  },
  travel: {
    label: 'Поездка',
    weights: {
      feelsLike: 0.2,
      wind: 0.1,
      humidity: 0.1,
      precipitation: 0.35,
      air: 0.15,
      uv: 0.1,
    },
  },
  'remote-work': {
    label: 'Удалённая работа',
    weights: {
      feelsLike: 0.35,
      wind: 0.05,
      humidity: 0.2,
      precipitation: 0.1,
      air: 0.2,
      uv: 0.1,
    },
  },
  family: {
    label: 'Семейный отдых',
    weights: {
      feelsLike: 0.25,
      wind: 0.15,
      humidity: 0.1,
      precipitation: 0.25,
      air: 0.15,
      uv: 0.1,
    },
  },
}

const factorLabelMap: Record<keyof WeightMap, string> = {
  feelsLike: 'Ощущаемая температура',
  wind: 'Ветер',
  humidity: 'Влажность',
  precipitation: 'Вероятность осадков',
  air: 'Качество воздуха',
  uv: 'UV-индекс',
}

const activityLabel = computed(() => {
  return activityConfigMap[props.activityMode].label
})

const weights = computed(() => {
  return activityConfigMap[props.activityMode].weights
})

const readableWeights = computed<ReadableWeightItem[]>(() => {
  return (Object.entries(weights.value) as Array<[keyof WeightMap, number]>)
      .map(([key, value]) => ({
        key,
        label: factorLabelMap[key],
        rawValue: value,
        value: `${Math.round(value * 100)}%`,
      }))
      .sort((firstItem, secondItem) => secondItem.rawValue - firstItem.rawValue)
})

const readableFormula = computed(() => {
  return readableWeights.value
      .map((item) => `${item.label} (${item.value})`)
      .join(' + ')
})
</script>

<style scoped lang="scss">
.activity-comfort-tooltip__trigger {
  width: 22px;
  height: 22px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  font-size: 13px;
  font-weight: 700;
  line-height: 1;
  color: rgba(255, 255, 255, 0.92);
  background: rgba(255, 255, 255, 0.12);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12);
  transition:
      background 0.2s ease,
      transform 0.2s ease;

  &:hover,
  &:focus-visible {
    background: rgba(255, 255, 255, 0.18);
    transform: scale(1.05);
    outline: none;
  }
}

.activity-comfort-tooltip {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.activity-comfort-tooltip__title {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
}

.activity-comfort-tooltip__text {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.82);
}

.activity-comfort-tooltip__section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.activity-comfort-tooltip__subtitle {
  font-size: 12px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.96);
}

.activity-comfort-tooltip__weights {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.activity-comfort-tooltip__weight-row {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.activity-comfort-tooltip__weight-fill {
  position: absolute;
  inset: 0 auto 0 0;
  width: 0;
  border-radius: 12px;
  opacity: 0.24;
  transition: width 0.3s ease;

  &--feelsLike {
    background: linear-gradient(90deg, #fb7185 0%, #f97316 100%);
  }

  &--wind {
    background: linear-gradient(90deg, #38bdf8 0%, #60a5fa 100%);
  }

  &--humidity {
    background: linear-gradient(90deg, #2dd4bf 0%, #14b8a6 100%);
  }

  &--precipitation {
    background: linear-gradient(90deg, #818cf8 0%, #6366f1 100%);
  }

  &--air {
    background: linear-gradient(90deg, #34d399 0%, #22c55e 100%);
  }

  &--uv {
    background: linear-gradient(90deg, #facc15 0%, #f59e0b 100%);
  }
}

.activity-comfort-tooltip__weight-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
}

.activity-comfort-tooltip__weight-label-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.activity-comfort-tooltip__weight-marker {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;

  &--feelsLike {
    background: #f97316;
  }

  &--wind {
    background: #60a5fa;
  }

  &--humidity {
    background: #14b8a6;
  }

  &--precipitation {
    background: #6366f1;
  }

  &--air {
    background: #22c55e;
  }

  &--uv {
    background: #f59e0b;
  }
}

.activity-comfort-tooltip__weight-name {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.88);
}

.activity-comfort-tooltip__weight-value {
  min-width: 38px;
  text-align: right;
  font-size: 12px;
  font-weight: 700;
  color: #ffffff;
}

.activity-comfort-tooltip__formula {
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  font-size: 12px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.88);
}

.activity-comfort-tooltip__legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.activity-comfort-tooltip__legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.82);
}

.activity-comfort-tooltip__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;

  &--green {
    background: #22c55e;
  }

  &--lime {
    background: #84cc16;
  }

  &--yellow {
    background: #f59e0b;
  }

  &--red {
    background: #ef4444;
  }
}
</style>