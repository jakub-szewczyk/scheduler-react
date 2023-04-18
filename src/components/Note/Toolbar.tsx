import FormatBoldIcon from '@mui/icons-material/FormatBold'
import { Button, Paper } from '@mui/material'
import { EditorState, RichUtils } from 'draft-js'
import { Dispatch, SetStateAction } from 'react'

interface ToolbarProps {
  editorState: EditorState
  setEditorState: Dispatch<SetStateAction<EditorState>>
}

const Toolbar = ({ editorState, setEditorState }: ToolbarProps) => (
  <Paper
    elevation={0}
    sx={{ p: 2, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
  >
    <Button
      size='small'
      variant={
        editorState.getCurrentInlineStyle().has('BOLD')
          ? 'contained'
          : 'outlined'
      }
      onMouseDown={(event) => {
        event.preventDefault()
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'))
      }}
      sx={{ minWidth: 0 }}
    >
      <FormatBoldIcon fontSize='small' />
    </Button>
  </Paper>
)

export default Toolbar
