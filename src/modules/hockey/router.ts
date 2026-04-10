import type { RouteRecordRaw } from 'vue-router'
import HockeyPage from "./pages/HockeyPage.vue";
import HockeyMatchPage from "./pages/HockeyMatchPage.vue";
import HockeyTeamsPage from "./pages/HockeyTeamsPage.vue";
import HockeyEloPage from "./pages/HockeyEloPage.vue";

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
  },
  {
    path: '/hockey/teams',
    name: 'hockey-teams',
    component: HockeyTeamsPage,
  },
  {
    path: '/hockey/elo',
    name: 'hockey-elo',
    component: HockeyEloPage,
  },
]
