import type { RouteRecordRaw } from 'vue-router'

export const vacationRoutes: RouteRecordRaw[] = [
    {
        path: '/vacation',
        name: 'vacation-list',
        component: () => import('./pages/VacationListPage.vue'),
        meta: {
            requiresAuth: true,
            layout: 'default',
            title: 'Vacation Planner',
        },
    },
    {
        path: '/vacation/new',
        name: 'vacation-create',
        component: () => import('./pages/VacationCreatePage.vue'),
        meta: {
            requiresAuth: true,
            layout: 'default',
            title: 'Новый отпуск',
        },
    },
    {
        path: '/vacation/:id',
        name: 'vacation-details',
        component: () => import('./pages/VacationDetailsPage.vue'),
        props: true,
        meta: {
            requiresAuth: true,
            layout: 'default',
            title: 'Отпуск',
        },
    },
]