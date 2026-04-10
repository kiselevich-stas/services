import { supabase } from '../../../lib/supabase'
import type { HockeyStageOption } from '../types'

type GetHockeySeasonsResponse = {
    ok: boolean
    current_stage_id: string | null
    items: HockeyStageOption[]
}

export async function getHockeySeasons(): Promise<GetHockeySeasonsResponse> {
    const { data, error } = await supabase.functions.invoke('get-hockey-seasons', {
        body: {},
    })

    if (error) {
        throw new Error(error.message || 'Не удалось загрузить стадии')
    }

    return data as GetHockeySeasonsResponse
}