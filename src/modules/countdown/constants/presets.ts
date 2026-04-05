import type { CountdownMood } from '../types/countdown'

export const COUNTDOWN_STORAGE_KEY = 'weather-pulse-countdowns'

export const COUNTDOWN_MOODS: Array<{ value: CountdownMood; label: string }> = [
  { value: 'calm', label: 'Спокойное ожидание' },
  { value: 'excited', label: 'В предвкушении' },
  { value: 'romantic', label: 'Тёплое событие' },
  { value: 'party', label: 'Праздник' },
]

export const COUNTDOWN_COLORS = [
  '#8B5CF6',
  '#EC4899',
  '#F59E0B',
  '#10B981',
  '#06B6D4',
]

export const DEFAULT_COUNTDOWN = {
  title: 'Мой день рождения',
  description: 'Очень жду этот день 🎉',
  targetDate: '2027-04-12T00:00:00',
  emoji: '🎂',
  mood: 'party',
  color: '#EC4899',
} as const
