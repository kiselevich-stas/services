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