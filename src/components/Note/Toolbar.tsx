import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import SpellcheckIcon from '@mui/icons-material/Spellcheck'
import { ToggleButton } from '@mui/material'
import { Editor, EditorState } from 'draft-js'
import { Dispatch, RefObject, SetStateAction, forwardRef } from 'react'
import BlockStyles from './BlockStyles'
import InlineStyles from './InlineStyles'
import { ToolbarContainer } from './styles/Note.styled'
import { exportToPDF } from '@/modules/note'

interface ToolbarProps {
  editorState: EditorState
  setEditorState: Dispatch<SetStateAction<EditorState>>
  spellCheck: boolean
  setSpellCheck: Dispatch<SetStateAction<boolean>>
}

const Toolbar = forwardRef<Editor, ToolbarProps>(
  (
    { editorState, setEditorState, spellCheck, setSpellCheck }: ToolbarProps,
    ref
  ) => {
    const editorRef = ref as RefObject<Editor>

    return (
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
        <InlineStyles
          editorState={editorState}
          setEditorState={setEditorState}
        />
        <BlockStyles
          editorState={editorState}
          setEditorState={setEditorState}
        />
        <ToggleButton
          size='small'
          value='pdf'
          onMouseDown={() => exportToPDF(editorRef.current!)} // TODO: Set pdf filename to note's name
          sx={{ height: 36 }}
        >
          <PictureAsPdfIcon fontSize='small' />
        </ToggleButton>
      </ToolbarContainer>
    )
  }
)

export default Toolbar
