import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'

import App from './App.vue'
import { router } from './app/router'
import { vueQueryOptions } from './app/providers/query-client'
import { useAuthStore } from './stores/auth'

import './styles/main.scss'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(VueQueryPlugin, vueQueryOptions)

app.mount('#app')