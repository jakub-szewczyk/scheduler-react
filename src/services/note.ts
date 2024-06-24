import { PaginableResponse } from '@/types/api'
import { Note } from '@/types/note'
import { z } from 'zod'
import { api } from './api'

export const getNotesSearchParamsSchema = z.object({
  page: z.number().int().nonnegative().catch(0),
  size: z.number().int().nonnegative().catch(10),
  title: z.string().catch(''),
  createdAt: z.enum(['ASC', 'DESC']).catch('DESC'),
})

export type GetNotesSearchParams = z.infer<typeof getNotesSearchParamsSchema>

type GetNotesPathParams = { projectId: string }

type GetNotesResponseBody = PaginableResponse<Note>

export const getNotes = ({
  projectId,
  ...params
}: GetNotesPathParams & Partial<GetNotesSearchParams>) =>
  api<GetNotesResponseBody>(`/projects/${projectId}/notes`, {
    params,
  }).then(({ data }) => data)
