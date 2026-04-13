import { supabase } from '../../../lib/supabase'
import type {
    VacationChecklistItemFile,
    VacationChecklistItemFileRow,
    VacationChecklistFileType,
} from '../types/vacation'
import { fetchVacationChecklistItems } from './checklist'

const VACATION_FILES_BUCKET = 'vacation-files'

function mapChecklistFileRow(
    row: VacationChecklistItemFileRow,
    signedUrl?: string | null,
): VacationChecklistItemFile {
    return {
        id: row.id,
        checklistItemId: row.checklist_item_id,
        userId: row.user_id,
        fileName: row.file_name,
        filePath: row.file_path,
        fileType: row.file_type,
        mimeType: row.mime_type,
        sizeBytes: row.size_bytes,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        signedUrl: signedUrl ?? null,
    }
}

export async function fetchChecklistItemFiles(
    checklistItemId: string,
): Promise<VacationChecklistItemFile[]> {
    const { data, error } = await supabase
        .schema('vacation')
        .from('checklist_item_files')
        .select('*')
        .eq('checklist_item_id', checklistItemId)
        .order('created_at', { ascending: true })

    if (error) {
        throw error
    }

    const rows = (data ?? []) as VacationChecklistItemFileRow[]

    return Promise.all(
        rows.map(async (row) => {
            const { data: signedData } = await supabase.storage
                .from(VACATION_FILES_BUCKET)
                .createSignedUrl(row.file_path, 60 * 60)

            return mapChecklistFileRow(row, signedData?.signedUrl ?? null)
        }),
    )
}

export async function fetchChecklistFilesByPlan(
    planId: string,
): Promise<VacationChecklistItemFile[]> {
    const checklistItems = await fetchVacationChecklistItems(planId)
    const checklistItemIds = checklistItems.map((item) => item.id)

    if (!checklistItemIds.length) {
        return []
    }

    const { data, error } = await supabase
        .schema('vacation')
        .from('checklist_item_files')
        .select('*')
        .in('checklist_item_id', checklistItemIds)
        .order('created_at', { ascending: true })

    if (error) {
        throw error
    }

    const rows = (data ?? []) as VacationChecklistItemFileRow[]

    return Promise.all(
        rows.map(async (row) => {
            const { data: signedData } = await supabase.storage
                .from(VACATION_FILES_BUCKET)
                .createSignedUrl(row.file_path, 60 * 60)

            return mapChecklistFileRow(row, signedData?.signedUrl ?? null)
        }),
    )
}

export async function uploadChecklistItemFile(params: {
    checklistItemId: string
    userId: string
    file: File
    fileType: VacationChecklistFileType
}): Promise<VacationChecklistItemFile> {
    const safeFileName = params.file.name.replace(/\s+/g, '_')
    const filePath = `${params.userId}/${params.checklistItemId}/${Date.now()}_${safeFileName}`

    const { error: uploadError } = await supabase.storage
        .from(VACATION_FILES_BUCKET)
        .upload(filePath, params.file, {
            upsert: false,
        })

    if (uploadError) {
        throw uploadError
    }

    const { data, error } = await supabase
        .schema('vacation')
        .from('checklist_item_files')
        .insert({
            checklist_item_id: params.checklistItemId,
            user_id: params.userId,
            file_name: params.file.name,
            file_path: filePath,
            file_type: params.fileType,
            mime_type: params.file.type || null,
            size_bytes: params.file.size,
        })
        .select('*')
        .single()

    if (error) {
        await supabase.storage.from(VACATION_FILES_BUCKET).remove([filePath])
        throw error
    }

    const row = data as VacationChecklistItemFileRow

    const { data: signedData } = await supabase.storage
        .from(VACATION_FILES_BUCKET)
        .createSignedUrl(row.file_path, 60 * 60)

    return mapChecklistFileRow(row, signedData?.signedUrl ?? null)
}

export async function deleteChecklistItemFile(id: string): Promise<void> {
    const { data, error } = await supabase
        .schema('vacation')
        .from('checklist_item_files')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        throw error
    }

    const row = data as VacationChecklistItemFileRow

    const { error: storageError } = await supabase.storage
        .from(VACATION_FILES_BUCKET)
        .remove([row.file_path])

    if (storageError) {
        throw storageError
    }

    const { error: deleteError } = await supabase
        .schema('vacation')
        .from('checklist_item_files')
        .delete()
        .eq('id', id)

    if (deleteError) {
        throw deleteError
    }
}

export async function deleteChecklistFilesByPlan(planId: string): Promise<void> {
    const { data: checklistItems, error: checklistItemsError } = await supabase
        .schema('vacation')
        .from('checklist_items')
        .select('id')
        .eq('plan_id', planId)

    if (checklistItemsError) {
        throw checklistItemsError
    }

    const checklistItemIds = (checklistItems ?? []).map((item) => item.id as string)

    if (!checklistItemIds.length) {
        return
    }

    const { data: files, error: filesError } = await supabase
        .schema('vacation')
        .from('checklist_item_files')
        .select('id, file_path')
        .in('checklist_item_id', checklistItemIds)

    if (filesError) {
        throw filesError
    }

    const filePaths = (files ?? [])
        .map((file) => file.file_path as string)
        .filter(Boolean)

    if (!filePaths.length) {
        return
    }

    const { error: storageError } = await supabase.storage
        .from(VACATION_FILES_BUCKET)
        .remove(filePaths)

    if (storageError) {
        throw storageError
    }
}