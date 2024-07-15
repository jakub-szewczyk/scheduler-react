import { z } from 'zod'

export const eventSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  title: z.string().min(1),
  description: z.string().nullable(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
})

export type Event = z.infer<typeof eventSchema>