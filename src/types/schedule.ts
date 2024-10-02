import { z } from 'zod'

export const scheduleSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  title: z.string().min(1),
  description: z.string().nullable(),
})

export type Schedule = z.infer<typeof scheduleSchema>
