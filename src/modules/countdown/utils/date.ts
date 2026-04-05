import type { CountdownDiff } from '../types/countdown'

const DAY_MS = 24 * 60 * 60 * 1000
const HOUR_MS = 60 * 60 * 1000
const MINUTE_MS = 60 * 1000
const SECOND_MS = 1000

interface GetCountdownDiffParams {
  targetDate: string | Date
  createdAt: string | Date
  now?: Date
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function getCountdownDiff({
                                   targetDate,
                                   createdAt,
                                   now = new Date(),
                                 }: GetCountdownDiffParams): CountdownDiff {
  const targetTime = new Date(targetDate).getTime()
  const createdTime = new Date(createdAt).getTime()
  const currentTime = now.getTime()

  const distance = targetTime - currentTime
  const safeDistance = Math.max(0, distance)

  const days = Math.floor(safeDistance / DAY_MS)
  const hours = Math.floor((safeDistance % DAY_MS) / HOUR_MS)
  const minutes = Math.floor((safeDistance % HOUR_MS) / MINUTE_MS)
  const seconds = Math.floor((safeDistance % MINUTE_MS) / SECOND_MS)

  const isExpired = distance < 0
  const isToday = !isExpired && days === 0

  let progressPercent = 0

  const hasValidDates =
      !Number.isNaN(targetTime) &&
      !Number.isNaN(createdTime) &&
      targetTime > createdTime

  if (!hasValidDates) {
    progressPercent = isExpired ? 100 : 0
  } else if (currentTime <= createdTime) {
    progressPercent = 0
  } else if (currentTime >= targetTime) {
    progressPercent = 100
  } else {
    const totalDuration = targetTime - createdTime
    const elapsedDuration = currentTime - createdTime

    progressPercent = clamp((elapsedDuration / totalDuration) * 100, 0, 100)
  }

  return {
    isExpired,
    isToday,
    totalMs: safeDistance,
    totalDays: Math.ceil(safeDistance / DAY_MS),
    days,
    hours,
    minutes,
    seconds,
    progressPercent,
  }
}

export function formatCountdownDate(value: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function pluralizeDays(value: number): string {
  const mod10 = value % 10
  const mod100 = value % 100

  if (mod10 === 1 && mod100 !== 11) return 'день'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'дня'

  return 'дней'
}

export function buildCountdownMessage(days: number): string {
  if (days > 180) return 'Ещё далеко, но ожидание уже греет.'
  if (days > 60) return 'Событие всё ближе. Уже можно строить планы.'
  if (days > 14) return 'Настроение: уверенное предвкушение.'
  if (days > 3) return 'Осталось совсем немного. Пора готовиться.'
  if (days > 0) return 'Финальный отсчёт пошёл ✨'
  return 'Этот день наступил'
}