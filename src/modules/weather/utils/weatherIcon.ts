export type WeatherIconType =
    | 'sun'
    | 'partly-cloudy'
    | 'overcast'
    | 'fog'
    | 'drizzle'
    | 'freezing-rain'
    | 'rain'
    | 'snow'
    | 'snow-showers'
    | 'storm'
    | 'hail-storm'

export function getWeatherCodeIcon(code: number): WeatherIconType {
    if (code === 0) return 'sun'

    if ([1, 2].includes(code)) return 'partly-cloudy'
    if (code === 3) return 'overcast'

    if ([45, 48].includes(code)) return 'fog'

    if ([51, 53, 55].includes(code)) return 'drizzle'

    if ([56, 57, 66, 67].includes(code)) return 'freezing-rain'

    if ([61, 63, 65, 80, 81, 82].includes(code)) return 'rain'

    if ([71, 73, 75, 77].includes(code)) return 'snow'

    if ([85, 86].includes(code)) return 'snow-showers'

    if (code === 95) return 'storm'

    if ([96, 99].includes(code)) return 'hail-storm'

    return 'overcast'
}