import type {
    VacationChecklistCategory,
    VacationChecklistItemFormValues,
    VacationPlanFormValues,
    VacationPlanStatus,
} from '../types/vacation'

export const VACATION_STATUSES: Array<{
    value: VacationPlanStatus
    label: string
}> = [
    { value: 'planned', label: 'Запланирован' },
    { value: 'booked', label: 'Забронирован' },
    { value: 'in_progress', label: 'Идёт сейчас' },
    { value: 'completed', label: 'Завершён' },
    { value: 'cancelled', label: 'Отменён' },
]

export const VACATION_CHECKLIST_CATEGORIES: Array<{
    value: VacationChecklistCategory
    label: string
}> = [
    { value: 'documents', label: 'Документы' },
    { value: 'booking', label: 'Брони' },
    { value: 'bags', label: 'Багаж' },
    { value: 'health', label: 'Здоровье' },
    { value: 'finance', label: 'Финансы' },
    { value: 'general', label: 'Общее' },
]

export const VACATION_COLORS = [
    '#EC4899',
    '#8B5CF6',
    '#06B6D4',
    '#10B981',
    '#F59E0B',
    '#F97316',
    '#EF4444',
    '#6366F1',
]

export const VACATION_EMOJIS = [
    '🏝️',
    '✈️',
    '🌊',
    '🏕️',
    '🏔️',
    '🗺️',
    '🚗',
    '🌴',
]

export const DEFAULT_VACATION_PLAN_FORM: VacationPlanFormValues = {
    title: '',
    description: '',
    destination: '',
    startDate: '',
    endDate: '',
    status: 'planned',
    emoji: '🏝️',
    color: '#10B981',
    travelersCount: 1,
    budget: null,
    isFavorite: false,
}

export const DEFAULT_VACATION_DAY_FORM = {
    dayDate: '',
    title: '',
    note: '',
    location: '',
    latitude: null,
    longitude: null,
    sortOrder: 0,
}

export const DEFAULT_VACATION_CHECKLIST_ITEM_FORM: VacationChecklistItemFormValues =
    {
        title: '',
        category: 'general',
        isDone: false,
        sortOrder: 0,
    }