import type { RouteRecordRaw } from 'vue-router'
import MeetingsHomePage from './pages/MeetingsHomePage.vue'
import MeetingCreatePage from './pages/MeetingCreatePage.vue'
import MeetingDetailsPage from './pages/MeetingDetailsPage.vue'

export const meetingsRoutes: RouteRecordRaw[] = [
  {
    path: '/meetings',
    component: MeetingsHomePage,
    meta: { requiresAuth: true,   module: 'meeting', },
  },
  {
    path: '/meetings/new',
    component: MeetingCreatePage,
    meta: { requiresAuth: true,   module: 'meeting', },
  },
  {
    path: '/meetings/:id',
    component: MeetingDetailsPage,
    meta: { requiresAuth: true,   module: 'meeting', },
  },
]
