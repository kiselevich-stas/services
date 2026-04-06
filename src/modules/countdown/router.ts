import type { RouteRecordRaw } from 'vue-router'

import CountdownCreatePage from './pages/CountdownCreatePage.vue'
import CountdownDetailsPage from './pages/CountdownDetailsPage.vue'
import CountdownHomePage from './pages/CountdownHomePage.vue'

export const countdownRoutes: RouteRecordRaw[] = [
  {
    path: '/countdowns',
    name: 'countdown-home',
    component: CountdownHomePage,
    meta: {
      requiresAuth: true,
      module: 'countdown',
    },
  },
  {
    path: '/countdowns/new',
    name: 'countdown-create',
    component: CountdownCreatePage,
    meta: {
      requiresAuth: true,
      module: 'countdown',
    },
  },
  {
    path: '/countdowns/:id',
    name: 'countdown-details',
    component: CountdownDetailsPage,
    meta: {
      requiresAuth: true,
      module: 'countdown',
    },
  },
]