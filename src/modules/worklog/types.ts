export interface WorkLogRow {
  id: string
  user_id: string
  work_date: string
  hours: number
  project: string
  note: string
  created_at: string
  updated_at: string
}

export interface WorkLog {
  id: string
  userId: string
  workDate: string
  hours: number
  project: string
  note: string
  createdAt: string
  updatedAt: string
}

export interface WorkLogFormValues {
  workDate: string
  hours: string
  project: string
  note: string
}

export interface WorkLogInsertPayload {
  workDate: string
  hours: number
  project: string
  note: string
}

export interface WorkLogUpdatePayload extends WorkLogInsertPayload {
  id: string
}

export interface DayHoursStat {
  label: string
  value: number
}

export interface ProjectHoursStat {
  name: string
  value: number
}

export interface WorkLogStats {
  totalHours: number
  todayHours: number
  weekHours: number
  monthHours: number
  averagePerActiveDay: number
  streakDays: number
  activeDays: number
  topProjectName: string
  last14Days: DayHoursStat[]
  weekDistribution: DayHoursStat[]
  projectDistribution: ProjectHoursStat[]
}
