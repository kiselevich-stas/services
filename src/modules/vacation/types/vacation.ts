export type VacationPlanStatus =
    | 'planned'
    | 'booked'
    | 'in_progress'
    | 'completed'
    | 'cancelled'

export type VacationChecklistCategory =
    | 'documents'
    | 'booking'
    | 'bags'
    | 'health'
    | 'finance'
    | 'general'

export interface VacationPlan {
    id: string
    title: string
    description: string
    destination: string
    startDate: string
    endDate: string
    status: VacationPlanStatus
    emoji: string
    color: string
    travelersCount: number
    budget: number | null
    isFavorite: boolean
    createdAt: string
    updatedAt: string
}

export interface VacationDay {
    id: string
    planId: string
    dayDate: string
    title: string
    note: string
    location: string
    latitude: number | null
    longitude: number | null
    sortOrder: number
    createdAt: string
    updatedAt: string
}

export interface VacationChecklistItem {
    id: string
    planId: string
    title: string
    category: VacationChecklistCategory
    isDone: boolean
    sortOrder: number
    createdAt: string
    updatedAt: string
}

export interface VacationPlanDetails {
    plan: VacationPlan
    days: VacationDay[]
    checklist: VacationChecklistItem[]
    checklistFiles: VacationChecklistItemFile[]
    dayPoints: VacationDayPoint[]
}

export interface VacationPlanFormValues {
    title: string
    description: string
    destination: string
    startDate: string
    endDate: string
    status: VacationPlanStatus
    emoji: string
    color: string
    travelersCount: number
    budget: number | null
    isFavorite: boolean
}

export interface VacationDayFormValues {
    dayDate: string
    title: string
    note: string
    location: string
    latitude: number | null
    longitude: number | null
    sortOrder: number
}

export interface VacationChecklistItemFormValues {
    title: string
    category: VacationChecklistCategory
    isDone: boolean
    sortOrder: number
}

export interface VacationPlanRow {
    id: string
    user_id: string
    title: string
    description: string
    destination: string
    start_date: string
    end_date: string
    status: VacationPlanStatus
    emoji: string
    color: string
    travelers_count: number
    budget: number | null
    is_favorite: boolean
    created_at: string
    updated_at: string
}

export interface VacationDayRow {
    id: string
    plan_id: string
    day_date: string
    title: string
    note: string
    location: string
    latitude: number | null
    longitude: number | null
    sort_order: number
    created_at: string
    updated_at: string
}

export interface VacationChecklistItemRow {
    id: string
    plan_id: string
    title: string
    category: VacationChecklistCategory
    is_done: boolean
    sort_order: number
    created_at: string
    updated_at: string
}

export type VacationChecklistFileType = 'document' | 'ticket'

export interface VacationChecklistItemFile {
    id: string
    checklistItemId: string
    userId: string
    fileName: string
    filePath: string
    fileType: VacationChecklistFileType
    mimeType: string | null
    sizeBytes: number | null
    createdAt: string
    updatedAt: string
    signedUrl?: string | null
}

export interface VacationChecklistItemFileRow {
    id: string
    checklist_item_id: string
    user_id: string
    file_name: string
    file_path: string
    file_type: VacationChecklistFileType
    mime_type: string | null
    size_bytes: number | null
    created_at: string
    updated_at: string
}
export interface VacationDayPoint {
    id: string
    dayId: string
    userId: string
    title: string
    description: string
    latitude: number
    longitude: number
    sortOrder: number
    createdAt: string
    updatedAt: string
}

export interface VacationDayPointFormValues {
    title: string
    description: string
    latitude: number
    longitude: number
    sortOrder: number
}

export interface VacationDayPointRow {
    id: string
    day_id: string
    user_id: string
    title: string
    description: string
    latitude: number
    longitude: number
    sort_order: number
    created_at: string
    updated_at: string
}