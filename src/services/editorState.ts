import { Note } from '@/types/note'
import api from './api'

interface UpdateEditorStatePayload {
  projectId: string
  noteId: string
  editorState: Note['editorState']
  token: string | null
}

export const updateEditorState = ({
  projectId,
  noteId,
  editorState,
  token,
}: UpdateEditorStatePayload) =>
  api
    .put<Note>(
      `/projects/${projectId}/notes/${noteId}/editor-state`,
      { editorState },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then(({ data }) => data)
