import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'

import App from './App.vue'
import { router } from './app/router'
import { vueQueryOptions } from './app/providers/query-client'
import { useAuthStore } from './stores/auth'
import { usePreferencesStore } from './stores/preferences'

import 'leaflet/dist/leaflet.css'
import './styles/main.scss'

async function bootstrap() {
    const app = createApp(App)
    const pinia = createPinia()

    app.use(pinia)
    app.use(router)
    app.use(VueQueryPlugin, vueQueryOptions)

    const authStore = useAuthStore()
    const preferencesStore = usePreferencesStore()

    await authStore.initAuth()

    if (authStore.user) {
        await preferencesStore.loadSettings()
    } else {
        preferencesStore.resetToDefault()
    }

    app.mount('#app')
}

bootstrap()