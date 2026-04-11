import { supabase } from '../../../lib/supabase'

export interface GetMatchEloPredictionParams {
    seasonId: string
    teamIds: [string, string]
}

export interface HockeyMatchEloTeamRow {
    team_id: string
    team_name: string
    season_id: string
    rating: number
    matches_played: number
    wins: number
    losses: number
    logo_url: string | null
}

export async function getMatchEloPrediction({
                                                seasonId,
                                                teamIds,
                                            }: GetMatchEloPredictionParams): Promise<HockeyMatchEloTeamRow[]> {
    const { data, error } = await supabase
        .schema('hockey')
        .from('elo_team_ratings')
        .select(`
      team_id,
      team_name,
      season_id,
      rating,
      matches_played,
      wins,
      losses,
      logo_url
    `)
        .eq('season_id', seasonId)
        .in('team_id', teamIds)

    if (error) {
        throw new Error(error.message || 'Не удалось загрузить Elo-рейтинг команд матча')
    }

    return Array.isArray(data) ? data : []
}