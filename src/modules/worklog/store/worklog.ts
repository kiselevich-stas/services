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
    project: row.project,
    note: row.note,
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

function startOfWeek(date: Date): Date {
  const copy = new Date(date)
  const day = copy.getDay()
  const diff = day === 0 ? -6 : 1 - day
  copy.setDate(copy.getDate() + diff)
  copy.setHours(0, 0, 0, 0)
  return copy
}

function roundHours(value: number): number {
  return Math.round(value * 100) / 100
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

  const stats = computed<WorkLogStats>(() => {
    const allLogs = logs.value
    const today = toIsoDate(new Date())
    const weekStart = toIsoDate(startOfWeek(new Date()))
    const now = new Date()
    const monthPrefix = `${now.getFullYear()}-${`${now.getMonth() + 1}`.padStart(2, '0')}`

    const totalHours = roundHours(allLogs.reduce((sum, log) => sum + log.hours, 0))
    const todayHours = roundHours(
      allLogs.filter((log) => log.workDate === today).reduce((sum, log) => sum + log.hours, 0),
    )
    const weekHours = roundHours(
      allLogs.filter((log) => log.workDate >= weekStart).reduce((sum, log) => sum + log.hours, 0),
    )
    const monthHours = roundHours(
      allLogs.filter((log) => log.workDate.startsWith(monthPrefix)).reduce((sum, log) => sum + log.hours, 0),
    )

    const uniqueActiveDays = new Set(allLogs.map((log) => log.workDate))
    const averagePerActiveDay = uniqueActiveDays.size > 0
      ? roundHours(totalHours / uniqueActiveDays.size)
      : 0

    const last14Days: DayHoursStat[] = Array.from({ length: 14 }, (_, index) => {
      const date = new Date()
      date.setDate(date.getDate() - (13 - index))
      const iso = toIsoDate(date)
      const value = roundHours(
        allLogs.filter((log) => log.workDate === iso).reduce((sum, log) => sum + log.hours, 0),
      )

      return {
        label: `${`${date.getDate()}`.padStart(2, '0')}.${`${date.getMonth() + 1}`.padStart(2, '0')}`,
        value,
      }
    })

    const weekLabels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
    const weekMap = new Map<number, number>()

    allLogs.forEach((log) => {
      const date = new Date(log.workDate)
      const jsDay = date.getDay()
      const normalizedDay = jsDay === 0 ? 6 : jsDay - 1
      weekMap.set(normalizedDay, roundHours((weekMap.get(normalizedDay) ?? 0) + log.hours))
    })

    const weekDistribution: DayHoursStat[] = weekLabels.map((label, index) => ({
      label,
      value: weekMap.get(index) ?? 0,
    }))

    const projectMap = new Map<string, number>()
    allLogs.forEach((log) => {
      const projectName = log.project.trim() || 'Без проекта'
      projectMap.set(projectName, roundHours((projectMap.get(projectName) ?? 0) + log.hours))
    })

    const projectDistribution: ProjectHoursStat[] = [...projectMap.entries()]
      .map(([name, value]) => ({ name, value }))
      .sort((firstItem, secondItem) => secondItem.value - firstItem.value)
      .slice(0, 6)

    const activeDates = [...uniqueActiveDays].sort((firstDate, secondDate) => secondDate.localeCompare(firstDate))
    let streakDays = 0
    let cursor = new Date()
    cursor.setHours(0, 0, 0, 0)

    while (activeDates.includes(toIsoDate(cursor))) {
      streakDays += 1
      cursor.setDate(cursor.getDate() - 1)
    }

    return {
      totalHours,
      todayHours,
      weekHours,
      monthHours,
      averagePerActiveDay,
      streakDays,
      activeDays: uniqueActiveDays.size,
      topProjectName: projectDistribution[0]?.name ?? '—',
      last14Days,
      weekDistribution,
      projectDistribution,
    }
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
        .select('id, user_id, work_date, hours, project, note, created_at, updated_at')
        .eq('user_id', userId)
        .order('work_date', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      logs.value = (data ?? []).map(mapWorkLog)
      initialized.value = true
    } catch (error) {
      toastStore.error('Не удалось загрузить часы', getErrorMessage(error, 'Попробуйте обновить страницу.'))
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
          project: payload.project.trim(),
          note: payload.note.trim(),
        })
        .select('id, user_id, work_date, hours, project, note, created_at, updated_at')
        .single()

      if (error) {
        throw error
      }

      logs.value = [mapWorkLog(data), ...logs.value]
      toastStore.success('Запись добавлена', 'Часы сохранены в статистику профиля.')
    } catch (error) {
      toastStore.error('Не удалось добавить запись', getErrorMessage(error, 'Повторите попытку позже.'))
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
          project: payload.project.trim(),
          note: payload.note.trim(),
        })
        .eq('id', payload.id)
        .select('id, user_id, work_date, hours, project, note, created_at, updated_at')
        .single()

      if (error) {
        throw error
      }

      const updatedLog = mapWorkLog(data)
      logs.value = logs.value.map((log) => (log.id === updatedLog.id ? updatedLog : log))
      toastStore.success('Запись обновлена', 'Изменения применены.')
    } catch (error) {
      toastStore.error('Не удалось обновить запись', getErrorMessage(error, 'Повторите попытку позже.'))
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
      toastStore.error('Не удалось удалить запись', getErrorMessage(error, 'Повторите попытку позже.'))
      throw error
    } finally {
      deletingId.value = null
    }
  }

  return {
    logs,
    sortedLogs,
    loading,
    saving,
    deletingId,
    initialized,
    stats,
    loadLogs,
    addLog,
    updateLog,
    removeLog,
  }
})
