import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'

export type AppModule = 'countdown' | 'workspace' | 'worklog' | 'spaces'

export interface UserSettingsRow {
    user_id: string
    countdown_enabled?: boolean | null
    workspace_enabled?: boolean | null
    worklog_enabled?: boolean | null
    spaces_enabled?: boolean | null
    updated_at?: string | null
    created_at?: string | null
}

const DEFAULT_SETTINGS = {
    countdownEnabled: true,
    workspaceEnabled: true,
    worklogEnabled: true,
    spacesEnabled: true,
} as const

export const usePreferencesStore = defineStore('preferences', () => {
    const authStore = useAuthStore()

    const loading = ref(true)
    const initialized = ref(false)

    const savingModules = ref<Record<AppModule, boolean>>({
        countdown: false,
        workspace: false,
        worklog: false,
        spaces: false,
    })

    const countdownEnabled = ref(DEFAULT_SETTINGS.countdownEnabled)
    const workspaceEnabled = ref(DEFAULT_SETTINGS.workspaceEnabled)
    const worklogEnabled = ref(DEFAULT_SETTINGS.worklogEnabled)
    const spacesEnabled = ref(DEFAULT_SETTINGS.spacesEnabled)

    const modules = computed<Record<AppModule, boolean>>(() => ({
        countdown: countdownEnabled.value,
        workspace: workspaceEnabled.value,
        worklog: worklogEnabled.value,
        spaces: spacesEnabled.value,
    }))

    function fillFromRow(row: UserSettingsRow): void {
        countdownEnabled.value = row.countdown_enabled ?? DEFAULT_SETTINGS.countdownEnabled
        workspaceEnabled.value = row.workspace_enabled ?? DEFAULT_SETTINGS.workspaceEnabled
        worklogEnabled.value = row.worklog_enabled ?? DEFAULT_SETTINGS.worklogEnabled
        spacesEnabled.value = row.worklog_enabled ?? DEFAULT_SETTINGS.spacesEnabled
    }

    function isModuleEnabled(module: AppModule): boolean {
        return modules.value[module]
    }

    function isModuleSaving(module: AppModule): boolean {
        return savingModules.value[module]
    }

    function resetToDefault(): void {
        countdownEnabled.value = DEFAULT_SETTINGS.countdownEnabled
        workspaceEnabled.value = DEFAULT_SETTINGS.workspaceEnabled
        worklogEnabled.value = DEFAULT_SETTINGS.worklogEnabled
        spacesEnabled.value = DEFAULT_SETTINGS.spacesEnabled

        initialized.value = false

        savingModules.value = {
            countdown: false,
            workspace: false,
            worklog: false,
            spaces: false,
        }
    }

    async function createDefaultSettings(userId: string): Promise<void> {
        const payload = {
            user_id: userId,
            countdown_enabled: DEFAULT_SETTINGS.countdownEnabled,
            workspace_enabled: DEFAULT_SETTINGS.workspaceEnabled,
            worklog_enabled: DEFAULT_SETTINGS.worklogEnabled,
            spaces_enabled: DEFAULT_SETTINGS.spacesEnabled,
        }

        const { data, error } = await supabase
            .from('user_settings')
            .insert(payload)
            .select('*')
            .single()

        if (error) {
            throw error
        }

        fillFromRow(data as UserSettingsRow)
    }

    async function saveSettings(): Promise<void> {
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
                worklog_enabled: worklogEnabled.value,
                spaces_enabled: spacesEnabled.value,
                updated_at: new Date().toISOString(),
            })

        if (error) {
            throw error
        }
    }

    async function loadSettings(): Promise<void> {
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
                .select('*')
                .eq('user_id', userId)
                .maybeSingle()

            if (error) {
                throw error
            }

            if (!data) {
                await createDefaultSettings(userId)
            } else {
                fillFromRow(data as UserSettingsRow)
            }

            initialized.value = true
        } finally {
            loading.value = false
        }
    }

    function setModuleValue(module: AppModule, value: boolean): void {
        switch (module) {
            case 'countdown':
                countdownEnabled.value = value
                break
            case 'workspace':
                workspaceEnabled.value = value
                break
            case 'worklog':
                worklogEnabled.value = value
                break
            case 'spaces':
                spacesEnabled.value = value
                break
        }
    }

    function getModuleValue(module: AppModule): boolean {
        switch (module) {
            case 'countdown':
                return countdownEnabled.value
            case 'workspace':
                return workspaceEnabled.value
            case 'worklog':
                return worklogEnabled.value
            case 'spaces':
                return spacesEnabled.value
        }
    }

    async function updateModule(module: AppModule, value: boolean): Promise<void> {
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
        worklogEnabled,
        spacesEnabled,
        loadSettings,
        updateModule,
        resetToDefault,
        isModuleEnabled,
        isModuleSaving,
    }
})