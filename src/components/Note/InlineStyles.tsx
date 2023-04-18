import { EditorState } from 'draft-js'
import { Dispatch, SetStateAction } from 'react'
import InlineStyleButton from './InlineStyleButton'

interface InlineStylesProps {
  editorState: EditorState
  setEditorState: Dispatch<SetStateAction<EditorState>>
}

const InlineStyles = ({ editorState, setEditorState }: InlineStylesProps) => (
  <>
    <InlineStyleButton
      type='BOLD'
      editorState={editorState}
      setEditorState={setEditorState}
    />
    <InlineStyleButton
      type='ITALIC'
      editorState={editorState}
      setEditorState={setEditorState}
    />
    <InlineStyleButton
      type='UNDERLINE'
      editorState={editorState}
      setEditorState={setEditorState}
    />
    <InlineStyleButton
      type='STRIKETHROUGH'
      editorState={editorState}
      setEditorState={setEditorState}
    />
    <InlineStyleButton
      type='CODE'
      editorState={editorState}
      setEditorState={setEditorState}
    />
  </>
)

export default InlineStyles
