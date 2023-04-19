import SpellcheckIcon from '@mui/icons-material/Spellcheck'
import { ToggleButton } from '@mui/material'
import { EditorState } from 'draft-js'
import { Dispatch, SetStateAction } from 'react'
import BlockStyles from './BlockStyles'
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
    <ToggleButton
      size='small'
      value='spellcheck'
      selected={spellCheck}
      onMouseDown={() => setSpellCheck((spellCheck) => !spellCheck)}
      sx={{ height: 36 }}
    >
      <SpellcheckIcon fontSize='small' />
    </ToggleButton>
    <InlineStyles editorState={editorState} setEditorState={setEditorState} />
    <BlockStyles editorState={editorState} setEditorState={setEditorState} />
  </ToolbarContainer>
)

export default Toolbar
