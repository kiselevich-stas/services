export interface HockeyTeamPageResponse {
    team: {
        id: string
        name: string
        shortName?: string
        city?: string
        logoUrl?: string
    }
    elo: {
        rating: number
        matchesPlayed: number
        wins: number
        losses: number
        rank?: number
    } | null
    nextMatch: TeamMatch | null
    upcomingMatches: TeamMatch[]
    recentMatches: TeamMatch[]
    recentEloTrend: Array<{
        matchId: string
        matchDate: string
        opponentName: string
        ratingBefore: number
        ratingAfter: number
        result: 'win' | 'loss'
    }>
}