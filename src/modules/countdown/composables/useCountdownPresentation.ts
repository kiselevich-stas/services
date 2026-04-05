import { computed, type ComputedRef } from 'vue'
import type { CountdownDiff, CountdownEvent } from '../types/countdown'
import { buildCountdownMessage, formatCountdownDate } from '../utils/date'

type MaybeRefValue<T> = ComputedRef<T> | { value: T }

export function useCountdownPresentation(
    event: MaybeRefValue<CountdownEvent | null>,
    diff: MaybeRefValue<CountdownDiff | null>,
) {
    const heroStyle = computed(() => ({
        '--countdown-accent': event.value?.color ?? '#8B5CF6',
    }))

    const formattedDate = computed(() => {
        if (!event.value) return ''
        return formatCountdownDate(event.value.targetDate)
    })

    const leadText = computed(() => {
        if (!diff.value) return ''
        return buildCountdownMessage(diff.value.days)
    })

    const roundedProgress = computed(() => {
        if (!diff.value) return 0
        return Math.max(0, Math.min(100, Math.round(diff.value.progressPercent)))
    })

    const remainingMs = computed(() => {
        if (!diff.value) return 0

        return (
            diff.value.days * 24 * 60 * 60 * 1000 +
            diff.value.hours * 60 * 60 * 1000 +
            diff.value.minutes * 60 * 1000 +
            diff.value.seconds * 1000
        )
    })

    const totalDays = computed(() => {
        if (!event.value || !diff.value) return 1

        const targetTime = new Date(event.value.targetDate).getTime()
        const nowTime = Date.now()
        const startTime = targetTime - remainingMs.value
        const totalMs = Math.max(1, targetTime - startTime + Math.max(0, nowTime - startTime))

        return Math.max(1, Math.ceil(totalMs / (1000 * 60 * 60 * 24)))
    })

    const passedDays = computed(() => {
        if (!diff.value) return 0
        return Math.max(0, totalDays.value - diff.value.days)
    })

    const passedDaysText = computed(() => {
        const value = passedDays.value

        if (value <= 0) return 'Путь только начался'
        if (value === 1) return '1 день уже позади'
        if (value >= 2 && value <= 4) return `${value} дня уже позади`

        return `${value} дней уже позади`
    })

    const remainingText = computed(() => {
        if (!diff.value) return ''

        if (diff.value.days === 0) return 'Уже совсем скоро'
        if (diff.value.days === 1) return 'Остался 1 день'
        if (diff.value.days >= 2 && diff.value.days <= 4) {
            return `Осталось ${diff.value.days} дня`
        }

        return `Осталось ${diff.value.days} дней`
    })

    const statusTitle = computed(() => {
        const progress = roundedProgress.value

        if (progress >= 100) return 'Момент настал'
        if (progress >= 90) return 'Финальный рывок'
        if (progress >= 75) return 'Уже очень близко'
        if (progress >= 50) return 'Экватор пройден'
        if (progress >= 25) return 'Хороший темп'

        return 'Старт ожидания'
    })

    const statusText = computed(() => {
        const progress = roundedProgress.value

        if (progress >= 100) return 'Можно праздновать 🎉'
        if (progress >= 90) return 'Осталось совсем чуть-чуть.'
        if (progress >= 75) return 'Самое долгое уже позади.'
        if (progress >= 50) return 'Ты уже прошёл больше половины пути.'
        if (progress >= 25) return 'Событие становится всё ближе.'

        return 'Начало всегда тянется дольше, дальше будет легче.'
    })

    const progressHint = computed(() => {
        const progress = roundedProgress.value

        if (progress >= 100) return 'Ожидание завершено'
        if (progress >= 80) return 'Финиш уже рядом'
        if (progress >= 50) return 'Самое тяжёлое уже позади'
        if (progress >= 25) return 'Ты уверенно движешься к событию'

        return 'Каждый день делает цель ближе'
    })

    const nextMilestone = computed(() => {
        const milestones = [25, 50, 75, 90, 100]
        return milestones.find((item) => item > roundedProgress.value) ?? 100
    })

    const milestoneHint = computed(() => {
        if (!diff.value) return ''

        if (roundedProgress.value >= 100) {
            return 'Ты у цели'
        }

        const progressLeft = nextMilestone.value - roundedProgress.value
        const daysLeft = diff.value.days

        if (daysLeft <= 0) {
            return `До ${nextMilestone.value}% — считанные часы`
        }

        const estimatedDays = Math.max(
            1,
            Math.round((daysLeft * progressLeft) / Math.max(1, 100 - roundedProgress.value)),
        )

        if (estimatedDays === 1) return `До ${nextMilestone.value}% примерно 1 день`
        if (estimatedDays >= 2 && estimatedDays <= 4) {
            return `До ${nextMilestone.value}% примерно ${estimatedDays} дня`
        }

        return `До ${nextMilestone.value}% примерно ${estimatedDays} дней`
    })

    return {
        heroStyle,
        formattedDate,
        leadText,
        roundedProgress,
        passedDaysText,
        remainingText,
        statusTitle,
        statusText,
        progressHint,
        milestoneHint,
    }
}