import { z } from 'zod'

export const statusSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  title: z.string().min(1),
  description: z.string().nullable(),
})

export type Status = z.infer<typeof statusSchema>
