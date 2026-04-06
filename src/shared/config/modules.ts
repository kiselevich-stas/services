export type AppModule = 'weather' | 'hourlyForecast' | 'recommendation'

export const APP_MODULES = {
    weather: {
        key: 'weather',
        title: 'Погода',
        routeNames: ['weather'],
    },
    hourlyForecast: {
        key: 'hourlyForecast',
        title: 'Почасовой прогноз',
        routeNames: ['hourly-forecast'],
    },
    recommendation: {
        key: 'recommendation',
        title: 'Рекомендации',
        routeNames: ['recommendation'],
    },
} as const