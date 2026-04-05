import type { CountdownFormValues, CountdownMood } from '../types/countdown'

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

export const DEFAULT_COUNTDOWN_FORM: CountdownFormValues = {
  title: '',
  description: '',
  targetDate: '',
  emoji: '✨',
  mood: 'excited',
  color: '#EC4899',
}
