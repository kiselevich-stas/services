import { supabase } from '../../../lib/supabase.ts'

export type GetMatchHeadToHeadEloParams = {
    teamAId: string
    teamBId: string
    seasonId?: string
    stageId?: string
}

export async function getMatchHeadToHeadElo(
    params: GetMatchHeadToHeadEloParams,
) {
    const { data, error } = await supabase.functions.invoke('get-match-head-to-head-elo', {
        body: {
            teamAId: params.teamAId,
            teamBId: params.teamBId,
            seasonId: params.seasonId,
            stageId: params.stageId,
        },
    })

    if (error) {
        throw new Error(error.message || 'Не удалось загрузить Elo-аналитику очных встреч')
    }

    return data?.item
}