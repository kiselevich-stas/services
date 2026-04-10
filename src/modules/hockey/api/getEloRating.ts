import { supabase } from '../../../lib/supabase'
import type { GetHockeyEloRatingResponse } from '../types'

export async function getEloRating(
    seasonId: string,
): Promise<GetHockeyEloRatingResponse> {
    const { data, error } = await supabase.functions.invoke('get-elo-rating', {
        body: {
            season_id: seasonId,
        },
    })

    if (error) {
        throw new Error(error.message || 'Не удалось загрузить рейтинг Elo')
    }

    return data as GetHockeyEloRatingResponse
}