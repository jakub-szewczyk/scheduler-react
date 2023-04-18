import CodeIcon from '@mui/icons-material/Code'
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined'
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS'
import { Button } from '@mui/material'
import { DraftInlineStyleType, EditorState, RichUtils } from 'draft-js'
import { Dispatch, ReactNode, SetStateAction } from 'react'

const toIcon: { [key in DraftInlineStyleType]: ReactNode } = {
  BOLD: <FormatBoldIcon fontSize='small' />,
  ITALIC: <FormatItalicIcon fontSize='small' />,
  UNDERLINE: <FormatUnderlinedIcon fontSize='small' />,
  STRIKETHROUGH: <StrikethroughSIcon fontSize='small' />,
  CODE: <CodeIcon fontSize='small' />,
}

interface InlineStyleButtonProps {
  type: DraftInlineStyleType
  editorState: EditorState
  setEditorState: Dispatch<SetStateAction<EditorState>>
}

const InlineStyleButton = ({
  type,
  editorState,
  setEditorState,
}: InlineStyleButtonProps) => (
  <Button
    size='small'
    variant={
      editorState.getCurrentInlineStyle().has(type) ? 'contained' : 'outlined'
    }
    onMouseDown={(event) => {
      event.preventDefault()
      setEditorState(RichUtils.toggleInlineStyle(editorState, type))
    }}
    sx={{ minWidth: 0 }}
  >
    {toIcon[type]}
  </Button>
)

export default InlineStyleButton
