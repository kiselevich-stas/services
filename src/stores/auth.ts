import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { useProfileStore} from "../modules/profile";

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

        const { data, error } = await supabase.auth.getSession()

        if (error) {
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
        loading.value = true

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
            })

            if (error) throw error
        } finally {
            loading.value = false
        }
    }

    async function login(email: string, password: string): Promise<void> {
        loading.value = true

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error
        } finally {
            loading.value = false
        }
    }

    async function logout(): Promise<void> {
        const profileStore = useProfileStore()

        const { error } = await supabase.auth.signOut()

        if (error) throw error

        session.value = null
        user.value = null
        profileStore.clearProfile()
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