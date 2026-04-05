import type { RouteRecordRaw } from 'vue-router'

import CountdownHomePage from './pages/CountdownHomePage.vue'
import CountdownCreatePage from './pages/CountdownCreatePage.vue'
import CountdownDetailsPage from './pages/CountdownDetailsPage.vue'

export const countdownRoutes: RouteRecordRaw[] = [
    {
        path: '/countdowns',
        component: CountdownHomePage,
        meta: { requiresAuth: true },
    },
    {
        path: '/countdowns/new',
        component: CountdownCreatePage,
        meta: { requiresAuth: true },
    },
    {
        path: '/countdowns/:id',
        component: CountdownDetailsPage,
        meta: { requiresAuth: true },
    },
]