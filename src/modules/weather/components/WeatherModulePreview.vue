<script setup lang="ts">
import { computed, ref } from 'vue'

import { getWeatherCodeIcon } from '../utils/weatherIcon.ts'
import { formatHour } from '../utils/format.ts'
import { getWeatherCodeLabel } from '../utils/weatherCode.ts'
import WeatherIcon from './WeatherIcon.vue'

const isLoading = ref(false)
const isError = ref(false)

const city = ref({
  name: 'Санкт-Петербург',
})

const weather = ref({
  time: '2026-04-05T15:00',
  temperature: 14,
  weatherCode: 2,
})

const comfortLabel = ref('Хорошо')

const hourlyForecast = ref([
  {
    time: '2026-04-05T15:00',
    temperature: 14,
    weatherCode: 2,
  },
  {
    time: '2026-04-05T16:00',
    temperature: 15,
    weatherCode: 1,
  },
  {
    time: '2026-04-05T17:00',
    temperature: 16,
    weatherCode: 0,
  },
  {
    time: '2026-04-05T18:00',
    temperature: 15,
    weatherCode: 1,
  },
  {
    time: '2026-04-05T19:00',
    temperature: 13,
    weatherCode: 3,
  },
  {
    time: '2026-04-05T20:00',
    temperature: 12,
    weatherCode: 3,
  },
])

const cityLabel = computed(() => city.value?.name ?? 'Определяем город...')

const timeLabel = computed(() => {
  if (!weather.value?.time) return 'Загрузка времени...'
  return `Сегодня, ${formatHour(weather.value.time)}`
})

const temperatureLabel = computed(() => {
  if (typeof weather.value?.temperature !== 'number') return '--°'

  const roundedTemperature = Math.round(weather.value.temperature)

  return `${roundedTemperature > 0 ? '+' : ''}${roundedTemperature}°`
})

const weatherIcon = computed(() => {
  if (!weather.value) return null
  return getWeatherCodeIcon(weather.value.weatherCode)
})

const chartItems = computed(() => {
  const forecast = hourlyForecast.value.slice(0, 6)

  if (!forecast.length) {
    return Array.from({ length: 6 }, () => 40)
  }

  const temperatures = forecast.map((item) => Math.round(item.temperature))
  const minTemperature = Math.min(...temperatures)
  const maxTemperature = Math.max(...temperatures)

  if (minTemperature === maxTemperature) {
    return temperatures.map(() => 56)
  }

  return temperatures.map((temperature) => {
    const progress =
        (temperature - minTemperature) / (maxTemperature - minTemperature)

    return Math.round(34 + progress * 40)
  })
})

const chartLabels = computed(() => {
  const forecast = hourlyForecast.value.slice(0, 6)

  if (!forecast.length) {
    return Array.from({ length: 6 }, () => '--')
  }

  return forecast.map((item) => formatHour(item.time))
})

const chartWeather = computed(() => {
  const forecast = hourlyForecast.value.slice(0, 6)

  if (!forecast.length) {
    return Array.from({ length: 6 }, () => ({
      label: '--',
      icon: null,
    }))
  }

  return forecast.map((item) => ({
    label: getWeatherCodeLabel(item.weatherCode),
    icon: getWeatherCodeIcon(item.weatherCode),
  }))
})
</script>

<template>
  <div class="mockup mockup-weather">
    <div class="weather-preview">
      <template v-if="!isError">
        <div class="weather-preview__top">
          <div>
            <div class="weather-preview__city">{{ cityLabel }}</div>
            <div class="weather-preview__time">
              {{ isLoading ? 'Загружаем погоду...' : timeLabel }}
            </div>
          </div>

          <div class="weather-preview__temp">{{ temperatureLabel }}</div>
        </div>

        <div class="weather-preview__status">
          <WeatherIcon :icon="weatherIcon" size="md" />

          <div class="weather-info">
            <div class="weather-info__label">Комфорт</div>
            <div class="weather-info__value">
              {{ isLoading ? '...' : comfortLabel }}
            </div>
          </div>
        </div>

        <div class="weather-chart">
          <div
              v-for="(height, index) in chartItems"
              :key="index"
              class="weather-chart__item"
          >
            <WeatherIcon
                class="weatherr-icon"
                :icon="chartWeather[index].icon"
                size="sm"
            />
            <span
                class="weather-chart__bar"
                :style="{ height: `${height}px` }"
            />

            <div class="weather-chart__label">
              {{ chartLabels[index] }}
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="weather-preview__error">
          Не удалось загрузить погоду
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mockup {
  width: 100%;
  max-width: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.weather-preview {
  width: 100%;
  border-radius: 24px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(10, 17, 30, 0.72);
  backdrop-filter: blur(18px);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.26);
}

.weather-preview__top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
}

.weather-preview__city {
  font-size: 18px;
  font-weight: 600;
}

.weather-preview__time {
  margin-top: 6px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.54);
}

.weather-preview__temp {
  font-size: 34px;
  font-weight: 700;
  line-height: 1;
}

.weather-preview__status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.weather-info {
  text-align: right;
}

.weather-info__label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.54);
}

.weather-info__value {
  margin-top: 6px;
  font-size: 22px;
  font-weight: 700;
}

.weather-chart {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  min-height: 100px;
}

.weather-chart__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  position: relative;
}

.weather-chart__weather-label {
  margin-bottom: 6px;
  max-width: 100%;
  min-height: 22px;
  font-size: 9px;
  line-height: 1.2;
  text-align: center;
  color: rgba(255, 255, 255, 0.72);
}

.weather-chart__bar {
  display: block;
  width: 100%;
  min-height: 8px;
  margin-top: 6px;
  border-radius: 999px 999px 10px 10px;
  transition: height 0.3s linear;
  background: linear-gradient(
          to top,
          rgba(56, 189, 248, 0.28),
          rgba(125, 211, 252, 0.92)
  );
}

.weather-chart__label {
  margin-top: 6px;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.6);
}

.weather-preview__error {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.72);
}

@media (max-width: 640px) {
  .weather-preview__status {
    align-items: flex-start;
    flex-direction: column;
  }

  .weather-info {
    text-align: left;
  }
}
.weatherr-icon{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}
</style>