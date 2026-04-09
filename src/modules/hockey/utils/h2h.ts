import type { HockeyEvent, HockeyHeadToHeadSummary, HockeyHeadToHeadTotals, HockeyTeam } from '../types'

function getScoreNumbers(score: string): [number, number] {
  const [left = '0', right = '0'] = score.split(':')
  const homeGoals = Number.parseInt(left, 10)
  const awayGoals = Number.parseInt(right, 10)

  return [Number.isNaN(homeGoals) ? 0 : homeGoals, Number.isNaN(awayGoals) ? 0 : awayGoals]
}

export function isHeadToHeadMatch(event: HockeyEvent, firstTeamId: number, secondTeamId: number): boolean {
  const ids = [event.teamA.id, event.teamB.id]
  return ids.includes(firstTeamId) && ids.includes(secondTeamId)
}

export function getWinnerTeamId(event: HockeyEvent): number | null {
  if (event.state !== 'finished') {
    return null
  }

  const [teamAGoals, teamBGoals] = getScoreNumbers(event.score)

  if (teamAGoals === teamBGoals) {
    return null
  }

  return teamAGoals > teamBGoals ? event.teamA.id : event.teamB.id
}

function getGoalsForTeam(event: HockeyEvent, teamId: number): number {
  const [teamAGoals, teamBGoals] = getScoreNumbers(event.score)
  return event.teamA.id === teamId ? teamAGoals : teamBGoals
}

function buildTotals(events: HockeyEvent[], teamA: HockeyTeam, teamB: HockeyTeam): HockeyHeadToHeadTotals {
  return events.reduce<HockeyHeadToHeadTotals>(
    (accumulator, event) => {
      const winnerId = getWinnerTeamId(event)

      accumulator.totalGames += 1
      accumulator.teamAGoals += getGoalsForTeam(event, teamA.id)
      accumulator.teamBGoals += getGoalsForTeam(event, teamB.id)

      if (winnerId === teamA.id) {
        accumulator.teamAWins += 1
      } else if (winnerId === teamB.id) {
        accumulator.teamBWins += 1
      } else {
        accumulator.drawsOrShootoutGames += 1
      }

      return accumulator
    },
    {
      totalGames: 0,
      teamAWins: 0,
      teamBWins: 0,
      drawsOrShootoutGames: 0,
      teamAGoals: 0,
      teamBGoals: 0,
    },
  )
}

export function buildHeadToHeadSummary(params: {
  teamA: HockeyTeam
  teamB: HockeyTeam
  stage: HockeyHeadToHeadSummary['stage']
  events: HockeyEvent[]
  allTimePairStat: HockeyHeadToHeadSummary['allTimePairStat']
}): HockeyHeadToHeadSummary {
  const recentGames = params.events.slice(0, 5)

  return {
    teams: {
      teamA: params.teamA,
      teamB: params.teamB,
    },
    stage: params.stage,
    total: buildTotals(params.events, params.teamA, params.teamB),
    recentGames,
    lastWinnerId: recentGames.length ? getWinnerTeamId(recentGames[0]) : null,
    allTimePairStat: params.allTimePairStat,
  }
}

export function formatTeamTitle(team: HockeyTeam): string {
  return `${team.location} ${team.name}`.trim()
}

export function formatDateTime(timestamp: number): string {
  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(timestamp))
}
