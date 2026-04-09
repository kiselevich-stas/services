import { z } from 'zod'
import type { WorkLogFormValues, WorkLogInsertPayload } from '../types'

export const worklogSchema = z.object({
  workDate: z
      .string()
      .trim()
      .min(1, 'Укажите дату'),

  hours: z
      .string()
      .trim()
      .min(1, 'Укажите количество часов')
      .refine((value) => {
        const normalizedValue = value.replace(',', '.')
        const parsedValue = Number(normalizedValue)

        return Number.isFinite(parsedValue) && parsedValue > 0
      }, 'Количество часов должно быть больше 0'),

  project: z
      .string()
      .trim()
      .min(1, 'Укажите проект'),

  note: z
      .string()
      .trim()
      .min(1, 'Добавьте комментарий'),
})

export function getDefaultWorklogValues(): WorkLogFormValues {
  return {
    workDate: new Date().toISOString().slice(0, 10),
    hours: '',
    project: '',
    note: '',
  }
}

export function toWorklogPayload(values: WorkLogFormValues): WorkLogInsertPayload {
  const parsedValues = worklogSchema.parse(values)

  return {
    workDate: parsedValues.workDate,
    hours: Number(parsedValues.hours.replace(',', '.')),
    project: parsedValues.project.trim(),
    note: parsedValues.note.trim(),
  }
}