import { blockStyle, toBlockStyleIcon } from '@/modules/note'
import { DraftBlockStyleType } from '@/types/note'
import { ToggleButton, ToggleButtonProps } from '@mui/material'
import { EditorState, RichUtils } from 'draft-js'
import { Dispatch, SetStateAction } from 'react'

interface BlockStyleProps extends Omit<ToggleButtonProps, 'type' | 'value'> {
  type: DraftBlockStyleType
  editorState: EditorState
  setEditorState: Dispatch<SetStateAction<EditorState>>
}

const BlockStyle = ({
  type,
  editorState,
  setEditorState,
  ...props
}: BlockStyleProps) => (
  <ToggleButton
    {...props}
    size='small'
    value={type}
    selected={blockStyle(editorState) === type}
    onMouseDown={(event) => {
      event.preventDefault()
      setEditorState(RichUtils.toggleBlockType(editorState, type))
    }}
    sx={{
      height: 36,
      whiteSpace: 'nowrap',
    }}
  >
    {toBlockStyleIcon[type]}
  </ToggleButton>
)

export default BlockStyle
