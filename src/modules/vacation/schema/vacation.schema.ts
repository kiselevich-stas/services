import { z } from 'zod'
import {
    VACATION_CHECKLIST_CATEGORIES,
    VACATION_COLORS,
    VACATION_STATUSES,
} from '../constants/presets'

export const vacationPlanSchema = z
    .object({
        title: z
            .string()
            .trim()
            .min(1, 'Введите название отпуска')
            .max(120, 'Название слишком длинное'),

        description: z
            .string()
            .max(1000, 'Описание слишком длинное'),

        destination: z
            .string()
            .trim()
            .max(160, 'Название направления слишком длинное'),

        startDate: z
            .string()
            .min(1, 'Укажите дату начала'),

        endDate: z
            .string()
            .min(1, 'Укажите дату окончания'),

        status: z
            .string()
            .refine(
                (value) => VACATION_STATUSES.some((option) => option.value === value),
                { message: 'Выберите статус' },
            ),

        emoji: z
            .string()
            .trim()
            .min(1, 'Укажите эмодзи')
            .max(10, 'Эмодзи слишком длинный'),

        color: z
            .string()
            .refine((value) => VACATION_COLORS.includes(value), {
                message: 'Выберите цвет из списка',
            }),

        travelersCount: z
            .number({
                invalid_type_error: 'Укажите количество путешественников',
            })
            .int('Количество должно быть целым числом')
            .min(1, 'Минимум 1 путешественник')
            .max(20, 'Максимум 20 путешественников'),

        budget: z
            .number({
                invalid_type_error: 'Бюджет должен быть числом',
            })
            .min(0, 'Бюджет не может быть отрицательным')
            .nullable(),

        isFavorite: z.boolean(),
    })
    .refine(
        (values) => {
            const startTime = new Date(values.startDate).getTime()
            const endTime = new Date(values.endDate).getTime()

            if (Number.isNaN(startTime) || Number.isNaN(endTime)) {
                return false
            }

            return endTime >= startTime
        },
        {
            message: 'Дата окончания не может быть раньше даты начала',
            path: ['endDate'],
        },
    )

export const vacationDaySchema = z.object({
    dayDate: z
        .string()
        .min(1, 'Укажите дату дня'),

    title: z
        .string()
        .trim()
        .max(120, 'Название слишком длинное'),

    note: z
        .string()
        .max(2000, 'Заметка слишком длинная'),

    location: z
        .string()
        .trim()
        .max(160, 'Локация слишком длинная'),

    latitude: z.number().nullable(),
    longitude: z.number().nullable(),

    sortOrder: z
        .number({
            invalid_type_error: 'Укажите порядок',
        })
        .int('Порядок должен быть целым числом')
        .min(0, 'Порядок не может быть отрицательным'),
})

export const vacationChecklistItemSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, 'Введите название пункта')
        .max(160, 'Название слишком длинное'),

    category: z
        .string()
        .refine(
            (value) =>
                VACATION_CHECKLIST_CATEGORIES.some((option) => option.value === value),
            {
                message: 'Выберите категорию',
            },
        ),

    isDone: z.boolean(),

    sortOrder: z
        .number({
            invalid_type_error: 'Укажите порядок',
        })
        .int('Порядок должен быть целым числом')
        .min(0, 'Порядок не может быть отрицательным'),
})