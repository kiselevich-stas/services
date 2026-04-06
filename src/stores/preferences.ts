import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'

export type AppModule = 'countdown'

export interface UserSettingsRow {
    user_id: string
    countdown_enabled: boolean
}

const DEFAULT_SETTINGS = {
    countdownEnabled: true,
}

export const usePreferencesStore = defineStore('preferences', () => {
    const authStore = useAuthStore()

    const loading = ref(true)
    const initialized = ref(false)

    const savingModules = ref<Record<AppModule, boolean>>({
        countdown: false,
    })

    const countdownEnabled = ref(DEFAULT_SETTINGS.countdownEnabled)

    const modules = computed<Record<AppModule, boolean>>(() => ({
        countdown: countdownEnabled.value,
    }))

    function fillFromRow(row: UserSettingsRow) {
        countdownEnabled.value = row.countdown_enabled
    }

    function isModuleEnabled(module: AppModule): boolean {
        return modules.value[module]
    }

    function isModuleSaving(module: AppModule): boolean {
        return savingModules.value[module]
    }

    function resetToDefault() {
        countdownEnabled.value = DEFAULT_SETTINGS.countdownEnabled
        initialized.value = false
        savingModules.value = {
            countdown: false,
        }
    }

    async function createDefaultSettings(userId: string) {
        const { data, error } = await supabase
            .from('user_settings')
            .insert({
                user_id: userId,
                countdown_enabled: DEFAULT_SETTINGS.countdownEnabled,
            })
            .select('user_id, countdown_enabled')
            .single()

        if (error) {
            throw error
        }

        fillFromRow(data)
    }

    async function saveSettings() {
        const userId = authStore.user?.id

        if (!userId) {
            throw new Error('Пользователь не авторизован')
        }

        const { error } = await supabase
            .from('user_settings')
            .upsert({
                user_id: userId,
                countdown_enabled: countdownEnabled.value,
                updated_at: new Date().toISOString(),
            })

        if (error) {
            throw error
        }
    }

    async function loadSettings() {
        console.log('asd')
        const userId = authStore.user?.id

        if (!userId) {
            resetToDefault()
            return
        }

        loading.value = true

        try {
            const { data, error } = await supabase
                .from('user_settings')
                .select('user_id, countdown_enabled')
                .eq('user_id', userId)
                .maybeSingle()

            if (error) {
                throw error
            }

            if (!data) {
                await createDefaultSettings(userId)
            } else {
                fillFromRow(data)
            }

            initialized.value = true
        } finally {
            loading.value = false
        }
    }

    async function updateModule(module: AppModule, value: boolean) {
        if (module !== 'countdown') {
            return
        }

        const previousValue = countdownEnabled.value

        if (previousValue === value || savingModules.value.countdown) {
            return
        }

        try {
            savingModules.value.countdown = true
            countdownEnabled.value = value
            await saveSettings()
        } catch (error) {
            countdownEnabled.value = previousValue
            throw error
        } finally {
            savingModules.value.countdown = false
        }
    }

    return {
        loading,
        initialized,
        modules,
        countdownEnabled,
        loadSettings,
        updateModule,
        resetToDefault,
        isModuleEnabled,
        isModuleSaving,
    }
})