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