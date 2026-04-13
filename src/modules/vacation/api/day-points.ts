import { supabase } from '../../../lib/supabase'
import type {
    VacationDayPoint,
    VacationDayPointFormValues,
    VacationDayPointRow,
} from '../types/vacation'

function mapDayPointRow(row: VacationDayPointRow): VacationDayPoint {
    return {
        id: row.id,
        dayId: row.day_id,
        userId: row.user_id,
        title: row.title,
        description: row.description,
        latitude: row.latitude,
        longitude: row.longitude,
        sortOrder: row.sort_order,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    }
}

export async function fetchVacationDayPoints(dayId: string): Promise<VacationDayPoint[]> {
    const { data, error } = await supabase
        .schema('vacation')
        .from('day_points')
        .select('*')
        .eq('day_id', dayId)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true })

    if (error) {
        throw error
    }

    return (data ?? []).map((row) => mapDayPointRow(row as VacationDayPointRow))
}

export async function fetchVacationPlanDayPoints(planId: string): Promise<VacationDayPoint[]> {
    const { data: daysData, error: daysError } = await supabase
        .schema('vacation')
        .from('days')
        .select('id')
        .eq('plan_id', planId)

    if (daysError) {
        throw daysError
    }

    const dayIds = (daysData ?? []).map((day) => day.id as string)

    if (!dayIds.length) {
        return []
    }

    const { data, error } = await supabase
        .schema('vacation')
        .from('day_points')
        .select('*')
        .in('day_id', dayIds)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true })

    if (error) {
        throw error
    }

    return (data ?? []).map((row) => mapDayPointRow(row as VacationDayPointRow))
}

export async function createVacationDayPoint(
    dayId: string,
    userId: string,
    values: VacationDayPointFormValues,
): Promise<VacationDayPoint> {
    console.log('createVacationDayPoint input', {
        dayId,
        userId,
        values,
    })

    const { data, error } = await supabase
        .schema('vacation')
        .from('day_points')
        .insert({
            day_id: dayId,
            user_id: userId,
            title: values.title,
            description: values.description,
            address: values.address,
            latitude: values.latitude,
            longitude: values.longitude,
            sort_order: values.sortOrder,
        })
        .select('*')
        .single()

    console.log('createVacationDayPoint result', { data, error })

    if (error) {
        throw error
    }

    return mapDayPointRow(data as VacationDayPointRow)
}

export async function updateVacationDayPoint(
    id: string,
    values: VacationDayPointFormValues,
): Promise<VacationDayPoint> {
    const { data, error } = await supabase
        .schema('vacation')
        .from('day_points')
        .update({
            title: values.title,
            description: values.description,
            latitude: values.latitude,
            longitude: values.longitude,
            sort_order: values.sortOrder,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select('*')
        .single()

    if (error) {
        throw error
    }

    return mapDayPointRow(data as VacationDayPointRow)
}

export async function deleteVacationDayPoint(id: string): Promise<void> {
    const { error } = await supabase
        .schema('vacation')
        .from('day_points')
        .delete()
        .eq('id', id)

    if (error) {
        throw error
    }
}