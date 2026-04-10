import { supabase } from '../../../lib/supabase'
import type { RecalculateEloResponse } from '../types'

export async function recalculateElo(
    seasonId: string,
    force = true,
): Promise<RecalculateEloResponse> {
    const { data, error } = await supabase.functions.invoke('recalculate-elo', {
        body: {
            season_id: seasonId,
            mode: 'full_rebuild',
            force,
        },
    })

    if (error) {
        throw new Error(error.message || 'Не удалось пересчитать рейтинг Elo')
    }

    return data as RecalculateEloResponse
}