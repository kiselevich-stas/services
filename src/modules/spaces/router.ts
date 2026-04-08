import type { RouteRecordRaw } from 'vue-router'
import JoinSpacePage from './pages/JoinSpacePage.vue'
import SpaceCreatePage from './pages/SpaceCreatePage.vue'
import SpaceDetailsPage from './pages/SpaceDetailsPage.vue'
import SpacesHomePage from './pages/SpacesHomePage.vue'

export const spacesRoutes: RouteRecordRaw[] = [
  {
    path: '/spaces',
    component: SpacesHomePage,
    meta: { requiresAuth: true, module: 'workspace' },
  },
  {
    path: '/spaces/new',
    component: SpaceCreatePage,
    meta: { requiresAuth: true, module: 'workspace' },
  },
  {
    path: '/spaces/:id',
    component: SpaceDetailsPage,
    meta: { requiresAuth: true, module: 'workspace' },
  },
  {
    path: '/join/:code',
    component: JoinSpacePage,
    meta: { requiresAuth: true, module: 'workspace' },
  },
]
