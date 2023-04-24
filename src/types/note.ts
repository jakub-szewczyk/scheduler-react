import { EditorState, RawDraftContentState } from 'draft-js'

interface Note {
  name: string
  selected: boolean
  createdAt: string
  editorState: EditorState | RawDraftContentState
}

type DraftBlockStyleType =
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

export type { Note, DraftBlockStyleType }
