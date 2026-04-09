import WorklogDashboardPage from "./pages/WorklogDashboardPage.vue";
import WorklogCreatePage from "./pages/WorklogCreatePage.vue";
import WorklogEditPage from "./pages/WorklogEditPage.vue";
import WorklogHistoryPage from "./pages/WorklogHistoryPage.vue";

export const worklogRoutes = [
    {
        path: '/worklog',
        name: 'worklog',
        component: WorklogDashboardPage,
        meta: {
            requiresAuth: true,
            module: 'worklog',
        },
    },
    {
        path: '/worklog/create',
        name: 'worklog-create',
        component: WorklogCreatePage,
        meta: {
            requiresAuth: true,
            module: 'worklog',
        },
    },
    {
        path: '/worklog/:id/edit',
        name: 'worklog-edit',
        component: WorklogEditPage,
        meta: {
            requiresAuth: true,
            module: 'worklog',
        },
    },
    {
        path: '/worklog/history',
        name: 'worklog-history',
        component: WorklogHistoryPage,
        meta: {
            requiresAuth: true,
            module: 'worklog',
        },
    }
]