import { z } from 'zod'

export const createSpaceSchema = z.object({
  title: z.string().trim().min(2, 'Минимум 2 символа').max(80, 'Максимум 80 символов'),
  description: z.string().trim().max(500, 'Максимум 500 символов').default(''),
  color: z.string().regex(/^#([0-9a-fA-F]{6})$/, 'Выбери корректный HEX-цвет'),
  visibility: z.enum(['private', 'link_only', 'public']),
  join_policy: z.enum(['invite_only', 'link', 'request']),
})

export const createInviteSchema = z.object({
  role: z.enum(['member', 'admin']),
  maxUses: z.union([
    z.number().int().positive('Введите число больше 0'),
    z.null(),
  ]),
  expiresAt: z.union([
    z.string().datetime({ offset: true }),
    z.null(),
  ]),
})

export type CreateSpaceFormValues = z.infer<typeof createSpaceSchema>
export type CreateInviteFormValues = z.infer<typeof createInviteSchema>
