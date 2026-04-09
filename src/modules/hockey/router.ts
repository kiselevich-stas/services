import type { RouteRecordRaw } from 'vue-router'
import HockeyPage from "./pages/HockeyPage.vue";

export const hockeyAnalyticsRoutes: RouteRecordRaw[] = [
  {
    path: '/hockey',
    name: 'hockey-analytics',
    component: HockeyPage,
  },
]
