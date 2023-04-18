import SpellcheckIcon from '@mui/icons-material/Spellcheck'
import { Button, Paper } from '@mui/material'
import { EditorState } from 'draft-js'
import { Dispatch, SetStateAction } from 'react'
import InlineStyles from './InlineStyles'

interface ToolbarProps {
  editorState: EditorState
  setEditorState: Dispatch<SetStateAction<EditorState>>
  spellCheck: boolean
  setSpellCheck: Dispatch<SetStateAction<boolean>>
}

const Toolbar = ({
  editorState,
  setEditorState,
  spellCheck,
  setSpellCheck,
}: ToolbarProps) => (
  <Paper
    elevation={0}
    sx={{
      display: 'flex',
      columnGap: 1,
      p: 2,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    }}
  >
    <Button
      size='small'
      variant={spellCheck ? 'contained' : 'outlined'}
      onMouseDown={() => setSpellCheck((spellCheck) => !spellCheck)}
      sx={{ minWidth: 0 }}
    >
      <SpellcheckIcon fontSize='small' />
    </Button>
    <InlineStyles editorState={editorState} setEditorState={setEditorState} />
  </Paper>
)

export default Toolbar
