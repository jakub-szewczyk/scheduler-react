import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import SpellcheckIcon from '@mui/icons-material/Spellcheck'
import { ToggleButton } from '@mui/material'
import { Editor, EditorState } from 'draft-js'
import { Dispatch, RefObject, SetStateAction, forwardRef } from 'react'
import BlockStyles from './BlockStyles'
import InlineStyles from './InlineStyles'
import { ToolbarContainer } from './styles/Note.styled'
// @ts-ignore
import html2pdf from 'html2pdf.js'

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

    const handleExportToPDF = () => {
      const html = editorRef.current?.editorContainer?.cloneNode(
        true
      ) as HTMLElement
      html.style.color = 'black'
      html2pdf()
        .set({
          margin: 16,
          pagebreak: { mode: ['avoid-all'] },
        })
        .from(html)
        .save()
    }

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
          onMouseDown={handleExportToPDF}
          sx={{ height: 36 }}
        >
          <PictureAsPdfIcon fontSize='small' />
        </ToggleButton>
      </ToolbarContainer>
    )
  }
)

export default Toolbar
