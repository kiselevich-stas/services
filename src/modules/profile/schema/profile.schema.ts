import { z } from 'zod'

const namePattern = /^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ\s'-]+$/
const phonePattern = /^[+\d\s\-()]+$/

export const profileSchema = z.object({
    email: z
        .string()
        .min(1, 'Введите email')
        .email('Введите корректный email'),

    firstName: z
        .string()
        .trim()
        .min(1, 'Введите имя')
        .max(50, 'Имя слишком длинное')
        .refine((value) => namePattern.test(value), {
            message: 'Имя может содержать только буквы',
        }),

    lastName: z
        .string()
        .trim()
        .min(1, 'Введите фамилию')
        .max(50, 'Фамилия слишком длинная')
        .refine((value) => namePattern.test(value), {
            message: 'Фамилия может содержать только буквы',
        }),

    phone: z
        .string()
        .refine((value) => value === '' || value.length === 18, {
            message: 'Введите полный номер телефона',
        }),
    city: z
        .string()
        .trim()
        .max(80, 'Название города слишком длинное'),

    about: z
        .string()
        .trim()
        .max(500, 'Описание слишком длинное'),

    avatarUrl: z.string().nullable(),
})