import { supabase } from '../../../lib/supabase'
import type {
    VacationPlan,
    VacationPlanDetails,
    VacationPlanFormValues,
    VacationPlanRow,
} from '../types/vacation'
import { fetchVacationChecklistItems } from './checklist'
import { fetchVacationDays } from './days'
import { fetchChecklistFilesByPlan, deleteChecklistFilesByPlan} from "./checklist-files.ts";
import { fetchVacationPlanDayPoints } from './day-points'
function mapPlanRow(row: VacationPlanRow): VacationPlan {
    return {
        id: row.id,
        title: row.title,
        description: row.description,
        destination: row.destination,
        startDate: row.start_date,
        endDate: row.end_date,
        status: row.status,
        emoji: row.emoji,
        color: row.color,
        travelersCount: row.travelers_count,
        budget: row.budget,
        isFavorite: row.is_favorite,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    }
}

export async function fetchVacationPlans(userId: string): Promise<VacationPlan[]> {
    const { data, error } = await supabase
        .schema('vacation')
        .from('plans')
        .select('*')
        .eq('user_id', userId)
        .order('is_favorite', { ascending: false })
        .order('start_date', { ascending: true })

    if (error) {
        throw error
    }

    return (data ?? []).map((row) => mapPlanRow(row as VacationPlanRow))
}

export async function fetchVacationPlanById(
    id: string,
    userId: string,
): Promise<VacationPlan> {
    const { data, error } = await supabase
        .schema('vacation')
        .from('plans')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single()

    if (error) {
        throw error
    }

    return mapPlanRow(data as VacationPlanRow)
}

export async function fetchVacationPlanDetails(
    id: string,
    userId: string,
): Promise<VacationPlanDetails> {
    const [plan, days, checklist, checklistFiles, dayPoints] = await Promise.all([
        fetchVacationPlanById(id, userId),
        fetchVacationDays(id),
        fetchVacationChecklistItems(id),
        fetchChecklistFilesByPlan(id),
        fetchVacationPlanDayPoints(id),
    ])

    return {
        plan,
        days,
        checklist,
        checklistFiles,
        dayPoints,
    }
}

export async function createVacationPlan(
    userId: string,
    values: VacationPlanFormValues,
): Promise<VacationPlan> {
    const { data, error } = await supabase
        .schema('vacation')
        .from('plans')
        .insert({
            user_id: userId,
            title: values.title,
            description: values.description,
            destination: values.destination,
            start_date: values.startDate,
            end_date: values.endDate,
            status: values.status,
            emoji: values.emoji,
            color: values.color,
            travelers_count: values.travelersCount,
            budget: values.budget,
            is_favorite: values.isFavorite,
        })
        .select('*')
        .single()

    if (error) {
        throw error
    }

    return mapPlanRow(data as VacationPlanRow)
}

export async function updateVacationPlan(
    id: string,
    userId: string,
    values: VacationPlanFormValues,
): Promise<VacationPlan> {
    const { data, error } = await supabase
        .schema('vacation')
        .from('plans')
        .update({
            title: values.title,
            description: values.description,
            destination: values.destination,
            start_date: values.startDate,
            end_date: values.endDate,
            status: values.status,
            emoji: values.emoji,
            color: values.color,
            travelers_count: values.travelersCount,
            budget: values.budget,
            is_favorite: values.isFavorite,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', userId)
        .select('*')
        .single()

    if (error) {
        throw error
    }

    return mapPlanRow(data as VacationPlanRow)
}

export async function toggleVacationPlanFavorite(
    id: string,
    userId: string,
    isFavorite: boolean,
): Promise<VacationPlan> {
    const { data, error } = await supabase
        .schema('vacation')
        .from('plans')
        .update({
            is_favorite: isFavorite,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', userId)
        .select('*')
        .single()

    if (error) {
        throw error
    }

    return mapPlanRow(data as VacationPlanRow)
}

export async function deleteVacationPlan(
    id: string,
    userId: string,
): Promise<void> {
    await deleteChecklistFilesByPlan(id)

    const { error } = await supabase
        .schema('vacation')
        .from('plans')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)

    if (error) {
        throw error
    }
}