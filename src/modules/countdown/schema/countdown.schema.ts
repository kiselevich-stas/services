import { z } from 'zod'
import { COUNTDOWN_COLORS, COUNTDOWN_MOODS } from '../constants/presets'

export const countdownSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, 'Введите название')
        .max(100, 'Название слишком длинное'),

    targetDate: z
        .string()
        .min(1, 'Укажите дату и время')
        .refine((value) => !Number.isNaN(new Date(value).getTime()), {
            message: 'Некорректная дата',
        }),

    description: z
        .string()
        .max(500, 'Описание слишком длинное'),

    emoji: z
        .string()
        .max(10, 'Эмодзи слишком длинный'),

    mood: z
        .string()
        .refine((value) => COUNTDOWN_MOODS.some((option) => option.value === value), {
            message: 'Выберите настроение',
        }),

    color: z
        .string()
        .refine((value) => COUNTDOWN_COLORS.includes(value), {
            message: 'Выберите цвет из списка',
        }),
})