import {
  EditorState,
  RawDraftContentState,
  convertFromRaw,
  convertToRaw,
} from 'draft-js'

export const serialize = (editorState: EditorState) =>
  convertToRaw(editorState.getCurrentContent())

export const deserialize = (editorState: RawDraftContentState | null) =>
  !editorState
    ? EditorState.createEmpty()
    : EditorState.createWithContent(convertFromRaw(editorState))
