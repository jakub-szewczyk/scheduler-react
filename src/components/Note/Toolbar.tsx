import SpellcheckIcon from '@mui/icons-material/Spellcheck'
import { Button } from '@mui/material'
import { EditorState } from 'draft-js'
import { Dispatch, SetStateAction } from 'react'
import InlineStyles from './InlineStyles'
import { ToolbarContainer } from './styles/Note.styled'

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
  <ToolbarContainer elevation={0}>
    <Button
      size='small'
      variant={spellCheck ? 'contained' : 'outlined'}
      onMouseDown={() => setSpellCheck((spellCheck) => !spellCheck)}
      sx={{ minWidth: 0, flexShrink: 0 }}
    >
      <SpellcheckIcon fontSize='small' />
    </Button>
    <InlineStyles editorState={editorState} setEditorState={setEditorState} />
    {/* TODO: Add support for block styles */}
  </ToolbarContainer>
)

export default Toolbar
