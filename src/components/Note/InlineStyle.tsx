import { toInlineStyleIcon } from '@/modules/note'
import { ToggleButton, ToggleButtonProps } from '@mui/material'
import { DraftInlineStyleType, EditorState, RichUtils } from 'draft-js'
import { Dispatch, SetStateAction } from 'react'

interface InlineStyleProps extends Omit<ToggleButtonProps, 'type' | 'value'> {
  type: DraftInlineStyleType
  editorState: EditorState
  setEditorState: Dispatch<SetStateAction<EditorState>>
}

const InlineStyle = ({
  type,
  editorState,
  setEditorState,
  ...props
}: InlineStyleProps) => (
  <ToggleButton
    {...props}
    size='small'
    value={type}
    selected={editorState.getCurrentInlineStyle().has(type)}
    onMouseDown={(event) => {
      event.preventDefault()
      setEditorState(RichUtils.toggleInlineStyle(editorState, type))
    }}
  >
    {toInlineStyleIcon[type]}
  </ToggleButton>
)

export default InlineStyle
