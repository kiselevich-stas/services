import { supabase } from '../../../lib/supabase.ts'

export type GetHockeyTeamEloSnapshotsParams = {
    teamId: string
    seasonId?: string
    stageId?: string
}

export type HockeyTeamEloChartPoint = {
    index: number
    snapshotId: number
    matchId: string
    date: string
    dateLabel: string
    stageId: string | null
    stageName: string
    opponentTeamId: string
    opponentTeamName: string
    isHome: boolean
    result: 'win' | 'loss'
    teamScore: number
    opponentScore: number
    ratingBefore: number
    ratingAfter: number
    delta: number
}

export type HockeyTeamEloSummary = {
    matchesPlayed: number
    wins: number
    losses: number
    winRate: number
    goalsFor: number
    goalsAgainst: number
    goalDifference: number
    averageGoalsFor: number
    averageGoalsAgainst: number
    startRating: number
    currentRating: number
    ratingChange: number
    maxRating: number
    minRating: number
    lastMatchDate: string | null
    lastUpdatedAt: string | null
}

export type HockeyTeamEloResponse = {
    team: {
        id: string
        name: string
        logoUrl: string | null
    }
    season: {
        seasonId: string
        seasonLabel: string
        isActive: boolean
        regularStageId: string | null
        regularStageName: string | null
        playoffStageId: string | null
        playoffStageName: string | null
    } | null
    filters: {
        teamId: string
        seasonId: string | null
        stageId: string | null
        stageType: 'regular' | 'playoff' | 'custom' | null
    }
    summary: HockeyTeamEloSummary
    splits: {
        home: {
            matches: number
            wins: number
            losses: number
        }
        away: {
            matches: number
            wins: number
            losses: number
        }
    }
    highlights: {
        biggestGain: {
            matchId: string
            date: string
            opponentTeamId: string
            opponentTeamName: string
            value: number
        } | null
        biggestLoss: {
            matchId: string
            date: string
            opponentTeamId: string
            opponentTeamName: string
            value: number
        } | null
    }
    chart: HockeyTeamEloChartPoint[]
}

export async function getHockeyTeamEloSnapshots(
    params: GetHockeyTeamEloSnapshotsParams,
): Promise<HockeyTeamEloResponse> {
    const { data, error } = await supabase.functions.invoke('get-team-elo-snapshots', {
        body: {
            teamId: params.teamId,
            seasonId: params.seasonId,
            stageId: params.stageId,
        },
    })

    if (error) {
        throw new Error(error.message || 'Не удалось загрузить данные Elo команды')
    }

    return data?.item
}