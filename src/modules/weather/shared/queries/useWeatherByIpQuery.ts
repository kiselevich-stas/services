import { queryOptions, useQuery } from '@tanstack/vue-query'
import type { City, HourlyForecastItem, WeatherInfo } from '../../types'
import { fetchWeather, getCityByGeolocation } from '../../api/openMeteo'

type WeatherByGeolocationResponse = {
    city: City
    weather: {
        current: WeatherInfo
        hourly: HourlyForecastItem[]
    }
}

export const weatherByGeolocationQueryOptions = queryOptions({
    queryKey: ['weather-by-geolocation'] as const,
    queryFn: async (): Promise<WeatherByGeolocationResponse> => {
        const city = await getCityByGeolocation()
        const weather = await fetchWeather(city)

        return {
            city,
            weather,
        }
    },
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    retry: 1,
    refetchOnWindowFocus: false,
})

export function useWeatherByGeolocationQuery() {
    return useQuery(weatherByGeolocationQueryOptions)
}