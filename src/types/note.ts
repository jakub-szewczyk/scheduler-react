import { EditorState, RawDraftContentState } from 'draft-js'

export interface Note {
  id: string
  name: string
  createdAt: string
  editorState: EditorState | RawDraftContentState
}

export type InitialValues = { name: string }

export type DraftBlockStyleType =
  | 'unstyled'
  | 'header-one'
  | 'header-two'
  | 'header-three'
  | 'header-four'
  | 'header-five'
  | 'header-six'
  | 'unordered-list-item'
  | 'ordered-list-item'
  | 'blockquote'
  | 'code-block'
