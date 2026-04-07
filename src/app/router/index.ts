import {createRouter, createWebHashHistory, createWebHistory} from 'vue-router'

import LoginPage from "../../pages/LoginPage.vue";
import RegisterPage from "../../pages/RegisterPage.vue";
import NotFoundPage from "../../pages/NotFoundPage.vue";

import HomePage from "../../pages/HomePage.vue";

import { countdownRoutes } from '../../modules/countdown/router.ts'
import { weatherRoutes } from '../../modules/weather/router.ts'
import {profileRoutes} from "../../modules/profile";
import { useAuthStore} from "../../stores/auth.ts";
import SettingsPage from "../../pages/settings/ui/SettingsPage.vue";
import {usePreferencesStore} from "../../stores/preferences.ts";
import {spacesRoutes} from "../../modules/spaces";

export const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        ...countdownRoutes,
        ...weatherRoutes,
        ...profileRoutes,
        ...spacesRoutes,

        {
            path: '/',
            component: HomePage,
        },
        {
            path: '/login',
            component: LoginPage,
            meta: { guestOnly: true },
        },
        {
            path: '/register',
            component: RegisterPage,
            meta: { guestOnly: true },
        },
        {
            path: '/settings',
            name: 'settings',
            component: SettingsPage,
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/:pathMatch(.*)*',
            component: NotFoundPage,
        }
    ],
})

/**
 * 🔐 Глобальный guard
 */
router.beforeEach(async (to) => {
    const authStore = useAuthStore()
    const preferencesStore = usePreferencesStore()

    await authStore.initAuth()

    if (to.meta.requiresAuth && !authStore.user) {
        return '/login'
    }

    if (to.meta.guestOnly && authStore.user) {
        return '/'
    }

    const requiredModule = to.meta.module as 'countdown' | undefined

    if (requiredModule === 'countdown' && !preferencesStore.isModuleEnabled('countdown')) {
        return '/'
    }

    return true
})