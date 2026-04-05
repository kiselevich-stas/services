import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { activityConfigMap} from "../config/activity.ts";
import type { ActivityMode, City, HourlyForecastItem, WeatherInfo} from "../types.ts";

export type ScoreKey =
    | 'temperature'
    | 'wind'
    | 'humidity'
    | 'precipitation'
    | 'air'
    | 'uv'

export interface WeightedIdealConfig {
  ideal: number
  tolerance: number
  weight: number
}

export interface WeightedMaxConfig {
  idealMax: number
  weight: number
}

export interface WeightedRangeConfig {
  min: number
  max: number
  weight: number
}

export interface ActivityConfig {
  temperature: WeightedIdealConfig
  wind: WeightedMaxConfig
  humidity: WeightedRangeConfig
  precipitation: WeightedMaxConfig
  air: WeightedMaxConfig
  uv: WeightedMaxConfig
}

export interface ComfortBreakdownItem {
  key: ScoreKey
  label: string
  score: number
  value: number
  unit: string
  description: string
  weight: number
}

function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value))
}

function scoreByIdeal(value: number, ideal: number, tolerance: number): number {
  const diff = Math.abs(value - ideal)

  return clamp(100 - (diff / tolerance) * 100)
}

function scoreByMax(value: number, idealMax: number): number {
  if (value <= idealMax) {
    return 100
  }

  return clamp(100 - ((value - idealMax) / idealMax) * 100)
}

function scoreByRange(value: number, min: number, max: number): number {
  if (value >= min && value <= max) {
    return 100
  }

  if (value < min) {
    return clamp(100 - ((min - value) / min) * 100)
  }

  return clamp(100 - ((value - max) / max) * 100)
}

function getComfortLabel(score: number): string {
  if (score >= 85) return 'Отлично'
  if (score >= 70) return 'Хорошо'
  if (score >= 50) return 'Средне'

  return 'Слабо'
}

function getModeText(mode: ActivityMode): string {
  const modeTextMap: Record<ActivityMode, string> = {
    walk: 'для прогулки',
    run: 'для пробежки',
    travel: 'для поездки',
    'remote-work': 'для удалённой работы',
    family: 'для семейного отдыха',
  }

  return modeTextMap[mode]
}

function getFactorDescription(key: ScoreKey, score: number): string {
  if (key === 'temperature') {
    if (score >= 85) return 'Температура ощущается комфортно'
    if (score >= 60) return 'Температура допустимая, но не идеальная'

    return 'Температура далека от комфортной'
  }

  if (key === 'wind') {
    if (score >= 85) return 'Ветер почти не мешает'
    if (score >= 60) return 'Ветер умеренный'

    return 'Ветер слишком сильный'
  }

  if (key === 'humidity') {
    if (score >= 85) return 'Влажность комфортная'
    if (score >= 60) return 'Влажность приемлемая'

    return 'Влажность некомфортная'
  }

  if (key === 'precipitation') {
    if (score >= 85) return 'Риск осадков низкий'
    if (score >= 60) return 'Осадки возможны'

    return 'Высокая вероятность осадков'
  }

  if (key === 'air') {
    if (score >= 85) return 'Качество воздуха хорошее'
    if (score >= 60) return 'Качество воздуха среднее'

    return 'Качество воздуха плохое'
  }

  if (score >= 85) return 'UV-индекс комфортный'
  if (score >= 60) return 'UV-индекс умеренный'

  return 'UV-индекс высокий'
}

export const useWeatherStore = defineStore('weather', () => {
  const selectedCity = ref<City | null>(null)
  const activityMode = ref<ActivityMode>('walk')
  const weather = ref<WeatherInfo | null>(null)
  const hourlyForecast = ref<HourlyForecastItem[]>([])

  const currentActivityConfig = computed<ActivityConfig>(() => {
    return activityConfigMap[activityMode.value]
  })

  const comfortBreakdown = computed<ComfortBreakdownItem[]>(() => {
    if (!weather.value) {
      return []
    }

    const config = currentActivityConfig.value

    const temperatureScore = scoreByIdeal(
        weather.value.feelsLike,
        config.temperature.ideal,
        config.temperature.tolerance,
    )

    const windScore = scoreByMax(
        weather.value.windSpeed,
        config.wind.idealMax,
    )

    const humidityScore = scoreByRange(
        weather.value.humidity,
        config.humidity.min,
        config.humidity.max,
    )

    const precipitationScore = scoreByMax(
        weather.value.precipitationProbability,
        config.precipitation.idealMax,
    )

    const airScore = scoreByMax(
        weather.value.airQuality,
        config.air.idealMax,
    )

    const uvScore = scoreByMax(
        weather.value.uvIndex,
        config.uv.idealMax,
    )

    const items: ComfortBreakdownItem[] = [
      {
        key: 'temperature',
        label: 'Ощущаемая температура',
        score: Math.round(temperatureScore),
        value: weather.value.feelsLike,
        unit: '°C',
        description: getFactorDescription('temperature', temperatureScore),
        weight: config.temperature.weight,
      },
      {
        key: 'wind',
        label: 'Ветер',
        score: Math.round(windScore),
        value: weather.value.windSpeed,
        unit: 'км/ч',
        description: getFactorDescription('wind', windScore),
        weight: config.wind.weight,
      },
      {
        key: 'humidity',
        label: 'Влажность',
        score: Math.round(humidityScore),
        value: weather.value.humidity,
        unit: '%',
        description: getFactorDescription('humidity', humidityScore),
        weight: config.humidity.weight,
      },
      {
        key: 'precipitation',
        label: 'Осадки',
        score: Math.round(precipitationScore),
        value: weather.value.precipitationProbability,
        unit: '%',
        description: getFactorDescription('precipitation', precipitationScore),
        weight: config.precipitation.weight,
      },
      {
        key: 'air',
        label: 'Качество воздуха',
        score: Math.round(airScore),
        value: weather.value.airQuality,
        unit: 'AQI',
        description: getFactorDescription('air', airScore),
        weight: config.air.weight,
      },
      {
        key: 'uv',
        label: 'UV-индекс',
        score: Math.round(uvScore),
        value: weather.value.uvIndex,
        unit: '',
        description: getFactorDescription('uv', uvScore),
        weight: config.uv.weight,
      },
    ]

    return items
  })

  const comfortScore = computed<number>(() => {
    if (!weather.value) {
      return 0
    }

    const config = currentActivityConfig.value

    const breakdownMap = Object.fromEntries(
        comfortBreakdown.value.map((item) => [item.key, item.score]),
    ) as Record<ScoreKey, number>

    const total =
        breakdownMap.temperature * config.temperature.weight +
        breakdownMap.wind * config.wind.weight +
        breakdownMap.humidity * config.humidity.weight +
        breakdownMap.precipitation * config.precipitation.weight +
        breakdownMap.air * config.air.weight +
        breakdownMap.uv * config.uv.weight

    return Math.round(total)
  })

  const comfortLabel = computed<string>(() => {
    return getComfortLabel(comfortScore.value)
  })

  const weakestFactors = computed<ComfortBreakdownItem[]>(() => {
    return [...comfortBreakdown.value]
        .sort((left, right) => left.score - right.score)
        .slice(0, 2)
  })

  const strongestFactors = computed<ComfortBreakdownItem[]>(() => {
    return [...comfortBreakdown.value]
        .sort((left, right) => right.score - left.score)
        .slice(0, 2)
  })

  const readableFormula = computed<string>(() => {
    const parts = [...comfortBreakdown.value]
        .sort((left, right) => right.weight - left.weight)
        .map((item) => `${item.label} (${Math.round(item.weight * 100)}%)`)

    return parts.join(' + ')
  })

  const recommendation = computed<string>(() => {
    const cityName = selectedCity.value?.name ?? 'выбранном городе'
    const modeText = getModeText(activityMode.value)

    if (!weather.value) {
      return 'Выбери город, и я покажу комфорт и рекомендацию.'
    }

    const weakKeys = weakestFactors.value.map((item) => item.key)

    const reasonMap: Partial<Record<ScoreKey, string>> = {
      temperature: 'температура сейчас не очень подходит',
      wind: 'сильный ветер может мешать',
      humidity: 'влажность не самая комфортная',
      precipitation: 'есть риск осадков',
      air: 'качество воздуха неидеальное',
      uv: 'UV-индекс довольно высокий',
    }

    const reasons = weakKeys
        .map((key) => reasonMap[key])
        .filter(Boolean)
        .join(', ')

    if (comfortScore.value >= 85) {
      return `Сейчас в ${cityName} очень комфортно ${modeText}.`
    }

    if (comfortScore.value >= 70) {
      return reasons
          ? `Сейчас в ${cityName} в целом хорошие условия ${modeText}, но ${reasons}.`
          : `Сейчас в ${cityName} в целом хорошие условия ${modeText}.`
    }

    if (comfortScore.value >= 50) {
      return reasons
          ? `Сейчас в ${cityName} условия ${modeText} средние: ${reasons}. Лучше выбрать более удачное время.`
          : `Сейчас в ${cityName} условия ${modeText} средние — лучше выбрать более удачное время.`
    }

    return reasons
        ? `Сейчас в ${cityName} не лучший момент ${modeText}: ${reasons}. Лучше рассмотреть другое время или другой город.`
        : `Сейчас в ${cityName} не лучший момент ${modeText}. Лучше рассмотреть другое время или другой город.`
  })

  function setActivityMode(mode: ActivityMode): void {
    activityMode.value = mode
  }

  function setSelectedCity(city: City): void {
    selectedCity.value = city
  }

  function setWeather(payload: WeatherInfo): void {
    weather.value = payload
  }

  function setHourlyForecast(payload: HourlyForecastItem[]): void {
    hourlyForecast.value = payload
  }

  return {
    selectedCity,
    activityMode,
    weather,
    hourlyForecast,
    currentActivityConfig,
    comfortScore,
    comfortLabel,
    comfortBreakdown,
    weakestFactors,
    strongestFactors,
    readableFormula,
    recommendation,
    setActivityMode,
    setSelectedCity,
    setWeather,
    setHourlyForecast,
  }
})