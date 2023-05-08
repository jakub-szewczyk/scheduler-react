import { EditorState, RawDraftContentState } from 'draft-js'

export type NotesEndomorphism = (notes: Note[]) => Note[]

export interface Note {
  name: string
  project: string
  selected: boolean
  createdAt: string
  editorState: EditorState | RawDraftContentState
}

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
