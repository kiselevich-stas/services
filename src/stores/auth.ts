import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Session, User } from '@supabase/supabase-js'

import { supabase } from '../lib/supabase'
import { useProfileStore } from '../modules/profile'
import { useToastStore } from './toast'
import { getAuthErrorMessage } from '../lib/errors/getAuthErrorMessage'

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null)
    const session = ref<Session | null>(null)
    const loading = ref(false)
    const isInitialized = ref(false)

    let authListenerInitialized = false

    const isAuthenticated = computed(() => !!user.value)

    const avatarUrl = computed(() => {
        return user.value?.user_metadata?.avatar_url || null
    })

    async function initAuth(): Promise<void> {
        if (isInitialized.value) return

        const toastStore = useToastStore()
        const { data, error } = await supabase.auth.getSession()

        if (error) {
            toastStore.error('Ошибка авторизации', getAuthErrorMessage(error))
            throw error
        }

        session.value = data.session
        user.value = data.session?.user ?? null

        if (!authListenerInitialized) {
            supabase.auth.onAuthStateChange(async (_event, newSession) => {
                session.value = newSession
                user.value = newSession?.user ?? null
            })

            authListenerInitialized = true
        }

        isInitialized.value = true
    }

    async function register(email: string, password: string): Promise<void> {
        const toastStore = useToastStore()
        loading.value = true

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
            })

            if (error) throw error

            toastStore.success(
                'Регистрация успешна',
                'Проверьте почту для подтверждения email.',
            )
        } catch (error) {
            toastStore.error('Ошибка регистрации', getAuthErrorMessage(error))
            throw error
        } finally {
            loading.value = false
        }
    }

    async function login(email: string, password: string): Promise<void> {
        const toastStore = useToastStore()
        loading.value = true

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error

            toastStore.success('Успешный вход')
        } catch (error) {
            toastStore.error('Ошибка входа', getAuthErrorMessage(error))
            throw error
        } finally {
            loading.value = false
        }
    }

    async function logout(): Promise<void> {
        const toastStore = useToastStore()
        const profileStore = useProfileStore()

        try {
            const { error } = await supabase.auth.signOut()

            if (error) throw error

            session.value = null
            user.value = null
            profileStore.clearProfile()

            toastStore.info('Вы вышли из аккаунта')
        } catch (error) {
            toastStore.error('Ошибка выхода', getAuthErrorMessage(error))
            throw error
        }
    }

    return {
        user,
        session,
        loading,
        isInitialized,
        isAuthenticated,
        avatarUrl,
        initAuth,
        register,
        login,
        logout,
    }
})