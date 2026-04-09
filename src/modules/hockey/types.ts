export interface HockeyUpcomingMatchTeam {
  id: number
  name: string
  image: string
  location: string
}

export interface HockeyUpcomingMatch {
  id: number
  startAt: number | null
  stageName: string
  gameState: string
  teamA: HockeyUpcomingMatchTeam
  teamB: HockeyUpcomingMatchTeam
}
export type HockeyTeam = {
  id: number
  name: string
  location: string | null
  image: string | null
}

export type HockeyMatchStatus = 'live' | 'finished' | 'upcoming' | 'unknown'

export type HockeyMatch = {
  id: number
  name: string
  startAt: number
  endAt: number | null
  gameStateKey: string | null
  status: HockeyMatchStatus
  score: string | null
  stageName: string | null
  location: string | null
  image: string | null
  tickets: string | null
  teamA: HockeyTeam | null
  teamB: HockeyTeam | null
}

export type GetLiveHockeyMatchesResponse = {
  items: HockeyMatch[]
  debug: {
    now: number
    totalRawItems: number
    totalEvents: number
    liveCount: number
    statesHistogram: Record<string, number>
  }
}