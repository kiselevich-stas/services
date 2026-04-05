import { createRouter, createWebHistory } from 'vue-router'

import LoginPage from "../../pages/LoginPage.vue";
import RegisterPage from "../../pages/RegisterPage.vue";
import NotFoundPage from "../../pages/NotFoundPage.vue";

import HomePage from "../../pages/HomePage.vue";

import { countdownRoutes } from '../../modules/countdown/router.ts'
import { weatherRoutes } from '../../modules/weather/router.ts'
import {profileRoutes} from "../../modules/profile";
import { useAuthStore} from "../../stores/auth.ts";

export const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        ...countdownRoutes,
        ...weatherRoutes,
        ...profileRoutes,

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

    // инициализируем auth один раз
    await authStore.initAuth()

    // если требуется авторизация и её нет → редирект
    if (to.meta.requiresAuth && !authStore.user) {
        return '/login'
    }

    // если пользователь уже авторизован → не пускаем на login
    if (to.meta.guestOnly && authStore.user) {
        return '/'
    }
})