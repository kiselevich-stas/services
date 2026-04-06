import type { RouteRecordRaw } from 'vue-router'

import WeatherHomePage from './pages/WeatherHomePage.vue'

export const weatherRoutes: RouteRecordRaw[] = [
    {
        path: '/weather',
        name: 'weather',
        component: WeatherHomePage,
    },
]