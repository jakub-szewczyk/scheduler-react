import { Note } from '@/types/note'
import api from './api'

interface UpdateEditorStatePayload {
  projectId: string
  noteId: string
  editorState: Note['editorState']
}

export const updateEditorState = ({
  projectId,
  noteId,
  editorState,
}: UpdateEditorStatePayload) =>
  api
    .put<Note>(`/projects/${projectId}/notes/${noteId}/editor-state`, {
      editorState,
    })
    .then(({ data }) => data)
