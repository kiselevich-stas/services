import { airHttp, geocodingHttp, weatherHttp } from './http'
import type { City, CitySearchApiItem, HourlyForecastItem, WeatherInfo } from '../types'

interface GeocodingResponse {
  results?: CitySearchApiItem[]
}

interface ForecastResponse {
  current?: {
    time: string
    temperature_2m: number
    apparent_temperature: number
    relative_humidity_2m: number
    wind_speed_10m: number
    weather_code: number
  }
  hourly?: {
    time: string[]
    temperature_2m: number[]
    precipitation_probability: number[]
    wind_speed_10m: number[]
  }
}

interface AirQualityResponse {
  current?: {
    european_aqi?: number
    uv_index?: number
  }
}

export async function searchCities(query: string): Promise<City[]> {
  const { data } = await geocodingHttp.get<GeocodingResponse>('/search', {
    params: {
      name: query,
      count: 8,
      language: 'en',
      format: 'json',
    },
  })

  return (data.results ?? []).map((item) => ({
    id: `${item.name}-${item.country ?? 'unknown'}-${item.latitude}-${item.longitude}`,
    name: item.name,
    country: item.country ?? 'Unknown',
    latitude: item.latitude,
    longitude: item.longitude,
    timezone: item.timezone,
  }))
}

export async function fetchWeather(city: City): Promise<{
  current: WeatherInfo
  hourly: HourlyForecastItem[]
}> {
  const [{ data: forecastData }, { data: airData }] = await Promise.all([
    weatherHttp.get<ForecastResponse>('/forecast', {
      params: {
        latitude: city.latitude,
        longitude: city.longitude,
        timezone: 'auto',
        current: [
          'temperature_2m',
          'apparent_temperature',
          'relative_humidity_2m',
          'wind_speed_10m',
          'weather_code',
        ].join(','),
        hourly: [
          'temperature_2m',
          'precipitation_probability',
          'wind_speed_10m',
        ].join(','),
        forecast_hours: 12,
      },
    }),
    airHttp.get<AirQualityResponse>('/air-quality', {
      params: {
        latitude: city.latitude,
        longitude: city.longitude,
        timezone: 'auto',
        current: ['european_aqi', 'uv_index'].join(','),
      },
    }),
  ])

  const current = forecastData.current
  const hourly = forecastData.hourly

  if (!current || !hourly) {
    throw new Error('Не удалось получить погодные данные')
  }

  const currentPrecipitationProbability = hourly.precipitation_probability?.[0] ?? 0

  const normalizedCurrent: WeatherInfo = {
    temperature: current.temperature_2m,
    feelsLike: current.apparent_temperature,
    windSpeed: current.wind_speed_10m,
    humidity: current.relative_humidity_2m,
    precipitationProbability: currentPrecipitationProbability,
    airQuality: airData.current?.european_aqi ?? 0,
    uvIndex: airData.current?.uv_index ?? 0,
    weatherCode: current.weather_code,
    time: current.time,
  }

  const normalizedHourly: HourlyForecastItem[] = hourly.time.map((time, index) => ({
    time,
    temperature: hourly.temperature_2m[index] ?? 0,
    precipitationProbability: hourly.precipitation_probability[index] ?? 0,
    windSpeed: hourly.wind_speed_10m[index] ?? 0,
  }))

  return {
    current: normalizedCurrent,
    hourly: normalizedHourly,
  }
}
