import { z } from 'zod'

import type {
  WorkLogFormValues,
  WorkLogInsertPayload,
} from '../types'

export const worklogSchema = z.object({
  workDate: z.string().min(1, 'Укажите дату'),
  hours: z
      .string()
      .min(1, 'Укажите количество часов')
      .refine((value) => {
        const hours = Number(value)
        return Number.isFinite(hours) && hours > 0 && hours <= 24
      }, 'Введите число от 0 до 24'),
  project: z
      .string()
      .trim()
      .min(1, 'Укажите проект'),
  note: z
      .string()
      .max(1000, 'Комментарий слишком длинный'),
})

function getTodayDate(): string {
  const today = new Date()
  const year = today.getFullYear()
  const month = `${today.getMonth() + 1}`.padStart(2, '0')
  const day = `${today.getDate()}`.padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function getDefaultWorklogValues(): WorkLogFormValues {
  return {
    workDate: getTodayDate(),
    hours: '',
    project: '',
    note: '',
  }
}

export function toWorklogPayload(values: WorkLogFormValues): WorkLogInsertPayload {
  return {
    workDate: values.workDate,
    hours: Number(values.hours),
    project: values.project.trim(),
    note: values.note.trim(),
  }
}