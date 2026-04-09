import { supabase } from '@/lib/supabase'
import type { GetLiveHockeyMatchesResponse } from '../types'

export async function getLiveMatches(
    limit = 10,
    locale = 'ru',
): Promise<GetLiveHockeyMatchesResponse> {
    const { data, error } = await supabase.functions.invoke<GetLiveHockeyMatchesResponse>(
        'get-live-hockey-matches',
        {
            body: {
                limit,
                locale,
            },
        },
    )

    if (error) {
        throw new Error(error.message || 'Не удалось загрузить live-матчи')
    }

    if (!data) {
        throw new Error('Пустой ответ от функции get-live-hockey-matches')
    }

    return data
}