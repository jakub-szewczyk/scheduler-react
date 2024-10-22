import { RawDraftContentState } from 'draft-js'
import { z } from 'zod'

export const noteSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  title: z.string().min(1),
  description: z.string().nullable(),
  content: z.custom<RawDraftContentState>().nullable(),
})

export type Note = z.infer<typeof noteSchema>
