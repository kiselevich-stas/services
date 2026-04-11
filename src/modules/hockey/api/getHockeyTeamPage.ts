import { supabase } from '../../../lib/supabase'

type HockeyTeamSocialNetworks = {
    tw: string
    vk: string
    ok: string
    fb: string
    instagram: string
    youtube: string
    telegram: string
}

type HockeyTeamHeadCoach = {
    name: string
    photo: string
}

type HockeyTeam = {
    id: number
    khlId: number
    stage: string
    name: string
    location: string
    image: string | null
    division: string | null
    divisionKey: string | null
    conference: string | null
    conferenceKey: string | null
    active: boolean
    website: string
    mail: string
    foundationYear: string
    photo: string
    phone: string
    address: string
    headCoach: HockeyTeamHeadCoach
    socialNetworks: HockeyTeamSocialNetworks
}

type HockeyArena = {
    id: number
    capacity: number
    phone: string
    website: string
    name: string
    address: string
    city: string
    image: string
    geo: {
        lat: number | null
        long: number | null
    }
} | null

type HockeyMatchTeam = {
    id: number
    khlId: number
    image: string
    tvImage: string
    name: string
    location: string
} | null

type HockeyMatch = {
    id: number
    khlId: number
    matchId: string
    name: string
    gameStateKey: string
    period: number | null
    startAt: number
    eventStartAt: number
    endAt: number | null
    startAtDay: number
    stageId: number
    stageName: string
    location: string
    image: string
    score: string
    typeId: number
    hasVideo: boolean
    isFree: boolean
    teamA: HockeyMatchTeam
    teamB: HockeyMatchTeam
    scores: {
        firstPeriod: string | null
        secondPeriod: string | null
        thirdPeriod: string | null
        overtime: string | null
        shootout: string | null
    }
}

type HockeyStat = {
    id: string
    title: string
    value: number
    max: number
}

type HockeyPlayer = {
    id: number
    khlId: number
    image: string
    flagImageUrl: string
    goals: number
    assists: number
    roleKey: string
    name: string
    shirtNumber: number
    country: string
}

type HockeyRoster = {
    goalkeepers: HockeyPlayer[]
    defensemen: HockeyPlayer[]
    forwards: HockeyPlayer[]
}

type GetTeamInfoResponse = {
    item: {
        team: HockeyTeam | null
        arena: HockeyArena
        arenas: NonNullable<HockeyArena>[]
        nextMatch: HockeyMatch | null
        upcomingMatches: HockeyMatch[]
        recentMatches: HockeyMatch[]
        calendarMatches: HockeyMatch[]
        stats: HockeyStat[]
        players: HockeyPlayer[]
        roster: HockeyRoster
        meta: {
            requestedTeamId: string
            requestedStageId: string | null
        }
    }
}

export async function getHockeyTeamPage(teamId: string, stageId?: string) {
    const { data, error } = await supabase.functions.invoke('get-team-info', {
        body: {
            teamId,
            stageId,
        },
    })

    if (error) {
        throw new Error(error.message || 'Не удалось загрузить страницу команды')
    }

    return (data as GetTeamInfoResponse).item
}