import type { RouteRecordRaw } from 'vue-router'
import HockeyHubPage from './pages/HockeyHubPage.vue'

export const hockeyRoutes: RouteRecordRaw[] = [
  {
    path: '/hockey',
    name: 'hockey',
    component: HockeyHubPage,
  },
]
