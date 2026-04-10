import { supabase } from '../../../lib/supabase'
import type { GetHockeyEloSeasonsResponse } from '../types'

export async function getEloSeasons(): Promise<GetHockeyEloSeasonsResponse> {
    const { data, error } = await supabase.functions.invoke('get-elo-seasons', {
        body: {},
    })

    if (error) {
        throw new Error(error.message || 'Не удалось загрузить сезоны Elo')
    }

    return data as GetHockeyEloSeasonsResponse
}