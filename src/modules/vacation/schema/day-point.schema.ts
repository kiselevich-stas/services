import { z } from 'zod'

export const vacationDayPointSchema = z.object({
    title: z
        .string()
        .trim()
        .max(120, 'Название точки слишком длинное'),

    description: z
        .string()
        .max(1000, 'Описание слишком длинное'),

    latitude: z.number({
        invalid_type_error: 'Широта обязательна',
    }),

    longitude: z.number({
        invalid_type_error: 'Долгота обязательна',
    }),

    sortOrder: z
        .number({
            invalid_type_error: 'Порядок обязателен',
        })
        .int('Порядок должен быть целым')
        .min(0, 'Порядок не может быть отрицательным'),
})