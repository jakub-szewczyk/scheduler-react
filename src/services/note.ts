import { PaginableResponse } from '@/types/api'
import { Note } from '@/types/note'
import { Project } from '@/types/project'
import { RawDraftContentState } from 'draft-js'
import { z } from 'zod'
import { api } from './api'

// GET /projects/:projectId/notes
export const getNotesSearchParamsSchema = z.object({
  page: z.number().int().nonnegative().catch(0),
  size: z.number().int().nonnegative().catch(10),
  title: z.string().catch(''),
  createdAt: z.enum(['ASC', 'DESC']).catch('DESC'),
})

export type GetNotesSearchParams = z.infer<typeof getNotesSearchParamsSchema>

type GetNotesPathParams = { projectId: Project['id'] }

type GetNotesResponseBody = PaginableResponse<Note>

export const getNotes = ({
  projectId,
  ...params
}: GetNotesPathParams & Partial<GetNotesSearchParams>) =>
  api<GetNotesResponseBody>(`/projects/${projectId}/notes`, {
    params,
  }).then(({ data }) => data)

// GET /projects/:projectId/notes/:noteId
type GetNotePathParams = { projectId: Project['id']; noteId: Note['id'] }

export const getNote = ({ projectId, noteId }: GetNotePathParams) =>
  api<Note>(`/projects/${projectId}/notes/${noteId}`).then(({ data }) => data)

// POST /projects/:projectId/notes
type CreateNotePathParams = { projectId: Project['id'] }

type CreateNoteRequestBody = Pick<Note, 'title' | 'description'>

export const createNote = ({
  projectId,
  ...data
}: CreateNotePathParams & CreateNoteRequestBody) =>
  api.post<Note>(`projects/${projectId}/notes`, data).then(({ data }) => data)

// PUT /projects/:projectId/notes/:noteId
type UpdateNotePathParams = { projectId: Project['id']; noteId: Note['id'] }

type UpdateNoteRequestBody = Pick<Note, 'title' | 'description'>

export const updateNote = ({
  projectId,
  noteId,
  ...data
}: UpdateNotePathParams & UpdateNoteRequestBody) =>
  api
    .put<Note>(`/projects/${projectId}/notes/${noteId}`, data)
    .then(({ data }) => data)

// PATCH /projects/:projectId/notes/:noteId
type UpdateContentPathParams = {
  projectId: Project['id']
  noteId: Note['id']
}

type UpdateContentRequestBody = { editorState: RawDraftContentState }

export const updateContent = ({
  projectId,
  noteId,
  editorState,
}: UpdateContentPathParams & UpdateContentRequestBody) =>
  api
    .patch<Note>(`/projects/${projectId}/notes/${noteId}/content`, editorState)
    .then(({ data }) => data)

// DELETE /projects/:projectId/notes/:noteId
type DeleteNotePathParams = { projectId: Project['id']; noteId: Note['id'] }

const deleteNote = ({ projectId, noteId }: DeleteNotePathParams) =>
  api
    .delete<Note>(`/projects/${projectId}/notes/${noteId}`)
    .then(({ data }) => data)

export const deleteNotes =
  (projectId: Project['id']) => (noteIds: Note['id'][]) =>
    Promise.all(noteIds.map((noteId) => deleteNote({ projectId, noteId })))
