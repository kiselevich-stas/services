import {airHttp, geocodingHttp, weatherHttp} from './http'
import type {
    City,
    CitySearchApiItem,
    HourlyForecastItem,
    WeatherInfo,
} from '../types'

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
        weather_code: number[]
    }
}

interface AirQualityResponse {
    current?: {
        european_aqi?: number
        uv_index?: number
    }
}

function getBrowserLocation(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation не поддерживается'))
            return
        }

        navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
        })
    })
}

export async function getCityByGeolocation(): Promise<City> {
    try {
        const position = await getBrowserLocation()

        const latitude = position.coords.latitude
        const longitude = position.coords.longitude

        return {
            id: `geo-${latitude}-${longitude}`,
            name: 'Ваше местоположение',
            country: '',
            latitude,
            longitude,
            timezone: 'auto',
        }
    } catch {
        return {
            id: 'riga-default',
            name: 'Riga',
            country: 'Latvia',
            latitude: 56.95,
            longitude: 24.1,
            timezone: 'Europe/Riga',
        }
    }
}

export async function searchCities(query: string): Promise<City[]> {
    const normalizedQuery = query.trim()

    if (!normalizedQuery) return []

    const { data } = await geocodingHttp.get<GeocodingResponse>('/search', {
        params: {
            name: normalizedQuery,
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
                    'weather_code',
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

    if (!forecastData.current || !forecastData.hourly) {
        throw new Error('Не удалось получить погодные данные')
    }

    const normalizedCurrent: WeatherInfo = {
        temperature: forecastData.current.temperature_2m,
        feelsLike: forecastData.current.apparent_temperature,
        windSpeed: forecastData.current.wind_speed_10m,
        humidity: forecastData.current.relative_humidity_2m,
        precipitationProbability:
            forecastData.hourly.precipitation_probability?.[0] ?? 0,
        airQuality: airData.current?.european_aqi ?? 0,
        uvIndex: airData.current?.uv_index ?? 0,
        weatherCode: forecastData.current.weather_code,
        time: forecastData.current.time,
    }

    const normalizedHourly: HourlyForecastItem[] =
        forecastData.hourly.time.map((time, index) => ({
            time,
            temperature: forecastData.hourly.temperature_2m[index] ?? 0,
            precipitationProbability:
                forecastData.hourly.precipitation_probability[index] ?? 0,
            windSpeed: forecastData.hourly.wind_speed_10m[index] ?? 0,
            weatherCode: forecastData.hourly.weather_code[index] ?? 0,
        }))

    return {
        current: normalizedCurrent,
        hourly: normalizedHourly,
    }
}