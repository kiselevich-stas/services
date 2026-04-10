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

export type HockeyMatchDetailsPlayerStat = {
  id: string
  title: string
  value: number
  max: number
}

export type HockeyMatchDetailsPlayer = {
  id: number
  khlId: number
  shirtNumber: number
  name: string
  roleKey: string
  image: string | null
  matchStats: HockeyMatchDetailsPlayerStat[]
}

export type HockeyMatchDetailsTopPlayer = {
  id: string
  name: string
  value: string
  player: {
    id: number
    name: string
    shirtNumber: number
    image: string | null
  } | null
}

export type HockeyMatchDetailsTeam = {
  id: number
  khlId: number
  name: string
  location: string
  image: string | null
  shots: number
  goals: number
  powerPlayGoals: number
  shortHandedGoals: number
  powerPlayChances: number
  blockedShots: number
  penaltyMinutes: number
  puckControlTime: number
  distanceTravelled: number
  offensiveBlueLineCrossings: number
  active: boolean
  topPlayers: HockeyMatchDetailsTopPlayer[]
  startFives: HockeyMatchDetailsPlayer[]
  players: HockeyMatchDetailsPlayer[]
  roster: {
    goalkeepers: HockeyMatchDetailsPlayer[]
    defensemen: HockeyMatchDetailsPlayer[]
    forwards: HockeyMatchDetailsPlayer[]
  }
}

export type HockeyMatchDetailsGoal = {
  time: number
  period: number
  score: string
  status: string
  statusAbbr: string
  author: {
    shirtNumber: number
    name: string
    teamId: number
    pointsAfterGoal: number
  }
  assistants: {
    shirtNumber: number
    name: string
    assistsAfterGoal: number
  }[]
}

export type HockeyMatchDetailsViolation = {
  time: number
  period: number
  penaltyTime: number
  penaltyReason: string
  violator: {
    shirtNumber: number
    name: string
    teamId: number
  }
}

export type HockeyMatchDetailsTextEvent = {
  seconds: number
  type: string
  period: number | null
  time: string
  text: string
  score: string
}

export type HockeyMatchDetails = {
  id: number
  name: string
  score: string
  gameStateKey: string | null
  startAt: number
  endAt: number | null
  stageName: string
  season: string
  location: string | null
  image: string | null
  commentator: boolean
  commentatorsNames: string
  referees: {
    main: string[]
    linesmen: string[]
  }
  arena: {
    name: string
    city: string
    address: string
    capacity: number
  }
  scoresByPeriods: {
    firstPeriod: string | null
    secondPeriod: string | null
    thirdPeriod: string | null
    overtime: string | null
    shootout: string | null
  }
  teamA: HockeyMatchDetailsTeam | null
  teamB: HockeyMatchDetailsTeam | null
  goals: HockeyMatchDetailsGoal[]
  violations: HockeyMatchDetailsViolation[]
  textEvents: HockeyMatchDetailsTextEvent[]
  headToHead: {
    totalGames: number
    teamA: {
      wins: number
      goals: number
      points: number
    }
    teamB: {
      wins: number
      goals: number
      points: number
    }
  }
}

export interface HockeyStageOption {
  id: string
  khl_id: number | null
  season: string
  title: string
  type: string
  label: string
  is_current: boolean
}

export interface HockeyTeamCard {
  team: {
    id: number
    khl_id: number | null
    name: string
    location: string | null
    image: string | null
    division: string | null
    division_key: string | null
    conference: string | null
    conference_key: string | null
  }
}