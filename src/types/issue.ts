import { z } from 'zod'

const prioritySchema = z.enum([
  'TRIVIAL',
  'MINOR',
  'LOW',
  'MEDIUM',
  'HIGH',
  'MAJOR',
  'CRITICAL',
])

export type Priority = z.infer<typeof prioritySchema>

export const issueSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  title: z.string().min(1),
  description: z.string().nullable(),
  priority: prioritySchema,
})

export type Issue = z.infer<typeof issueSchema>
