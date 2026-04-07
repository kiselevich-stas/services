import type { AppModule } from '../../../stores/preferences.ts'

export interface SettingsModuleItem {
    key: AppModule
    title: string
    description: string
    badge: string
}

export const SETTINGS_MODULE_ITEMS: SettingsModuleItem[] = [
    {
        key: 'countdown',
        title: 'Обратный отсчёт',
        description: 'Модуль для создания и отображения событий с таймером.',
        badge: 'Опционально',
    },
    {
        key: 'workspace',
        title: 'Workspace',
        description: 'Модуль рабочего пространства пользователя.',
        badge: 'Опционально',
    },
    {
        key: 'meeting',
        title: 'Meeting',
        description: 'Модуль встреч и участия в них.',
        badge: 'Опционально',
    },
]