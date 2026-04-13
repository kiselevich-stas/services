import { supabase } from '../../../lib/supabase'
import type {
    VacationChecklistItem,
    VacationChecklistItemFormValues,
    VacationChecklistItemRow,
} from '../types/vacation'

function mapChecklistRow(row: VacationChecklistItemRow): VacationChecklistItem {
    return {
        id: row.id,
        planId: row.plan_id,
        title: row.title,
        category: row.category,
        isDone: row.is_done,
        sortOrder: row.sort_order,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    }
}

export async function fetchVacationChecklistItems(
    planId: string,
): Promise<VacationChecklistItem[]> {
    const { data, error } = await supabase
        .schema('vacation')
        .from('checklist_items')
        .select('*')
        .eq('plan_id', planId)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true })

    if (error) {
        throw error
    }

    return (data ?? []).map((row) =>
        mapChecklistRow(row as VacationChecklistItemRow),
    )
}

export async function createVacationChecklistItem(
    planId: string,
    values: VacationChecklistItemFormValues,
): Promise<VacationChecklistItem> {
    const { data, error } = await supabase
        .schema('vacation')
        .from('checklist_items')
        .insert({
            plan_id: planId,
            title: values.title,
            category: values.category,
            is_done: values.isDone,
            sort_order: values.sortOrder,
        })
        .select('*')
        .single()

    if (error) {
        throw error
    }

    return mapChecklistRow(data as VacationChecklistItemRow)
}

export async function updateVacationChecklistItem(
    id: string,
    values: VacationChecklistItemFormValues,
): Promise<VacationChecklistItem> {
    const { data, error } = await supabase
        .schema('vacation')
        .from('checklist_items')
        .update({
            title: values.title,
            category: values.category,
            is_done: values.isDone,
            sort_order: values.sortOrder,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select('*')
        .single()

    if (error) {
        throw error
    }

    return mapChecklistRow(data as VacationChecklistItemRow)
}

export async function toggleVacationChecklistItem(
    id: string,
    isDone: boolean,
): Promise<VacationChecklistItem> {
    const { data, error } = await supabase
        .schema('vacation')
        .from('checklist_items')
        .update({
            is_done: isDone,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select('*')
        .single()

    if (error) {
        throw error
    }

    return mapChecklistRow(data as VacationChecklistItemRow)
}

export async function deleteVacationChecklistItem(id: string): Promise<void> {
    const { error } = await supabase
        .schema('vacation')
        .from('checklist_items')
        .delete()
        .eq('id', id)

    if (error) {
        throw error
    }
}