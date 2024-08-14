import { z } from 'zod'

export const notificationSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  title: z.string().min(1),
  description: z.string().nullable(),
  startsAt: z.string().datetime(),
  isActive: z.boolean(),
})

export type Notification = z.infer<typeof notificationSchema>
