import { supabase } from '../../../lib/supabase'
import type { HockeyTeamCard } from '../types'

type GetTeamCardsResponse = {
    items?: HockeyTeamCard[]
} | HockeyTeamCard[]

export async function getTeamCards(stageId: string): Promise<HockeyTeamCard[]> {
    const { data, error } = await supabase.functions.invoke<GetTeamCardsResponse>(
        'get-hockey-team-cards',
        {
            body: {
                stage_id: stageId,
            },
        },
    )

    if (error) {
        throw new Error(error.message || 'Не удалось загрузить команды')
    }

    if (Array.isArray(data)) {
        return data
    }

    if (Array.isArray(data?.items)) {
        return data.items
    }

    return []
}