import { supabase } from '../../../lib/supabase'
import type {
    VacationDay,
    VacationDayFormValues,
    VacationDayRow,
} from '../types/vacation'

function mapDayRow(row: VacationDayRow): VacationDay {
    return {
        id: row.id,
        planId: row.plan_id,
        dayDate: row.day_date,
        title: row.title,
        note: row.note,
        location: row.location,
        latitude: row.latitude,
        longitude: row.longitude,
        sortOrder: row.sort_order,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    }
}

export async function fetchVacationDays(planId: string): Promise<VacationDay[]> {
    const { data, error } = await supabase
        .schema('vacation')
        .from('days')
        .select('*')
        .eq('plan_id', planId)
        .order('sort_order', { ascending: true })
        .order('day_date', { ascending: true })

    if (error) {
        throw error
    }

    return (data ?? []).map((row) => mapDayRow(row as VacationDayRow))
}

export async function createVacationDay(
    planId: string,
    values: VacationDayFormValues,
): Promise<VacationDay> {
    const { data, error } = await supabase
        .schema('vacation')
        .from('days')
        .insert({
            plan_id: planId,
            day_date: values.dayDate,
            title: values.title,
            note: values.note,
            location: values.location,
            latitude: values.latitude,
            longitude: values.longitude,
            sort_order: values.sortOrder,
        })
        .select('*')
        .single()

    if (error) {
        throw error
    }

    return mapDayRow(data as VacationDayRow)
}

export async function updateVacationDay(
    id: string,
    values: VacationDayFormValues,
): Promise<VacationDay> {
    const { data, error } = await supabase
        .schema('vacation')
        .from('days')
        .update({
            day_date: values.dayDate,
            title: values.title,
            note: values.note,
            location: values.location,
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

    return mapDayRow(data as VacationDayRow)
}

export async function deleteVacationDay(id: string): Promise<void> {
    const { error } = await supabase
        .schema('vacation')
        .from('days')
        .delete()
        .eq('id', id)

    if (error) {
        throw error
    }
}