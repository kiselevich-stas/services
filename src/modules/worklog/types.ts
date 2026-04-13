export interface WorkLogProjectRow {
  id: string
  name: string
}

export interface WorkLogRow {
  id: string
  user_id: string
  work_date: string
  hours: number
  project_id: string
  note: string
  created_at: string
  updated_at: string
  projects: WorkLogProjectRow | null
}

export interface WorkLog {
  id: string
  userId: string
  workDate: string
  hours: number
  projectId: string
  projectName: string
  note: string
  createdAt: string
  updatedAt: string
}

export interface WorkLogFormValues {
  workDate: string
  hours: string
  projectId: string
  note: string
}

export interface WorkLogInsertPayload {
  workDate: string
  hours: number
  projectId: string
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