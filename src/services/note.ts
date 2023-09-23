import { Note } from '@/types/note'
import api from './api'

interface GetAllNotesPayload {
  projectId: string
  token: string | null
}

export const getAllNotes = ({ projectId, token }: GetAllNotesPayload) =>
  api<Pick<Note, 'id' | 'createdAt' | 'name'>[]>(
    `/projects/${projectId}/notes`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  ).then(({ data }) => data)

interface GetNotePayload {
  projectId: string
  noteId: string
  token: string | null
}

export const getNote = ({ projectId, noteId, token }: GetNotePayload) =>
  api<Note>(`/projects/${projectId}/notes/${noteId}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(({ data }) => data)

interface CreateNotePayload {
  projectId: string
  name: string
  token: string | null
}

export const createNote = ({ projectId, name, token }: CreateNotePayload) =>
  api
    .post<Pick<Note, 'id' | 'createdAt' | 'name'>>(
      `/projects/${projectId}/notes`,
      { name },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(({ data }) => data)

interface UpdateNotePayload {
  projectId: string
  noteId: string
  name: string
  token: string | null
}

export const updateNote = ({
  projectId,
  noteId,
  name,
  token,
}: UpdateNotePayload) =>
  api
    .put<Note>(
      `/projects/${projectId}/notes/${noteId}`,
      { name },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then(({ data }) => data)

interface DeleteNotePayload {
  projectId: string
  noteId: string
  token: string | null
}

export const deleteNote = ({ projectId, noteId, token }: DeleteNotePayload) =>
  api
    .delete<Note>(`/projects/${projectId}/notes/${noteId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(({ data }) => data)
