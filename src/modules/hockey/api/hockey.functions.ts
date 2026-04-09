import { supabase } from '../../../lib/supabase.ts'
import type { HockeyHeadToHeadSummary, HockeyStage, HockeyTeam } from '../types'

interface HockeyBootstrapResponse {
  currentStageId: number | null
  stages: HockeyStage[]
  teams: HockeyTeam[]
}

function mapTeam(team: {
  id: number
  khl_id: number
  name: string
  location?: string
  image: string
  division?: string | null
  conference?: string | null
}): HockeyTeam {
  return {
    id: team.id,
    khlId: team.khl_id,
    name: team.name,
    location: team.location ?? '',
    image: team.image,
    division: team.division ?? null,
    conference: team.conference ?? null,
  }
}

function mapStage(stage: {
  id: number
  khl_id: number
  title: string
  type: string
  season: string
}): HockeyStage {
  return {
    id: stage.id,
    khlId: stage.khl_id,
    title: stage.title,
    type: stage.type,
    season: stage.season,
  }
}

export async function getHockeyBootstrap(): Promise<HockeyBootstrapResponse> {
  const { data, error } = await supabase.functions.invoke('hockey-bootstrap', {
    body: { locale: 'ru' },
  })

  if (error) {
    throw new Error(error.message || 'Не удалось загрузить hockey-bootstrap')
  }

  const currentStageId =
      typeof data?.commonData?.current_stage_id === 'number'
          ? data.commonData.current_stage_id
          : null

  const stages = Array.isArray(data?.commonData?.stages_v2)
      ? data.commonData.stages_v2.map(mapStage)
      : []

  const teams = Array.isArray(data?.teams)
      ? data.teams
          .map((item: { team?: Record<string, unknown> }) => item.team)
          .filter(Boolean)
          .map((team) => mapTeam(team as Parameters<typeof mapTeam>[0]))
          .sort((left, right) => {
            const leftName = `${left.location} ${left.name}`.trim()
            const rightName = `${right.location} ${right.name}`.trim()

            return leftName.localeCompare(rightName, 'ru')
          })
      : []

  return {
    currentStageId,
    stages,
    teams,
  }
}

export async function getHeadToHeadSummary(params: {
  teamAId: number
  teamBId: number
  stageId: number
}): Promise<HockeyHeadToHeadSummary> {
  const { data, error } = await supabase.functions.invoke('hockey-head-to-head', {
    body: {
      teamAId: params.teamAId,
      teamBId: params.teamBId,
      stageId: params.stageId,
    },
  })

  if (error) {
    throw new Error(error.message || 'Не удалось загрузить hockey-head-to-head')
  }

  return data as HockeyHeadToHeadSummary
}