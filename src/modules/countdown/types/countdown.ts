export type CountdownMood = 'calm' | 'excited' | 'romantic' | 'party'

export interface CountdownEvent {
  id: string
  title: string
  description: string
  targetDate: string
  emoji: string
  mood: CountdownMood
  color: string
  createdAt: string
}

export interface CountdownDiff {
  isExpired: boolean
  isToday: boolean
  totalMs: number
  totalDays: number
  days: number
  hours: number
  minutes: number
  seconds: number
  progressPercent: number
}

export interface CountdownFormValues {
  title: string
  description: string
  targetDate: string
  emoji: string
  mood: CountdownMood
  color: string
}
