import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'

export type AppModule = 'countdown' | 'workspace' | 'meeting'

export interface UserSettingsRow {
    user_id: string
    countdown_enabled: boolean
    workspace_enabled: boolean
    meeting_enabled: boolean
}

const DEFAULT_SETTINGS = {
    countdownEnabled: true,
    workspaceEnabled: true,
    meetingEnabled: true,
} as const

export const usePreferencesStore = defineStore('preferences', () => {
    const authStore = useAuthStore()

    const loading = ref(true)
    const initialized = ref(false)

    const savingModules = ref<Record<AppModule, boolean>>({
        countdown: false,
        workspace: false,
        meeting: false,
    })

    const countdownEnabled = ref(DEFAULT_SETTINGS.countdownEnabled)
    const workspaceEnabled = ref(DEFAULT_SETTINGS.workspaceEnabled)
    const meetingEnabled = ref(DEFAULT_SETTINGS.meetingEnabled)

    const modules = computed<Record<AppModule, boolean>>(() => ({
        countdown: countdownEnabled.value,
        workspace: workspaceEnabled.value,
        meeting: meetingEnabled.value,
    }))

    function fillFromRow(row: UserSettingsRow) {
        countdownEnabled.value = row.countdown_enabled
        workspaceEnabled.value = row.workspace_enabled
        meetingEnabled.value = row.meeting_enabled
    }

    function isModuleEnabled(module: AppModule): boolean {
        return modules.value[module]
    }

    function isModuleSaving(module: AppModule): boolean {
        return savingModules.value[module]
    }

    function resetToDefault() {
        countdownEnabled.value = DEFAULT_SETTINGS.countdownEnabled
        workspaceEnabled.value = DEFAULT_SETTINGS.workspaceEnabled
        meetingEnabled.value = DEFAULT_SETTINGS.meetingEnabled

        initialized.value = false

        savingModules.value = {
            countdown: false,
            workspace: false,
            meeting: false,
        }
    }

    async function createDefaultSettings(userId: string) {
        const { data, error } = await supabase
            .from('user_settings')
            .insert({
                user_id: userId,
                countdown_enabled: DEFAULT_SETTINGS.countdownEnabled,
                workspace_enabled: DEFAULT_SETTINGS.workspaceEnabled,
                meeting_enabled: DEFAULT_SETTINGS.meetingEnabled,
            })
            .select('user_id, countdown_enabled, workspace_enabled, meeting_enabled')
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
                workspace_enabled: workspaceEnabled.value,
                meeting_enabled: meetingEnabled.value,
                updated_at: new Date().toISOString(),
            })

        if (error) {
            throw error
        }
    }

    async function loadSettings() {
        const userId = authStore.user?.id

        if (!userId) {
            resetToDefault()
            loading.value = false
            return
        }

        loading.value = true

        try {
            const { data, error } = await supabase
                .from('user_settings')
                .select('user_id, countdown_enabled, workspace_enabled, meeting_enabled')
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

    function setModuleValue(module: AppModule, value: boolean) {
        switch (module) {
            case 'countdown':
                countdownEnabled.value = value
                break
            case 'workspace':
                workspaceEnabled.value = value
                break
            case 'meeting':
                meetingEnabled.value = value
                break
        }
    }

    function getModuleValue(module: AppModule): boolean {
        switch (module) {
            case 'countdown':
                return countdownEnabled.value
            case 'workspace':
                return workspaceEnabled.value
            case 'meeting':
                return meetingEnabled.value
        }
    }

    async function updateModule(module: AppModule, value: boolean) {
        const previousValue = getModuleValue(module)

        if (previousValue === value || savingModules.value[module]) {
            return
        }

        try {
            savingModules.value[module] = true
            setModuleValue(module, value)
            await saveSettings()
        } catch (error) {
            setModuleValue(module, previousValue)
            throw error
        } finally {
            savingModules.value[module] = false
        }
    }

    return {
        loading,
        initialized,
        modules,
        countdownEnabled,
        workspaceEnabled,
        meetingEnabled,
        loadSettings,
        updateModule,
        resetToDefault,
        isModuleEnabled,
        isModuleSaving,
    }
})