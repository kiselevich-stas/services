import type { RouteRecordRaw } from 'vue-router'
import HockeyPage from "./pages/HockeyPage.vue";
import HockeyMatchPage from "./pages/HockeyMatchPage.vue";

export const hockeyAnalyticsRoutes: RouteRecordRaw[] = [
  {
    path: '/hockey',
    name: 'hockey-analytics',
    component: HockeyPage,
  },
  {
    path: '/hockey/:id',
    name: 'match',
    component: HockeyMatchPage,
  }
]
