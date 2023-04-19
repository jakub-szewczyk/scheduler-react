import { EditorState } from 'draft-js'
import { Dispatch, SetStateAction } from 'react'
import BlockStyle from './BlockStyle'
import { ToggleButtonGroup } from '@mui/material'
import { blockStyle } from '@/modules/note'

interface BlockStylesProps {
  editorState: EditorState
  setEditorState: Dispatch<SetStateAction<EditorState>>
}

const BlockStyles = ({ editorState, setEditorState }: BlockStylesProps) => (
  <ToggleButtonGroup value={blockStyle(editorState)} exclusive>
    <BlockStyle
      type='ordered-list-item'
      editorState={editorState}
      setEditorState={setEditorState}
    />
    <BlockStyle
      type='unordered-list-item'
      editorState={editorState}
      setEditorState={setEditorState}
    />
    <BlockStyle
      type='blockquote'
      editorState={editorState}
      setEditorState={setEditorState}
    />
    <BlockStyle
      type='code-block'
      editorState={editorState}
      setEditorState={setEditorState}
    />
  </ToggleButtonGroup>
)

export default BlockStyles
