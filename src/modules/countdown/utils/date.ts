import type { CountdownDiff } from '../types/countdown'

const DAY_MS = 24 * 60 * 60 * 1000
const HOUR_MS = 60 * 60 * 1000
const MINUTE_MS = 60 * 1000
const SECOND_MS = 1000
const YEAR_RANGE_MS = 365 * DAY_MS

export function getCountdownDiff(targetDate: string | Date, now = new Date()): CountdownDiff {
  const target = new Date(targetDate)
  const distance = target.getTime() - now.getTime()
  const safeDistance = Math.max(0, distance)

  const days = Math.floor(safeDistance / DAY_MS)
  const hours = Math.floor((safeDistance % DAY_MS) / HOUR_MS)
  const minutes = Math.floor((safeDistance % HOUR_MS) / MINUTE_MS)
  const seconds = Math.floor((safeDistance % MINUTE_MS) / SECOND_MS)

  const isExpired = distance < 0
  const isToday = !isExpired && days === 0

  return {
    isExpired,
    isToday,
    totalMs: safeDistance,
    totalDays: Math.ceil(safeDistance / DAY_MS),
    days,
    hours,
    minutes,
    seconds,
    progressPercent: Math.max(0, Math.min(100, 100 - (safeDistance / YEAR_RANGE_MS) * 100)),
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
  return 'Этот день наступил 🎉'
}
