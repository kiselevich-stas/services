import { computed, type Ref } from 'vue'
import type { HockeyMatchDetails } from '../types'

export function useMatchDetailsView(matchDetails: Ref<HockeyMatchDetails | null>) {
    const formattedScore = computed(() => {
        return matchDetails.value?.score || '— : —'
    })

    const formattedStartAt = computed(() => {
        if (!matchDetails.value?.startAt) {
            return '—'
        }

        return new Date(matchDetails.value.startAt).toLocaleString('ru-RU', {
            day: '2-digit',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit',
        })
    })

    const arenaLabel = computed(() => {
        const arena = matchDetails.value?.arena

        if (!arena) {
            return '—'
        }

        const parts = [arena.name, arena.city].filter(Boolean)

        return parts.length ? parts.join(', ') : '—'
    })

    const matchStatusLabel = computed(() => {
        const state = String(matchDetails.value?.gameStateKey || '').toLowerCase()

        switch (state) {
            case 'finished':
                return 'Матч завершён'
            case 'in_progress':
                return 'Матч идёт'
            case 'not_yet_started':
                return 'Матч ещё не начался'
            default:
                return matchDetails.value?.gameStateKey || 'Статус неизвестен'
        }
    })

    const periodItems = computed(() => {
        const periods = matchDetails.value?.scoresByPeriods

        if (!periods) {
            return []
        }

        return [
            { label: '1 период', value: periods.firstPeriod },
            { label: '2 период', value: periods.secondPeriod },
            { label: '3 период', value: periods.thirdPeriod },
            { label: 'ОТ', value: periods.overtime },
            { label: 'Буллиты', value: periods.shootout },
        ]
    })

    const statsComparison = computed(() => {
        const teamA = matchDetails.value?.teamA
        const teamB = matchDetails.value?.teamB

        return [
            { label: 'Броски', teamA: teamA?.shots ?? 0, teamB: teamB?.shots ?? 0 },
            { label: 'Голы', teamA: teamA?.goals ?? 0, teamB: teamB?.goals ?? 0 },
            { label: 'Power play голы', teamA: teamA?.powerPlayGoals ?? 0, teamB: teamB?.powerPlayGoals ?? 0 },
            { label: 'Power play попытки', teamA: teamA?.powerPlayChances ?? 0, teamB: teamB?.powerPlayChances ?? 0 },
            { label: 'Штрафные минуты', teamA: teamA?.penaltyMinutes ?? 0, teamB: teamB?.penaltyMinutes ?? 0 },
            { label: 'Владение шайбой', teamA: formatSeconds(teamA?.puckControlTime), teamB: formatSeconds(teamB?.puckControlTime) },
            { label: 'Дистанция', teamA: formatDistance(teamA?.distanceTravelled), teamB: formatDistance(teamB?.distanceTravelled) },
            { label: 'Входы в зону', teamA: teamA?.offensiveBlueLineCrossings ?? 0, teamB: teamB?.offensiveBlueLineCrossings ?? 0 },
        ]
    })

    function formatSeconds(value?: number | null) {
        if (!value) {
            return '0:00'
        }

        const minutes = Math.floor(value / 60)
        const seconds = value % 60

        return `${minutes}:${String(seconds).padStart(2, '0')}`
    }

    function formatDistance(value?: number | null) {
        if (!value) {
            return '0 м'
        }

        return `${value.toLocaleString('ru-RU')} м`
    }

    function getTeamNameById(teamId?: number | null) {
        if (!teamId) {
            return 'Команда'
        }

        if (teamId === matchDetails.value?.teamA?.id) {
            return matchDetails.value.teamA.name
        }

        if (teamId === matchDetails.value?.teamB?.id) {
            return matchDetails.value.teamB.name
        }

        return 'Команда'
    }
    const isLive = computed(() => {
        return String(matchDetails.value?.gameStateKey || '').toLowerCase() === 'in_progress'
    })
    return {
        formattedScore,
        formattedStartAt,
        arenaLabel,
        matchStatusLabel,
        periodItems,
        statsComparison,
        formatSeconds,
        formatDistance,
        getTeamNameById,
        isLive
    }
}