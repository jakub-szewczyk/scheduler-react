import { Note } from '@/types/note'
import api from './api'
import { PaginatedResponse } from '@/types/api'

interface GetNotesParams {
  projectId: string
  page?: number
  size?: number
}

type GetNotesResponse = PaginatedResponse<
  Pick<Note, 'id' | 'createdAt' | 'name'>[]
>

export const getNotes = ({ projectId, ...params }: GetNotesParams) =>
  api<GetNotesResponse>(`/projects/${projectId}/notes`, { params }).then(
    ({ data }) => data
  )

interface GetNoteParams {
  projectId: string
  noteId: string
}

export const getNote = ({ projectId, noteId }: GetNoteParams) =>
  api<Note>(`/projects/${projectId}/notes/${noteId}`).then(({ data }) => data)

interface CreateNotePayload {
  projectId: string
  name: string
}

export const createNote = ({ projectId, name }: CreateNotePayload) =>
  api
    .post<Pick<Note, 'id' | 'createdAt' | 'name'>>(
      `/projects/${projectId}/notes`,
      { name }
    )
    .then(({ data }) => data)

interface UpdateNotePayload {
  projectId: string
  noteId: string
  name: string
}

export const updateNote = ({ projectId, noteId, name }: UpdateNotePayload) =>
  api
    .put<Note>(`/projects/${projectId}/notes/${noteId}`, { name })
    .then(({ data }) => data)

interface DeleteNotePayload {
  projectId: string
  noteId: string
}

export const deleteNote = ({ projectId, noteId }: DeleteNotePayload) =>
  api
    .delete<Note>(`/projects/${projectId}/notes/${noteId}`)
    .then(({ data }) => data)
