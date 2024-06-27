import { PaginableResponse } from '@/types/api'
import { Note } from '@/types/note'
import { z } from 'zod'
import { api } from './api'

// GET /projects/:projectId/boards
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

// GET /projects/:projectId/notes/:noteId
type GetNotePathParams = { projectId: string; noteId: string }

export const getNote = ({ projectId, noteId }: GetNotePathParams) =>
  api<Note>(`/projects/${projectId}/notes/${noteId}`).then(({ data }) => data)

// POST /projects/:projectId/notes
type CreateNotePathParams = { projectId: string }

type CreateNoteRequestBody = Pick<Note, 'title' | 'description'>

export const createNote = ({
  projectId,
  ...data
}: CreateNotePathParams & CreateNoteRequestBody) =>
  api.post<Note>(`projects/${projectId}/notes`, data).then(({ data }) => data)

// PUT /projects/:projectId/notes/:noteId
type UpdateNotePathParams = { projectId: string; noteId: string }

type UpdateNoteRequestBody = Pick<Note, 'id' | 'title' | 'description'>

export const updateNote = ({
  projectId,
  noteId,
  ...data
}: UpdateNotePathParams & UpdateNoteRequestBody) =>
  api
    .put<Note>(`/projects/${projectId}/notes/${noteId}`, data)
    .then(({ data }) => data)

// DELETE /projects/:projectId/notes/:noteId
type DeleteNotePathParams = { projectId: string; noteId: string }

const deleteNote = ({ projectId, noteId }: DeleteNotePathParams) =>
  api
    .delete<Note>(`/projects/${projectId}/notes/${noteId}`)
    .then(({ data }) => data)

export const deleteNotes = (params: DeleteNotePathParams[]) =>
  Promise.all(params.map(deleteNote))
