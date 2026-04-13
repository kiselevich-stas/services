import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'

import type {
  DayHoursStat,
  ProjectHoursStat,
  WorkLog,
  WorkLogInsertPayload,
  WorkLogRow,
  WorkLogStats,
  WorkLogUpdatePayload,
} from '../types'

function mapWorkLog(row: WorkLogRow): WorkLog {
  return {
    id: row.id,
    userId: row.user_id,
    workDate: row.work_date,
    hours: Number(row.hours),
    projectId: row.project_id,
    projectName: row.projects?.name ?? 'Без проекта',
    note: row.note ?? '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function toIsoDate(input: Date | string): string {
  const date = typeof input === 'string' ? new Date(input) : input

  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')

  return `${year}-${month}-${day}`
}

function addDays(date: Date, days: number): Date {
  const copy = new Date(date)
  copy.setDate(copy.getDate() + days)
  return copy
}

function startOfWeek(date: Date): Date {
  const copy = new Date(date)
  const day = copy.getDay()
  const diff = day === 0 ? -6 : 1 - day

  copy.setDate(copy.getDate() + diff)
  copy.setHours(0, 0, 0, 0)

  return copy
}

function startOfMonth(date: Date): Date {
  const copy = new Date(date)
  copy.setDate(1)
  copy.setHours(0, 0, 0, 0)
  return copy
}

function roundHours(value: number): number {
  return Math.round(value * 100) / 100
}

function datesDiffInDays(from: string, to: string): number {
  const fromDate = new Date(`${from}T00:00:00`)
  const toDate = new Date(`${to}T00:00:00`)
  const millisecondsInDay = 1000 * 60 * 60 * 24

  return Math.round((toDate.getTime() - fromDate.getTime()) / millisecondsInDay)
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}

export const useWorklogStore = defineStore('worklog', () => {
  const authStore = useAuthStore()
  const toastStore = useToastStore()

  const logs = ref<WorkLog[]>([])
  const loading = ref(false)
  const saving = ref(false)
  const deletingId = ref<string | null>(null)
  const initialized = ref(false)

  const sortedLogs = computed(() => {
    return [...logs.value].sort((firstLog, secondLog) => {
      const firstDate = `${firstLog.workDate}T${firstLog.createdAt}`
      const secondDate = `${secondLog.workDate}T${secondLog.createdAt}`

      return secondDate.localeCompare(firstDate)
    })
  })

  const stats = computed<
      WorkLogStats & {
    previousWeekHours: number
    weekDeltaHours: number
    weekDeltaPercent: number | null
    bestWeekday: string
    bestWeekdayHours: number
    bestStreak: number
    monthlyTopProject: string
    monthlyTopProjectHours: number
    recentProjects: string[]
  }
  >(() => {
    const allLogs = logs.value

    const todayDate = new Date()
    todayDate.setHours(0, 0, 0, 0)

    const today = toIsoDate(todayDate)

    const currentWeekStartDate = startOfWeek(todayDate)
    const currentWeekStart = toIsoDate(currentWeekStartDate)

    const previousWeekStartDate = addDays(currentWeekStartDate, -7)
    const previousWeekEndDate = addDays(currentWeekStartDate, -1)

    const previousWeekStart = toIsoDate(previousWeekStartDate)
    const previousWeekEnd = toIsoDate(previousWeekEndDate)

    const currentMonthStart = toIsoDate(startOfMonth(todayDate))
    const monthPrefix = currentMonthStart.slice(0, 7)

    const totalHours = roundHours(
        allLogs.reduce((sum, log) => sum + log.hours, 0),
    )

    const todayHours = roundHours(
        allLogs
            .filter((log) => log.workDate === today)
            .reduce((sum, log) => sum + log.hours, 0),
    )

    const weekHours = roundHours(
        allLogs
            .filter((log) => log.workDate >= currentWeekStart)
            .reduce((sum, log) => sum + log.hours, 0),
    )

    const previousWeekHours = roundHours(
        allLogs
            .filter((log) => log.workDate >= previousWeekStart && log.workDate <= previousWeekEnd)
            .reduce((sum, log) => sum + log.hours, 0),
    )

    const weekDeltaHours = roundHours(weekHours - previousWeekHours)

    const weekDeltaPercent =
        previousWeekHours > 0
            ? roundHours((weekDeltaHours / previousWeekHours) * 100)
            : weekHours > 0
                ? 100
                : null

    const monthHours = roundHours(
        allLogs
            .filter((log) => log.workDate.startsWith(monthPrefix))
            .reduce((sum, log) => sum + log.hours, 0),
    )

    const uniqueActiveDays = new Set(allLogs.map((log) => log.workDate))

    const averagePerActiveDay =
        uniqueActiveDays.size > 0
            ? roundHours(totalHours / uniqueActiveDays.size)
            : 0

    const last14Days: DayHoursStat[] = Array.from({ length: 14 }, (_, index) => {
      const date = addDays(todayDate, -(13 - index))
      const iso = toIsoDate(date)

      const value = roundHours(
          allLogs
              .filter((log) => log.workDate === iso)
              .reduce((sum, log) => sum + log.hours, 0),
      )

      return {
        label: `${`${date.getDate()}`.padStart(2, '0')}.${`${date.getMonth() + 1}`.padStart(2, '0')}`,
        value,
      }
    })

    const weekLabels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
    const weekdayHoursMap = new Map<number, number>()
    const weekdayOccurrencesMap = new Map<number, number>()

    allLogs.forEach((log) => {
      const date = new Date(`${log.workDate}T00:00:00`)
      const jsDay = date.getDay()
      const normalizedDay = jsDay === 0 ? 6 : jsDay - 1

      weekdayHoursMap.set(
          normalizedDay,
          roundHours((weekdayHoursMap.get(normalizedDay) ?? 0) + log.hours),
      )

      weekdayOccurrencesMap.set(
          normalizedDay,
          (weekdayOccurrencesMap.get(normalizedDay) ?? 0) + 1,
      )
    })

    const weekDistribution: DayHoursStat[] = weekLabels.map((label, index) => ({
      label,
      value: weekdayHoursMap.get(index) ?? 0,
    }))

    const bestWeekdayStat = weekLabels
        .map((label, index) => {
          const total = weekdayHoursMap.get(index) ?? 0
          const occurrences = weekdayOccurrencesMap.get(index) ?? 0

          return {
            label,
            value: occurrences > 0 ? roundHours(total / occurrences) : 0,
          }
        })
        .sort((firstItem, secondItem) => secondItem.value - firstItem.value)[0] ?? {
      label: '—',
      value: 0,
    }

    const projectMap = new Map<string, number>()

    allLogs.forEach((log) => {
      const projectName = log.projectName || 'Без проекта'

      projectMap.set(
          projectName,
          roundHours((projectMap.get(projectName) ?? 0) + log.hours),
      )
    })

    const projectDistribution: ProjectHoursStat[] = [...projectMap.entries()]
        .map(([name, value]) => ({ name, value }))
        .sort((firstItem, secondItem) => secondItem.value - firstItem.value)
        .slice(0, 6)

    const monthlyProjectMap = new Map<string, number>()

    allLogs
        .filter((log) => log.workDate.startsWith(monthPrefix))
        .forEach((log) => {
          const projectName = log.projectName || 'Без проекта'

          monthlyProjectMap.set(
              projectName,
              roundHours((monthlyProjectMap.get(projectName) ?? 0) + log.hours),
          )
        })

    const monthlyTopProjectEntry = [...monthlyProjectMap.entries()]
        .sort((firstItem, secondItem) => secondItem[1] - firstItem[1])[0]

    const groupedByDate = [...uniqueActiveDays].sort((firstDate, secondDate) =>
        firstDate.localeCompare(secondDate),
    )

    let bestStreak = 0
    let currentChain = 0
    let previousDate: string | null = null

    groupedByDate.forEach((date) => {
      if (!previousDate) {
        currentChain = 1
        bestStreak = 1
        previousDate = date
        return
      }

      const diff = datesDiffInDays(previousDate, date)

      if (diff === 1) {
        currentChain += 1
      } else {
        currentChain = 1
      }

      if (currentChain > bestStreak) {
        bestStreak = currentChain
      }

      previousDate = date
    })

    let streakDays = 0
    const streakCursor = new Date(todayDate)

    while (uniqueActiveDays.has(toIsoDate(streakCursor))) {
      streakDays += 1
      streakCursor.setDate(streakCursor.getDate() - 1)
    }

    const recentProjects = Array.from(
        new Map(
            sortedLogs.value
                .map((log) => [log.projectId, log.projectName] as const)
                .filter(([, projectName]) => Boolean(projectName)),
        ).values(),
    ).slice(0, 5)

    return {
      totalHours,
      todayHours,
      weekHours,
      monthHours,
      averagePerActiveDay,
      streakDays,
      bestStreak,
      activeDays: uniqueActiveDays.size,
      topProjectName: projectDistribution[0]?.name ?? '—',
      previousWeekHours,
      weekDeltaHours,
      weekDeltaPercent,
      bestWeekday: bestWeekdayStat.label,
      bestWeekdayHours: bestWeekdayStat.value,
      monthlyTopProject: monthlyTopProjectEntry?.[0] ?? '—',
      monthlyTopProjectHours: monthlyTopProjectEntry?.[1] ?? 0,
      recentProjects,
      last14Days,
      weekDistribution,
      projectDistribution,
    }
  })

  const topProjectHours = computed(() => {
    return stats.value.projectDistribution[0]?.value ?? 0
  })

  async function loadLogs(force = false): Promise<void> {
    const userId = authStore.user?.id

    if (!userId) {
      logs.value = []
      initialized.value = true
      return
    }

    if (initialized.value && !force) {
      return
    }

    loading.value = true

    try {
      const { data, error } = await supabase
          .from('work_logs')
          .select(`
          id,
          user_id,
          work_date,
          hours,
          project_id,
          note,
          created_at,
          updated_at,
          projects (
            id,
            name
          )
        `)
          .eq('user_id', userId)
          .order('work_date', { ascending: false })
          .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      logs.value = ((data ?? []) as WorkLogRow[]).map(mapWorkLog)
      initialized.value = true
    } catch (error) {
      toastStore.error(
          'Не удалось загрузить часы',
          getErrorMessage(error, 'Попробуйте обновить страницу.'),
      )
      throw error
    } finally {
      loading.value = false
    }
  }

  async function addLog(payload: WorkLogInsertPayload): Promise<void> {
    const userId = authStore.user?.id

    if (!userId) {
      const message = 'Пользователь не авторизован'

      toastStore.error('Не удалось сохранить запись', message)
      throw new Error(message)
    }

    saving.value = true

    try {
      const { data, error } = await supabase
          .from('work_logs')
          .insert({
            user_id: userId,
            work_date: payload.workDate,
            hours: payload.hours,
            project_id: payload.projectId,
            note: payload.note.trim(),
          })
          .select(`
          id,
          user_id,
          work_date,
          hours,
          project_id,
          note,
          created_at,
          updated_at,
          projects (
            id,
            name
          )
        `)
          .single()

      if (error) {
        throw error
      }

      logs.value = [mapWorkLog(data as WorkLogRow), ...logs.value]

      toastStore.success(
          'Запись добавлена',
          'Часы сохранены в статистику профиля.',
      )
    } catch (error) {
      toastStore.error(
          'Не удалось добавить запись',
          getErrorMessage(error, 'Повторите попытку позже.'),
      )
      throw error
    } finally {
      saving.value = false
    }
  }

  async function updateLog(payload: WorkLogUpdatePayload): Promise<void> {
    saving.value = true

    try {
      const { data, error } = await supabase
          .from('work_logs')
          .update({
            work_date: payload.workDate,
            hours: payload.hours,
            project_id: payload.projectId,
            note: payload.note.trim(),
          })
          .eq('id', payload.id)
          .select(`
          id,
          user_id,
          work_date,
          hours,
          project_id,
          note,
          created_at,
          updated_at,
          projects (
            id,
            name
          )
        `)
          .single()

      if (error) {
        throw error
      }

      const updatedLog = mapWorkLog(data as WorkLogRow)

      logs.value = logs.value.map((log) =>
          log.id === updatedLog.id ? updatedLog : log,
      )

      toastStore.success('Запись обновлена', 'Изменения применены.')
    } catch (error) {
      toastStore.error(
          'Не удалось обновить запись',
          getErrorMessage(error, 'Повторите попытку позже.'),
      )
      throw error
    } finally {
      saving.value = false
    }
  }

  async function removeLog(id: string): Promise<void> {
    deletingId.value = id

    try {
      const { error } = await supabase
          .from('work_logs')
          .delete()
          .eq('id', id)

      if (error) {
        throw error
      }

      logs.value = logs.value.filter((log) => log.id !== id)

      toastStore.info('Запись удалена', 'Часы удалены из статистики.')
    } catch (error) {
      toastStore.error(
          'Не удалось удалить запись',
          getErrorMessage(error, 'Повторите попытку позже.'),
      )
      throw error
    } finally {
      deletingId.value = null
    }
  }

  const todayFocus = computed(() => {
    const today = new Date().toISOString().slice(0, 10)

    const todayLogs = logs.value.filter(
        (log) => log.workDate === today,
    )

    if (!todayLogs.length) {
      return {
        project: '',
        hours: 0,
      }
    }

    const map: Record<string, number> = {}

    for (const log of todayLogs) {
      if (!log.project) continue

      map[log.project] = (map[log.project] || 0) + log.hours
    }

    let topProject = ''
    let max = 0

    for (const key in map) {
      if (map[key] > max) {
        max = map[key]
        topProject = key
      }
    }

    return {
      project: topProject,
      hours: max,
    }
  })

  return {
    logs,
    sortedLogs,
    loading,
    saving,
    deletingId,
    initialized,
    stats,
    topProjectHours,
    loadLogs,
    addLog,
    updateLog,
    removeLog,

    todayFocus
  }
})