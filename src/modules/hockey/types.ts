export interface HockeyStage {
  id: number
  khlId: number
  title: string
  type: 'regular' | 'playoff' | string
  season: string
}

export interface HockeyTeam {
  id: number
  khlId: number
  name: string
  location: string
  image: string
  division: string | null
  conference: string | null
}

export interface HockeyEvent {
  id: number
  typeId: number
  name: string
  startAt: number
  endAt: number
  stageId: number | null
  stageName: string | null
  state: 'finished' | 'in_progress' | 'not_yet_started' | string
  score: string
  location: string | null
  teamA: HockeyTeam
  teamB: HockeyTeam
  scores: {
    firstPeriod: string | null
    secondPeriod: string | null
    thirdPeriod: string | null
    overtime: string | null
    bullitt: string | null
  }
}

export interface HockeyHeadToHeadTotals {
  totalGames: number
  teamAWins: number
  teamBWins: number
  drawsOrShootoutGames: number
  teamAGoals: number
  teamBGoals: number
}

export interface HockeyHeadToHeadSummary {
  teams: {
    teamA: HockeyTeam
    teamB: HockeyTeam
  }
  stage: HockeyStage | null
  total: HockeyHeadToHeadTotals
  recentGames: HockeyEvent[]
  lastWinnerId: number | null
  allTimePairStat: {
    eventsCount: number
    teamAWins: number
    teamBWins: number
    teamAGoals: number
    teamBGoals: number
    sourceEventId: number
  } | null
}

export interface HockeyPairFilters {
  teamAId: string
  teamBId: string
  stageId: string
}

export interface KhlCommonDataResponse {
  current_stage_id: number
  stages_v2: Array<{
    id: number
    khl_id: number
    title: string
    type: 'regular' | 'playoff' | string
    season: string
  }>
  teams: Array<{
    id: number
    khl_id: number
    name: string
    location: string
    image: string
    division?: string | null
    conference?: string | null
  }>
}

export interface KhlTeamsResponseItem {
  team: {
    id: number
    khl_id: number
    name: string
    location: string
    image: string
    division: string | null
    conference: string | null
  }
}

export interface KhlEventsResponseItem {
  event: {
    id: number
    type_id: number
    name: string
    start_at: number
    end_at: number
    stage_id: number | null
    stage_name: string | null
    game_state_key: 'finished' | 'in_progress' | 'not_yet_started' | string
    score: string
    location: string | null
    team_a: {
      id: number
      khl_id: number
      name: string
      location: string
      image: string
    }
    team_b: {
      id: number
      khl_id: number
      name: string
      location: string
      image: string
    }
    scores: {
      first_period: string | null
      second_period: string | null
      third_period: string | null
      overtime: string | null
      bullitt: string | null
    }
  }
}

export interface KhlEventDetailsResponse {
  event: {
    id: number
    this_pair_stat?: {
      events_count: number
      team_a: {
        wins_count: number
        goals_count: number
        points_count: number
      }
      team_b: {
        wins_count: number
        goals_count: number
        points_count: number
      }
    }
  }
}
