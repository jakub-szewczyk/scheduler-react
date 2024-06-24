import { z } from 'zod'

export const boardSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  title: z.string().min(1),
  description: z.string().nullable(),
})

export type Board = z.infer<typeof boardSchema>
