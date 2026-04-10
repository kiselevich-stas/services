# get-live-hockey-matches
```const corsHeaders = {
'Access-Control-Allow-Origin': '*',
'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
'Content-Type': 'application/json',
}

type KhlTeam = {
id?: number
name?: string
location?: string
image?: string
}

type KhlEvent = {
id?: number
name?: string
start_at?: number
event_start_at?: number
end_at?: number
game_state_key?: string
score?: string
stage_name?: string
location?: string
image?: string
tickets?: string | null
team_a?: KhlTeam
team_b?: KhlTeam
}

type KhlEventWrapper = {
event?: KhlEvent
}

function jsonResponse(data: unknown, status = 200) {
return new Response(JSON.stringify(data), {
status,
headers: corsHeaders,
})
}

function normalizeState(state?: string | null) {
return String(state ?? '').trim().toLowerCase()
}

function isFinishedState(state?: string | null) {
const value = normalizeState(state)

return [
'finished',
'ended',
'end',
'game_over',
'completed',
'final',
'cancelled',
'postponed',
].includes(value)
}

function isNotStartedState(state?: string | null) {
const value = normalizeState(state)

return [
'not_yet_started',
'scheduled',
'created',
'announced',
].includes(value)
}

/**
* Пока документация не фиксирует полный список live-статусов,
* используем безопасную эвристику:
* - явно исключаем not_started / finished
* - считаем live всё, что похоже на live/progress/period/overtime/shootout/break
* - дополнительно допускаем матч, который уже стартовал по времени,
*   но ещё не завершён
    */
    function isLiveEvent(event?: KhlEvent | null, now = Date.now()) {
    if (!event) return false

const state = normalizeState(event.game_state_key)
const startAt = Number(event.start_at ?? event.event_start_at ?? 0)

if (isFinishedState(state) || isNotStartedState(state)) {
return false
}

if (
state.includes('live') ||
state.includes('progress') ||
state.includes('period') ||
state.includes('break') ||
state.includes('pause') ||
state.includes('overtime') ||
state.includes('shootout')
) {
return true
}

return startAt > 0 && startAt <= now
}

function mapEvent(event: KhlEvent) {
return {
id: Number(event.id ?? 0),
name: event.name ?? '',
startAt: Number(event.start_at ?? event.event_start_at ?? 0),
endAt: event.end_at ? Number(event.end_at) : null,
gameStateKey: event.game_state_key ?? null,
score: event.score ?? null,
stageName: event.stage_name ?? null,
location: event.location ?? null,
image: event.image ?? null,
tickets: event.tickets ?? null,
teamA: event.team_a
? {
id: Number(event.team_a.id ?? 0),
name: event.team_a.name ?? '',
location: event.team_a.location ?? null,
image: event.team_a.image ?? null,
}
: null,
teamB: event.team_b
? {
id: Number(event.team_b.id ?? 0),
name: event.team_b.name ?? '',
location: event.team_b.location ?? null,
image: event.team_b.image ?? null,
}
: null,
}
}

Deno.serve(async (req) => {
if (req.method === 'OPTIONS') {
return new Response('ok', { headers: corsHeaders })
}

try {
let limit = 10
let locale = 'ru'

    if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}))
      limit = Math.min(Math.max(Number(body?.limit ?? 10), 1), 30)
      locale = typeof body?.locale === 'string' ? body.locale : 'ru'
    } else {
      const url = new URL(req.url)
      limit = Math.min(Math.max(Number(url.searchParams.get('limit') ?? 10), 1), 30)
      locale = url.searchParams.get('locale') || 'ru'
    }

    const upstreamUrl = 'https://khl.api.webcaster.pro/api/khl_mobile/events_v2.json'

    const upstreamResponse = await fetch(upstreamUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Language': locale,
        'User-Agent': 'Mozilla/5.0',
        'Cache-Control': 'no-cache',
      },
    })

    const text = await upstreamResponse.text()

    if (!upstreamResponse.ok) {
      return jsonResponse(
        {
          message: 'Не удалось получить live-матчи',
          upstreamStatus: upstreamResponse.status,
          upstreamPreview: text.slice(0, 1000),
        },
        502,
      )
    }

    let parsed: unknown

    try {
      parsed = JSON.parse(text)
    } catch {
      return jsonResponse(
        {
          message: 'KHL API вернул не JSON',
          upstreamPreview: text.slice(0, 1000),
        },
        502,
      )
    }

    if (!Array.isArray(parsed)) {
      return jsonResponse(
        {
          message: 'Неожиданная структура ответа KHL API',
          receivedType: typeof parsed,
          preview: parsed,
        },
        502,
      )
    }

    const now = Date.now()

    const events = (parsed as KhlEventWrapper[])
      .map((item) => item?.event)
      .filter((event): event is KhlEvent => Boolean(event))

    const liveEvents = events
      .filter((event) => isLiveEvent(event, now))
      .sort((a, b) => Number(a.start_at ?? 0) - Number(b.start_at ?? 0))
      .slice(0, limit)
      .map(mapEvent)

    const statesHistogram = events.reduce<Record<string, number>>((acc, event) => {
      const key = normalizeState(event.game_state_key) || 'unknown'
      acc[key] = (acc[key] ?? 0) + 1
      return acc
    }, {})

    return jsonResponse({
      items: liveEvents,
      debug: {
        now,
        totalRawItems: parsed.length,
        totalEvents: events.length,
        liveCount: liveEvents.length,
        statesHistogram,
      },
    })
} catch (error) {
return jsonResponse(
{
message: 'Ошибка при загрузке live-матчей',
error: error instanceof Error ? error.message : 'Unknown error',
},
500,
)
}
})
```
# hockey-bootstrap

```
const corsHeaders = {
'Access-Control-Allow-Origin': '*',
'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function getCommonParams(locale = 'ru') {
return new URLSearchParams({
locale,
application: 'khl_web',
deviceid: 'supabase-edge',
installid: 'supabase-edge',
})
}

Deno.serve(async (req) => {
if (req.method === 'OPTIONS') {
return new Response('ok', { headers: corsHeaders })
}

try {
const body = await req.json().catch(() => ({}))
const locale = body?.locale ?? 'ru'

    const response = await fetch(
      `https://khl.api.webcaster.pro/api/khl_mobile/data.json?${getCommonParams(locale).toString()}`
    )

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          message: 'Не удалось получить hockey-bootstrap',
          status: response.status,
        }),
        {
          status: 502,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        },
      )
    }

    const data = await response.json()

    return new Response(JSON.stringify(data), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    })
} catch (error) {
return new Response(
JSON.stringify({
message: 'Ошибка при загрузке hockey-bootstrap',
error: error instanceof Error ? error.message : 'Unknown error',
}),
{
status: 500,
headers: {
...corsHeaders,
'Content-Type': 'application/json',
},
},
)
}
})
```

# hockey-upcoming-matches
```
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json',
}

type KhlEventWrapper = {
  event?: {
    id?: number
    name?: string
    start_at?: number
    event_start_at?: number
    end_at?: number
    game_state_key?: string
    score?: string
    stage_name?: string
    location?: string
    image?: string
    tickets?: string | null
    team_a?: {
      id?: number
      name?: string
      location?: string
      image?: string
    }
    team_b?: {
      id?: number
      name?: string
      location?: string
      image?: string
    }
  }
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders,
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    let limit = 12
    let locale = 'ru'

    if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}))
      limit = Math.min(Math.max(Number(body?.limit ?? 12), 1), 20)
      locale = typeof body?.locale === 'string' ? body.locale : 'ru'
    } else {
      const url = new URL(req.url)
      limit = Math.min(Math.max(Number(url.searchParams.get('limit') ?? 12), 1), 20)
      locale = url.searchParams.get('locale') || 'ru'
    }

    // ВАЖНО: не добавляем query-параметры к KHL API
    const upstreamUrl = 'https://khl.api.webcaster.pro/api/khl_mobile/events_v2.json'

    const upstreamResponse = await fetch(upstreamUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': locale,
        'User-Agent': 'Mozilla/5.0',
        'Cache-Control': 'no-cache',
      },
    })

    const text = await upstreamResponse.text()

    if (!upstreamResponse.ok) {
      return jsonResponse(
        {
          message: 'Не удалось получить матчи',
          upstreamStatus: upstreamResponse.status,
          upstreamPreview: text.slice(0, 1000),
        },
        502,
      )
    }

    let parsed: unknown

    try {
      parsed = JSON.parse(text)
    } catch {
      return jsonResponse(
        {
          message: 'KHL API вернул не JSON',
          upstreamPreview: text.slice(0, 1000),
        },
        502,
      )
    }

    if (!Array.isArray(parsed)) {
      return jsonResponse(
        {
          message: 'Неожиданная структура ответа KHL API',
          receivedType: typeof parsed,
          topLevelKeys:
            parsed && typeof parsed === 'object'
              ? Object.keys(parsed as Record<string, unknown>)
              : [],
          preview: parsed,
        },
        502,
      )
    }

    const events = (parsed as KhlEventWrapper[])
      .map((item) => item?.event)
      .filter((event) => Boolean(event))

    const now = Date.now()

    const upcomingByTime = events
      .filter((event) => Number(event?.start_at ?? 0) > now)
      .sort((a, b) => Number(a?.start_at ?? 0) - Number(b?.start_at ?? 0))

    const upcomingByState = events
      .filter((event) => event?.game_state_key === 'not_yet_started')
      .sort((a, b) => Number(a?.start_at ?? 0) - Number(b?.start_at ?? 0))

    const selected = (upcomingByTime.length > 0 ? upcomingByTime : upcomingByState).slice(0, limit)

    return jsonResponse({
      items: selected,
      debug: {
        totalRawItems: parsed.length,
        totalEvents: events.length,
        upcomingByTime: upcomingByTime.length,
        upcomingByState: upcomingByState.length,
        now,
      },
    })
  } catch (error) {
    return jsonResponse(
      {
        message: 'Ошибка при загрузке ближайших матчей',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500,
    )
  }
})
```

# hockey-match-details
```
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json',
}

type KhlPlayerStat = {
  id?: string
  title?: string
  val?: number
  max?: number
}

type KhlPlayer = {
  id?: number
  khl_id?: number
  shirt_number?: number
  name?: string
  role_key?: string
  image?: string | null
  match_stats?: KhlPlayerStat[]
}

type KhlTopPlayer = {
  id?: string
  name?: string
  value?: string
  player?: {
    id?: number
    name?: string
    shirt_number?: number
    image?: string | null
  }
}

type KhlTeam = {
  id?: number
  khl_id?: number
  name?: string
  location?: string
  image?: string
  shots?: number
  gf?: number
  ppg?: number
  shg?: number
  ppc?: number
  vbr?: number
  pim?: number
  total_puck_control_time?: number
  total_distance_travelled?: number
  offensive_blue_line_crossings_count?: number
  active?: boolean
  top_players?: KhlTopPlayer[]
  start_fives?: KhlPlayer[]
  players?: KhlPlayer[]
}

type KhlGoal = {
  time?: number
  score?: string
  period?: number
  status?: string
  status_abbr?: string
  author?: {
    shirt_number?: number
    name?: string
    gps?: number
    team_id?: number
  }
  assistants?: Array<{
    shirt_number?: number
    name?: string
    aps?: number
  }>
}

type KhlViolation = {
  time?: number
  penalty_time?: number
  period?: number
  penalty_reason?: string
  violator?: {
    shirt_number?: number
    name?: string
    team_id?: number
  }
}

type KhlTextEvent = {
  seconds?: number
  type?: string
  period?: number | null
  time_s?: string
  text?: string
  score?: string
}

type KhlEvent = {
  id?: number
  name?: string
  score?: string
  game_state_key?: string
  start_at?: number
  event_start_at?: number
  end_at?: number
  stage_name?: string
  season?: string
  location?: string | null
  image?: string | null
  commentator?: boolean
  commentators_names?: string
  mref1?: string
  mref2?: string
  lref1?: string
  lref2?: string
  team_a?: KhlTeam
  team_b?: KhlTeam
  arena?: {
    name?: string
    city?: string
    address?: string
    capacity?: number
  }
  scores?: {
    first_period?: string | null
    second_period?: string | null
    third_period?: string | null
    overtime?: string | null
    bullitt?: string | null
  }
  goals?: KhlGoal[]
  violations?: KhlViolation[]
  text_events?: KhlTextEvent[]
  this_pair_stat?: {
    events_count?: number
    team_a?: {
      wins_count?: number
      goals_count?: number
      points_count?: number
    }
    team_b?: {
      wins_count?: number
      goals_count?: number
      points_count?: number
    }
  }
}

type KhlResponse = {
  event?: KhlEvent
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders,
  })
}

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function mapPlayer(player?: KhlPlayer | null) {
  if (!player) return null

  return {
    id: toNumber(player.id),
    khlId: toNumber(player.khl_id),
    shirtNumber: toNumber(player.shirt_number),
    name: player.name ?? '',
    roleKey: player.role_key ?? '',
    image: player.image ?? null,
    matchStats: Array.isArray(player.match_stats)
      ? player.match_stats.map((stat) => ({
          id: stat.id ?? '',
          title: stat.title ?? '',
          value: toNumber(stat.val),
          max: toNumber(stat.max),
        }))
      : [],
  }
}

function mapTopPlayer(item?: KhlTopPlayer | null) {
  if (!item) return null

  return {
    id: item.id ?? '',
    name: item.name ?? '',
    value: item.value ?? '',
    player: item.player
      ? {
          id: toNumber(item.player.id),
          name: item.player.name ?? '',
          shirtNumber: toNumber(item.player.shirt_number),
          image: item.player.image ?? null,
        }
      : null,
  }
}

function mapTeam(team?: KhlTeam | null) {
  if (!team) return null

  return {
    id: toNumber(team.id),
    khlId: toNumber(team.khl_id),
    name: team.name ?? '',
    location: team.location ?? '',
    image: team.image ?? null,
    shots: toNumber(team.shots),
    goals: toNumber(team.gf),
    powerPlayGoals: toNumber(team.ppg),
    shortHandedGoals: toNumber(team.shg),
    powerPlayChances: toNumber(team.ppc),
    blockedShots: toNumber(team.vbr),
    penaltyMinutes: toNumber(team.pim),
    puckControlTime: toNumber(team.total_puck_control_time),
    distanceTravelled: toNumber(team.total_distance_travelled),
    offensiveBlueLineCrossings: toNumber(team.offensive_blue_line_crossings_count),
    active: Boolean(team.active),
    topPlayers: Array.isArray(team.top_players)
      ? team.top_players.map(mapTopPlayer).filter(Boolean)
      : [],
    startFives: Array.isArray(team.start_fives)
      ? team.start_fives.map(mapPlayer).filter(Boolean)
      : [],
    players: Array.isArray(team.players)
      ? team.players.map(mapPlayer).filter(Boolean)
      : [],
  }
}

function groupPlayersByRole(players: ReturnType<typeof mapPlayer>[]) {
  return {
    goalkeepers: players.filter((player) => player?.roleKey === 'goaltender'),
    defensemen: players.filter((player) => player?.roleKey === 'defensemen'),
    forwards: players.filter((player) => player?.roleKey === 'forward'),
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    let matchId: string | null = null
    let locale = 'ru'

    if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}))
      matchId = body?.matchId ? String(body.matchId) : null
      locale = typeof body?.locale === 'string' ? body.locale : 'ru'
    } else {
      const url = new URL(req.url)
      matchId = url.searchParams.get('matchId')
      locale = url.searchParams.get('locale') || 'ru'
    }

    if (!matchId) {
      return jsonResponse(
        {
          message: 'Не передан matchId',
        },
        400,
      )
    }

    const upstreamUrl = new URL('https://khl.api.webcaster.pro/api/khl_mobile/event_v2.json')
    upstreamUrl.searchParams.set('id', matchId)
    upstreamUrl.searchParams.set('locale', locale)
    upstreamUrl.searchParams.set('application', 'khl_web')
    upstreamUrl.searchParams.set('deviceid', 'supabase-edge')
    upstreamUrl.searchParams.set('installid', 'supabase-edge')

    const upstreamResponse = await fetch(upstreamUrl.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Language': locale,
        'User-Agent': 'Mozilla/5.0',
        'Cache-Control': 'no-cache',
      },
    })

    const text = await upstreamResponse.text()

    if (!upstreamResponse.ok) {
      return jsonResponse(
        {
          message: 'Не удалось получить матч',
          upstreamStatus: upstreamResponse.status,
          upstreamPreview: text.slice(0, 1000),
        },
        502,
      )
    }

    let parsed: KhlResponse

    try {
      parsed = JSON.parse(text)
    } catch {
      return jsonResponse(
        {
          message: 'KHL API вернул не JSON',
          upstreamPreview: text.slice(0, 1000),
        },
        502,
      )
    }

    const event = parsed?.event

    if (!event) {
      return jsonResponse(
        {
          message: 'Матч не найден',
          matchId,
        },
        404,
      )
    }

    const teamA = mapTeam(event.team_a)
    const teamB = mapTeam(event.team_b)

    return jsonResponse({
      item: {
        id: toNumber(event.id),
        name: event.name ?? '',
        score: event.score ?? '',
        gameStateKey: event.game_state_key ?? null,
        startAt: toNumber(event.start_at ?? event.event_start_at),
        endAt: event.end_at ? toNumber(event.end_at) : null,
        stageName: event.stage_name ?? '',
        season: event.season ?? '',
        location: event.location ?? null,
        image: event.image ?? null,
        commentator: Boolean(event.commentator),
        commentatorsNames: event.commentators_names ?? '',
        referees: {
          main: [event.mref1, event.mref2].filter(Boolean),
          linesmen: [event.lref1, event.lref2].filter(Boolean),
        },
        arena: {
          name: event.arena?.name ?? '',
          city: event.arena?.city ?? '',
          address: event.arena?.address ?? '',
          capacity: toNumber(event.arena?.capacity),
        },
        scoresByPeriods: {
          firstPeriod: event.scores?.first_period ?? null,
          secondPeriod: event.scores?.second_period ?? null,
          thirdPeriod: event.scores?.third_period ?? null,
          overtime: event.scores?.overtime ?? null,
          shootout: event.scores?.bullitt ?? null,
        },
        teamA: teamA
          ? {
              ...teamA,
              roster: groupPlayersByRole(teamA.players),
            }
          : null,
        teamB: teamB
          ? {
              ...teamB,
              roster: groupPlayersByRole(teamB.players),
            }
          : null,
        goals: Array.isArray(event.goals)
          ? event.goals.map((goal) => ({
              time: toNumber(goal.time),
              period: toNumber(goal.period),
              score: goal.score ?? '',
              status: goal.status ?? '',
              statusAbbr: goal.status_abbr ?? '',
              author: {
                shirtNumber: toNumber(goal.author?.shirt_number),
                name: goal.author?.name ?? '',
                teamId: toNumber(goal.author?.team_id),
                pointsAfterGoal: toNumber(goal.author?.gps),
              },
              assistants: Array.isArray(goal.assistants)
                ? goal.assistants.map((assistant) => ({
                    shirtNumber: toNumber(assistant.shirt_number),
                    name: assistant.name ?? '',
                    assistsAfterGoal: toNumber(assistant.aps),
                  }))
                : [],
            }))
          : [],
        violations: Array.isArray(event.violations)
          ? event.violations.map((item) => ({
              time: toNumber(item.time),
              period: toNumber(item.period),
              penaltyTime: toNumber(item.penalty_time),
              penaltyReason: item.penalty_reason ?? '',
              violator: {
                shirtNumber: toNumber(item.violator?.shirt_number),
                name: item.violator?.name ?? '',
                teamId: toNumber(item.violator?.team_id),
              },
            }))
          : [],
        textEvents: Array.isArray(event.text_events)
          ? event.text_events.map((entry) => ({
              seconds: toNumber(entry.seconds),
              type: entry.type ?? '',
              period: entry.period ?? null,
              time: entry.time_s ?? '',
              text: entry.text ?? '',
              score: entry.score ?? '',
            }))
          : [],
        headToHead: {
          totalGames: toNumber(event.this_pair_stat?.events_count),
          teamA: {
            wins: toNumber(event.this_pair_stat?.team_a?.wins_count),
            goals: toNumber(event.this_pair_stat?.team_a?.goals_count),
            points: toNumber(event.this_pair_stat?.team_a?.points_count),
          },
          teamB: {
            wins: toNumber(event.this_pair_stat?.team_b?.wins_count),
            goals: toNumber(event.this_pair_stat?.team_b?.goals_count),
            points: toNumber(event.this_pair_stat?.team_b?.points_count),
          },
        },
      },
    })
  } catch (error) {
    return jsonResponse(
      {
        message: 'Ошибка при загрузке страницы матча',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500,
    )
  }
})
```

# recalculate-elo
```
import { serve } from "https://deno.land/std@0.224.0/http/server.ts"
import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2"

type Json = Record<string, unknown>
type RecalculateMode = "full_rebuild"

type TeamRatingRow = {
  team_id: string
  team_name: string
  season_id: string
  rating: number
  matches_played: number
  wins: number
  losses: number
  updated_at?: string
}

type NormalizedMatch = {
  matchId: string
  seasonId: string | null
  stageId: string | null
  stageName: string | null
  matchDate: string
  homeTeamId: string
  homeTeamName: string
  awayTeamId: string
  awayTeamName: string
  homeScore: number
  awayScore: number
}

type SeasonConfigRow = {
  season_id: string
  season_label: string
  regular_stage_id: string | null
  regular_stage_name: string | null
  playoff_stage_id: string | null
  playoff_stage_name: string | null
  is_active: boolean
  source: string
}

type StageConfig = {
  id: string
  title: string
  type: "regular" | "playoff"
}

type DbEnvelope<T> = {
  data?: T | null
  error?: {
    message?: string
    details?: string
    hint?: string
    code?: string
  } | null
  count?: number | null
  status?: number
  statusText?: string
}

const START_RATING = 1500
const K_FACTOR = 20
const HOME_ADVANTAGE = 50
const CACHE_TTL_HOURS = 24

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

function hockeyDb(supabase: SupabaseClient) {
  return supabase.schema("hockey")
}

function safeStringify(value: unknown) {
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}

function logStep(step: string, payload?: unknown) {
  if (payload === undefined) {
    console.log(`[recalculate-elo] ${step}`)
    return
  }

  console.log(`[recalculate-elo] ${step}: ${safeStringify(payload)}`)
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === "string") return error

  try {
    return JSON.stringify(error)
  } catch {
    return String(error)
  }
}

function formatDbError(error: DbEnvelope<unknown>["error"]) {
  if (!error) return "Unknown database error"

  const parts = [
    error.message,
    error.details,
    error.hint,
    error.code ? `code=${error.code}` : null,
  ].filter(Boolean)

  return parts.join(" | ")
}

async function execDb<T>(
  step: string,
  queryFactory: () => PromiseLike<unknown> | Promise<unknown>,
): Promise<DbEnvelope<T>> {
  logStep(`${step}:start`)

  let rawResponse: unknown

  try {
    rawResponse = await queryFactory()
  } catch (error) {
    throw new Error(`[${step}] Query execution failed: ${getErrorMessage(error)}`)
  }

  logStep(`${step}:raw_response`, rawResponse)

  if (rawResponse == null || typeof rawResponse !== "object") {
    throw new Error(`[${step}] Query returned null/undefined or non-object response`)
  }

  return rawResponse as DbEnvelope<T>
}

async function dbSelectOne<T>(
  step: string,
  queryFactory: () => PromiseLike<unknown> | Promise<unknown>,
): Promise<T | null> {
  const response = await execDb<T>(step, queryFactory)

  if (response.error) {
    throw new Error(`[${step}] ${formatDbError(response.error)}`)
  }

  return (response.data ?? null) as T | null
}

async function dbSelectMany<T>(
  step: string,
  queryFactory: () => PromiseLike<unknown> | Promise<unknown>,
): Promise<T[]> {
  const response = await execDb<T[]>(step, queryFactory)

  if (response.error) {
    throw new Error(`[${step}] ${formatDbError(response.error)}`)
  }

  if (!Array.isArray(response.data)) {
    throw new Error(`[${step}] Expected array in data`)
  }

  return response.data
}

async function dbExec(
  step: string,
  queryFactory: () => PromiseLike<unknown> | Promise<unknown>,
) {
  const response = await execDb<unknown>(step, queryFactory)

  if (response.error) {
    throw new Error(`[${step}] ${formatDbError(response.error)}`)
  }
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }

  return fallback
}

function toStringSafe(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value
  if (typeof value === "number") return String(value)
  return fallback
}

function extractArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload

  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>

    if (Array.isArray(obj.data)) return obj.data
    if (Array.isArray(obj.items)) return obj.items
    if (Array.isArray(obj.events)) return obj.events
    if (Array.isArray(obj.seasons)) return obj.seasons
    if (Array.isArray(obj.stages)) return obj.stages
    if (Array.isArray(obj.list)) return obj.list
  }

  return []
}

function unwrapEvent(raw: Json): Json {
  return ((raw.event as Json | undefined) ?? raw) as Json
}

function parseMatchDate(source: Json): string | null {
  const startAt =
    source.start_at ??
    source.start_at_iso ??
    source.date_start ??
    source.datetime

  if (typeof startAt === "number" && Number.isFinite(startAt)) {
    return new Date(startAt).toISOString()
  }

  if (typeof startAt === "string" && startAt.trim() !== "") {
    const asNumber = Number(startAt)

    if (Number.isFinite(asNumber)) {
      return new Date(asNumber).toISOString()
    }

    const parsed = new Date(startAt)
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString()
    }
  }

  const unixSeconds =
    toNumber(source.start_at_time_from_unixtime, NaN) ||
    toNumber(source.start_at_unix, NaN) ||
    toNumber(source.timestamp, NaN)

  if (Number.isFinite(unixSeconds)) {
    return new Date(unixSeconds * 1000).toISOString()
  }

  return null
}

function parseScore(source: Json): { homeScore: number; awayScore: number } | null {
  let homeScore = toNumber(
    source.score_a ?? source.team_a_score ?? source.score1 ?? source.home_score,
    NaN,
  )

  let awayScore = toNumber(
    source.score_b ?? source.team_b_score ?? source.score2 ?? source.away_score,
    NaN,
  )

  if (Number.isFinite(homeScore) && Number.isFinite(awayScore)) {
    return { homeScore, awayScore }
  }

  const scoreText = toStringSafe(source.score ?? source.sscore)
  const match = scoreText.match(/^(\d+)\s*:\s*(\d+)$/)

  if (!match) return null

  homeScore = Number(match[1])
  awayScore = Number(match[2])

  if (!Number.isFinite(homeScore) || !Number.isFinite(awayScore)) {
    return null
  }

  return { homeScore, awayScore }
}

function isFinishedMatch(raw: Json): boolean {
  const source = unwrapEvent(raw)

  const state = toStringSafe(
    source.game_state_key ??
      source.status ??
      source.status_code ??
      source.state ??
      source.match_state,
  ).toLowerCase()

  if (["not_yet_started", "scheduled", "soon", "created"].includes(state)) {
    return false
  }

  const parsedDate = parseMatchDate(source)
  if (!parsedDate) return false

  if (new Date(parsedDate).getTime() > Date.now()) {
    return false
  }

  const parsedScore = parseScore(source)
  if (!parsedScore) return false

  if (parsedScore.homeScore === parsedScore.awayScore) {
    return false
  }

  return true
}

function normalizeEvent(raw: Json): NormalizedMatch | null {
  const source = unwrapEvent(raw)

  if (!isFinishedMatch(source)) return null

  const id = toStringSafe(source.id ?? source.match_id)
  if (!id) return null

  const stageObj = (source.stage as Json | undefined) ?? {}
  const seasonObj = (source.season as Json | undefined) ?? {}

  const stageId = toStringSafe(source.stage_id ?? stageObj.id ?? "") || null
  const seasonId = toStringSafe(source.season_id ?? seasonObj.id ?? "") || null
  const stageName = toStringSafe(
    stageObj.name ?? stageObj.title ?? source.stage_name ?? "",
  ) || null

  const matchDate = parseMatchDate(source)
  if (!matchDate) return null

  const teamA = (source.team_a as Json | undefined) ?? {}
  const teamB = (source.team_b as Json | undefined) ?? {}

  const homeTeamId = toStringSafe(teamA.id ?? source.team_a_id ?? source.home_team_id)
  const awayTeamId = toStringSafe(teamB.id ?? source.team_b_id ?? source.away_team_id)

  const homeTeamName = toStringSafe(
    teamA.name ?? source.team_a_name ?? source.home_team_name,
  )
  const awayTeamName = toStringSafe(
    teamB.name ?? source.team_b_name ?? source.away_team_name,
  )

  if (!homeTeamId || !awayTeamId || !homeTeamName || !awayTeamName) {
    return null
  }

  const parsedScore = parseScore(source)
  if (!parsedScore) return null

  return {
    matchId: id,
    seasonId,
    stageId,
    stageName,
    matchDate,
    homeTeamId,
    homeTeamName,
    awayTeamId,
    awayTeamName,
    homeScore: parsedScore.homeScore,
    awayScore: parsedScore.awayScore,
  }
}

function getExpectedScore(homeRating: number, awayRating: number): number {
  const adjustedHome = homeRating + HOME_ADVANTAGE
  return 1 / (1 + 10 ** ((awayRating - adjustedHome) / 400))
}

function calculateNextRatings(
  homeRating: number,
  awayRating: number,
  homeWon: boolean,
) {
  const expectedHome = getExpectedScore(homeRating, awayRating)
  const expectedAway = 1 - expectedHome

  const actualHome = homeWon ? 1 : 0
  const actualAway = homeWon ? 0 : 1

  const newHome = homeRating + K_FACTOR * (actualHome - expectedHome)
  const newAway = awayRating + K_FACTOR * (actualAway - expectedAway)

  return {
    expectedHome,
    expectedAway,
    newHome: Number(newHome.toFixed(2)),
    newAway: Number(newAway.toFixed(2)),
  }
}

async function fetchJson(url: string): Promise<unknown> {
  logStep("fetchJson", { url })

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  })

  if (!response.ok) {
    const responseText = await response.text().catch(() => "")
    throw new Error(
      `KHL API error: ${response.status} ${response.statusText}. URL: ${url}. BODY: ${responseText}`,
    )
  }

  return await response.json()
}

async function updateJobState(
  supabase: SupabaseClient,
  payload: Record<string, unknown>,
) {
  try {
    await dbExec("updateJobState", () =>
      hockeyDb(supabase)
        .from("elo_job_state")
        .upsert(payload, { onConflict: "job_name" }),
    )
  } catch (error) {
    console.error("[recalculate-elo] updateJobState failed:", error)
  }
}

async function fetchSeasonConfig(
  supabase: SupabaseClient,
  seasonId: string,
): Promise<SeasonConfigRow> {
  const data = await dbSelectOne<SeasonConfigRow>("fetchSeasonConfig", () =>
    hockeyDb(supabase)
      .from("elo_seasons")
      .select("*")
      .eq("season_id", seasonId)
      .single(),
  )

  if (!data) {
    throw new Error(`[fetchSeasonConfig] Season config not found for ${seasonId}`)
  }

  return data
}

async function fetchAllSeasonConfigs(
  supabase: SupabaseClient,
): Promise<SeasonConfigRow[]> {
  const rows = await dbSelectMany<SeasonConfigRow>("fetchAllSeasonConfigs", () =>
    hockeyDb(supabase)
      .from("elo_seasons")
      .select("*")
      .order("season_id", { ascending: false }),
  )

  return rows.filter((item) => item.regular_stage_id || item.playoff_stage_id)
}

function buildStageConfigs(seasonConfig: SeasonConfigRow): StageConfig[] {
  const stages: StageConfig[] = []

  if (seasonConfig.regular_stage_id) {
    stages.push({
      id: seasonConfig.regular_stage_id,
      title: seasonConfig.regular_stage_name ?? "Регулярный чемпионат",
      type: "regular",
    })
  }

  if (seasonConfig.playoff_stage_id) {
    stages.push({
      id: seasonConfig.playoff_stage_id,
      title: seasonConfig.playoff_stage_name ?? "Плей-офф",
      type: "playoff",
    })
  }

  if (!stages.length) {
    throw new Error(`No regular/playoff stages configured for season ${seasonConfig.season_id}`)
  }

  return stages
}

async function fetchAllFinishedMatchesByStage(
  baseUrl: string,
  stageId: string,
  locale: string,
): Promise<NormalizedMatch[]> {
  const allMatches: NormalizedMatch[] = []
  let page = 1

  while (true) {
    const url = new URL(`${baseUrl}/events_v2.json`)
    url.searchParams.set("stage_id", stageId)
    url.searchParams.set("page", String(page))
    url.searchParams.set("order_direction", "asc")
    url.searchParams.set("locale", locale)
    url.searchParams.set("application", "khl_web")

    const payload = await fetchJson(url.toString())
    const rawItems = extractArray(payload)

    logStep("fetchAllFinishedMatchesByStage:page", {
      stageId,
      page,
      rawItemsCount: rawItems.length,
    })

    if (!rawItems.length) break

    const normalizedPage = rawItems
      .map((item) => normalizeEvent((item ?? {}) as Json))
      .filter((item): item is NormalizedMatch => Boolean(item))

    allMatches.push(...normalizedPage)

    page += 1

    if (rawItems.length < 16) break
  }

  return allMatches
}

async function fetchAllFinishedMatchesForSeason(
  baseUrl: string,
  locale: string,
  seasonConfig: SeasonConfigRow,
): Promise<{
  seasonId: string
  seasonName: string
  matches: NormalizedMatch[]
  stagesUsed: StageConfig[]
}> {
  const stagesUsed = buildStageConfigs(seasonConfig)
  const matchesMap = new Map<string, NormalizedMatch>()

  logStep("fetchAllFinishedMatchesForSeason:start", {
    seasonId: seasonConfig.season_id,
    stagesUsed,
  })

  for (const stage of stagesUsed) {
    const stageMatches = await fetchAllFinishedMatchesByStage(baseUrl, stage.id, locale)

    logStep("fetchAllFinishedMatchesForSeason:stageLoaded", {
      seasonId: seasonConfig.season_id,
      stageId: stage.id,
      stageTitle: stage.title,
      matchesCount: stageMatches.length,
    })

    for (const match of stageMatches) {
      matchesMap.set(match.matchId, {
        ...match,
        seasonId: seasonConfig.season_id,
        stageId: match.stageId ?? stage.id,
        stageName: match.stageName ?? stage.title,
      })
    }
  }

  const matches = Array.from(matchesMap.values())

  matches.sort((a, b) => {
    const byDate = new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime()
    if (byDate !== 0) return byDate
    return a.matchId.localeCompare(b.matchId)
  })

  return {
    seasonId: seasonConfig.season_id,
    seasonName: seasonConfig.season_label,
    matches,
    stagesUsed,
  }
}

function buildCacheKey(seasonId: string) {
  return `elo:${seasonId}:regular+playoff`
}

async function getValidCache(
  supabase: SupabaseClient,
  seasonId: string,
): Promise<Record<string, unknown> | null> {
  const cacheKey = buildCacheKey(seasonId)

  return await dbSelectOne<Record<string, unknown>>("getValidCache", () =>
    hockeyDb(supabase)
      .from("elo_rebuild_cache")
      .select("*")
      .eq("cache_key", cacheKey)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle(),
  )
}

async function saveCache(
  supabase: SupabaseClient,
  seasonId: string,
  payload: Record<string, unknown>,
) {
  const cacheKey = buildCacheKey(seasonId)
  const now = new Date()
  const expiresAt = new Date(now.getTime() + CACHE_TTL_HOURS * 60 * 60 * 1000)

  await dbExec("saveCache", () =>
    hockeyDb(supabase)
      .from("elo_rebuild_cache")
      .upsert(
        {
          cache_key: cacheKey,
          season_id: seasonId,
          calculated_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
          result: payload,
        },
        { onConflict: "cache_key" },
      ),
  )
}

async function deleteSeasonData(
  supabase: SupabaseClient,
  seasonId: string,
) {
  await dbExec("deleteSeasonData:snapshots", () =>
    hockeyDb(supabase)
      .from("elo_rating_snapshots")
      .delete()
      .eq("season_id", seasonId),
  )

  await dbExec("deleteSeasonData:matches", () =>
    hockeyDb(supabase)
      .from("elo_matches")
      .delete()
      .eq("season_id", seasonId),
  )

  await dbExec("deleteSeasonData:ratings", () =>
    hockeyDb(supabase)
      .from("elo_team_ratings")
      .delete()
      .eq("season_id", seasonId),
  )
}

async function upsertEloMatches(
  supabase: SupabaseClient,
  rows: Json[],
) {
  if (!rows.length) return

  await dbExec("upsertEloMatches", () =>
    hockeyDb(supabase)
      .from("elo_matches")
      .upsert(rows, { onConflict: "match_id" }),
  )
}

async function upsertSnapshots(
  supabase: SupabaseClient,
  rows: Json[],
) {
  if (!rows.length) return

  await dbExec("upsertSnapshots", () =>
    hockeyDb(supabase)
      .from("elo_rating_snapshots")
      .upsert(rows, { onConflict: "match_id,team_id" }),
  )
}

async function upsertTeamRatings(
  supabase: SupabaseClient,
  rows: TeamRatingRow[],
) {
  if (!rows.length) return

  await dbExec("upsertTeamRatings", () =>
    hockeyDb(supabase)
      .from("elo_team_ratings")
      .upsert(rows, { onConflict: "team_id,season_id" }),
  )
}

async function recalculateSingleSeason(
  supabase: SupabaseClient,
  khlBaseUrl: string,
  khlLocale: string,
  seasonId: string,
  mode: RecalculateMode,
  force: boolean,
) {
  logStep("recalculateSingleSeason:start", { seasonId, mode, force })

  if (!force) {
    const validCache = await getValidCache(supabase, seasonId)

    if (validCache?.result) {
      return {
        ok: true,
        fromCache: true,
        seasonId,
        ...(validCache.result as Record<string, unknown>),
      }
    }
  }

  const seasonConfig = await fetchSeasonConfig(supabase, seasonId)

  const {
    seasonId: resolvedSeasonId,
    seasonName,
    matches,
    stagesUsed,
  } = await fetchAllFinishedMatchesForSeason(khlBaseUrl, khlLocale, seasonConfig)

  if (mode === "full_rebuild") {
    await deleteSeasonData(supabase, resolvedSeasonId)
  }

  const ratingsMap = new Map<string, TeamRatingRow>()
  const eloMatchesRows: Json[] = []
  const snapshotRows: Json[] = []

  for (const match of matches) {
    const homeKey = `${match.homeTeamId}:${resolvedSeasonId}`
    const awayKey = `${match.awayTeamId}:${resolvedSeasonId}`

    const existingHome = ratingsMap.get(homeKey) ?? {
      team_id: match.homeTeamId,
      team_name: match.homeTeamName,
      season_id: resolvedSeasonId,
      rating: START_RATING,
      matches_played: 0,
      wins: 0,
      losses: 0,
    }

    const existingAway = ratingsMap.get(awayKey) ?? {
      team_id: match.awayTeamId,
      team_name: match.awayTeamName,
      season_id: resolvedSeasonId,
      rating: START_RATING,
      matches_played: 0,
      wins: 0,
      losses: 0,
    }

    const homeWon = match.homeScore > match.awayScore
    const ratingHomeBefore = existingHome.rating
    const ratingAwayBefore = existingAway.rating

    const { newHome, newAway } = calculateNextRatings(
      ratingHomeBefore,
      ratingAwayBefore,
      homeWon,
    )

    const processedAt = new Date().toISOString()

    const updatedHome: TeamRatingRow = {
      ...existingHome,
      team_name: match.homeTeamName,
      season_id: resolvedSeasonId,
      rating: newHome,
      matches_played: existingHome.matches_played + 1,
      wins: existingHome.wins + (homeWon ? 1 : 0),
      losses: existingHome.losses + (homeWon ? 0 : 1),
      updated_at: processedAt,
    }

    const updatedAway: TeamRatingRow = {
      ...existingAway,
      team_name: match.awayTeamName,
      season_id: resolvedSeasonId,
      rating: newAway,
      matches_played: existingAway.matches_played + 1,
      wins: existingAway.wins + (homeWon ? 0 : 1),
      losses: existingAway.losses + (homeWon ? 1 : 0),
      updated_at: processedAt,
    }

    ratingsMap.set(homeKey, updatedHome)
    ratingsMap.set(awayKey, updatedAway)

    eloMatchesRows.push({
      match_id: match.matchId,
      season_id: resolvedSeasonId,
      stage_id: match.stageId,
      stage_name: match.stageName,
      match_date: match.matchDate,
      home_team_id: match.homeTeamId,
      home_team_name: match.homeTeamName,
      away_team_id: match.awayTeamId,
      away_team_name: match.awayTeamName,
      home_score: match.homeScore,
      away_score: match.awayScore,
      winner_team_id: homeWon ? match.homeTeamId : match.awayTeamId,
      rating_home_before: ratingHomeBefore,
      rating_away_before: ratingAwayBefore,
      rating_home_after: newHome,
      rating_away_after: newAway,
      processed_at: processedAt,
    })

    snapshotRows.push({
      season_id: resolvedSeasonId,
      stage_id: match.stageId,
      stage_name: match.stageName,
      match_id: match.matchId,
      match_date: match.matchDate,
      team_id: match.homeTeamId,
      team_name: match.homeTeamName,
      rating_before: ratingHomeBefore,
      rating_after: newHome,
      opponent_team_id: match.awayTeamId,
      opponent_team_name: match.awayTeamName,
      is_home: true,
      team_score: match.homeScore,
      opponent_score: match.awayScore,
      result: homeWon ? "win" : "loss",
    })

    snapshotRows.push({
      season_id: resolvedSeasonId,
      stage_id: match.stageId,
      stage_name: match.stageName,
      match_id: match.matchId,
      match_date: match.matchDate,
      team_id: match.awayTeamId,
      team_name: match.awayTeamName,
      rating_before: ratingAwayBefore,
      rating_after: newAway,
      opponent_team_id: match.homeTeamId,
      opponent_team_name: match.homeTeamName,
      is_home: false,
      team_score: match.awayScore,
      opponent_score: match.homeScore,
      result: homeWon ? "loss" : "win",
    })
  }

  const ratingRows = Array.from(ratingsMap.values())

  logStep("recalculateSingleSeason:preparedRows", {
    matches: eloMatchesRows.length,
    snapshots: snapshotRows.length,
    ratings: ratingRows.length,
  })

  await upsertEloMatches(supabase, eloMatchesRows)
  await upsertSnapshots(supabase, snapshotRows)
  await upsertTeamRatings(supabase, ratingRows)

  const responsePayload = {
    function: "recalculate-elo",
    mode,
    fromCache: false,
    seasonId: resolvedSeasonId,
    seasonName,
    matchesProcessed: eloMatchesRows.length,
    teamsUpdated: ratingRows.length,
    snapshotsInserted: snapshotRows.length,
    stagesUsed: stagesUsed.map((stage) => ({
      id: stage.id,
      title: stage.title,
      type: stage.type,
    })),
    calculatedAt: new Date().toISOString(),
  }

  await saveCache(supabase, resolvedSeasonId, responsePayload)

  return {
    ok: true,
    ...responsePayload,
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: corsHeaders,
    })
  }

  const startedAt = new Date().toISOString()
  let supabase: SupabaseClient | null = null
  let currentStep = "init"

  try {
    currentStep = "parse_body"

    let body: Record<string, unknown> = {}

    try {
      body = await req.json()
    } catch (error) {
      return new Response(
        JSON.stringify({
          ok: false,
          step: currentStep,
          error: "Invalid JSON body",
          details: getErrorMessage(error),
        }),
        {
          headers: corsHeaders,
          status: 400,
        },
      )
    }

    logStep("request:body", body)

    const mode = (body?.mode ?? "full_rebuild") as RecalculateMode
    const seasonId = typeof body?.season_id === "string" ? body.season_id : null
    const processAllSeasons = Boolean(body?.process_all_seasons)
    const force = Boolean(body?.force)

    currentStep = "read_env"

    const supabaseUrl = Deno.env.get("SUPABASE_URL")
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    const khlBaseUrl = Deno.env.get("KHL_BASE_URL")
    const khlLocale = Deno.env.get("KHL_LOCALE") ?? "ru"

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
    }

    if (!khlBaseUrl) {
      throw new Error("Missing KHL_BASE_URL")
    }

    if (!seasonId && !processAllSeasons) {
      throw new Error("season_id is required unless process_all_seasons=true")
    }

    currentStep = "create_supabase_client"
    supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

    currentStep = "update_job_state_started"
    await updateJobState(supabase, {
      job_name: "recalculate-elo",
      last_run_at: startedAt,
      updated_at: startedAt,
      last_error: null,
    })

    if (processAllSeasons) {
      currentStep = "fetch_all_seasons"
      const seasons = await fetchAllSeasonConfigs(supabase)
      const results: Record<string, unknown>[] = []

      for (const season of seasons) {
        try {
          currentStep = `recalculate_season_${season.season_id}`

          const result = await recalculateSingleSeason(
            supabase,
            khlBaseUrl,
            khlLocale,
            season.season_id,
            mode,
            force,
          )

          results.push(result)
        } catch (error) {
          results.push({
            ok: false,
            seasonId: season.season_id,
            step: currentStep,
            error: getErrorMessage(error),
          })
        }
      }

      currentStep = "update_job_state_success_all"
      await updateJobState(supabase, {
        job_name: "recalculate-elo",
        last_run_at: startedAt,
        last_success_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_error: null,
      })

      return new Response(
        JSON.stringify({
          ok: true,
          processAllSeasons: true,
          seasonsProcessed: results.length,
          results,
        }),
        {
          headers: corsHeaders,
          status: 200,
        },
      )
    }

    currentStep = "recalculate_single_season"

    const result = await recalculateSingleSeason(
      supabase,
      khlBaseUrl,
      khlLocale,
      seasonId as string,
      mode,
      force,
    )

    currentStep = "update_job_state_success_single"
    await updateJobState(supabase, {
      job_name: "recalculate-elo",
      last_run_at: startedAt,
      last_success_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_error: null,
    })

    return new Response(JSON.stringify(result), {
      headers: corsHeaders,
      status: 200,
    })
  } catch (error) {
    const message = getErrorMessage(error)

    console.error("[recalculate-elo] fatal error:", error)

    if (supabase) {
      await updateJobState(supabase, {
        job_name: "recalculate-elo",
        last_run_at: startedAt,
        updated_at: new Date().toISOString(),
        last_error: `[${currentStep}] ${message}`,
      })
    }

    return new Response(
      JSON.stringify({
        ok: false,
        step: currentStep,
        error: message,
      }),
      {
        headers: corsHeaders,
        status: 500,
      },
    )
  }
})
```