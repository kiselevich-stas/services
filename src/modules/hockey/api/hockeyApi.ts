import { supabase } from '../../../lib/supabase.ts'
import type { HockeyUpcomingMatch } from '../types'

function mapUpcomingMatch(match: {
    id: number
    start_at?: number
    stage_name?: string
    game_state?: string
    team_a?: {
        id: number
        name: string
        image?: string
        location?: string
    }
    team_b?: {
        id: number
        name: string
        image?: string
        location?: string
    }
}): HockeyUpcomingMatch {
    return {
        id: match.id,
        startAt: typeof match.start_at === 'number' ? match.start_at : null,
        stageName: match.stage_name ?? '',
        gameState: match.game_state ?? '',
        teamA: {
            id: match.team_a?.id ?? 0,
            name: match.team_a?.name ?? 'Команда A',
            image: match.team_a?.image ?? '',
            location: match.team_a?.location ?? '',
        },
        teamB: {
            id: match.team_b?.id ?? 0,
            name: match.team_b?.name ?? 'Команда B',
            image: match.team_b?.image ?? '',
            location: match.team_b?.location ?? '',
        },
    }
}

export async function getUpcomingMatches(limit = 12): Promise<HockeyUpcomingMatch[]> {
    const { data, error } = await supabase.functions.invoke('hockey-upcoming-matches', {
        body: { locale: 'ru', limit },
    })

    if (error) {
        throw new Error(error.message || 'Не удалось загрузить ближайшие матчи')
    }

    console.log('hockey-upcoming-matches raw response', data)

    return Array.isArray(data?.items)
        ? data.items.map((item: Parameters<typeof mapUpcomingMatch>[0]) => mapUpcomingMatch(item))
        : []
}