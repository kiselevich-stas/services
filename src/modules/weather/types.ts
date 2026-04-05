export type ActivityMode = 'walk' | 'run' | 'travel' | 'remote-work' | 'family'

export interface City {
  id: string
  name: string
  country: string
  latitude: number
  longitude: number
  timezone?: string
}

export interface CitySearchApiItem {
  name: string
  country?: string
  latitude: number
  longitude: number
  timezone?: string
}

export interface WeatherInfo {
  temperature: number
  feelsLike: number
  windSpeed: number
  humidity: number
  precipitationProbability: number
  airQuality: number
  uvIndex: number
  weatherCode: number
  time: string
}

export interface HourlyForecastItem {
  time: string
  temperature: number
  precipitationProbability: number
  windSpeed: number
}


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

export interface ActivityBreakdownItem {
  key: 'temperature' | 'wind' | 'humidity' | 'precipitation' | 'air' | 'uv'
  label: string
  score: number
}