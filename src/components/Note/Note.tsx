import { isPlaceholderVisible } from '@/modules/note'
import { DraftHandleValue, Editor, EditorState, RichUtils } from 'draft-js'
import 'draft-js/dist/Draft.css'
import {
  Dispatch,
  RefObject,
  SetStateAction,
  forwardRef,
  useState,
} from 'react'
import Toolbar from './Toolbar'
import { EditorContainer, NoteContainer } from './styles/Note.styled'
import { Note as INote } from '@/types/note'

interface NoteProps {
  note: INote
  editorState: EditorState
  setEditorState: Dispatch<SetStateAction<EditorState>>
}

const Note = forwardRef<Editor, NoteProps>(
  ({ note, editorState, setEditorState }, ref) => {
    const editorRef = ref as RefObject<Editor>

    const [spellCheck, setSpellCheck] = useState(true)

    const handleKeyCommand = (
      command: string,
      editorState: EditorState,
      eventTimeStamp: number
    ): DraftHandleValue => {
      const newEditorState = RichUtils.handleKeyCommand(editorState, command)
      if (newEditorState) {
        setEditorState(newEditorState)
        return 'handled'
      }
      return 'not-handled'
    }

    return (
      <NoteContainer>
        <Toolbar
          ref={editorRef}
          note={note}
          editorState={editorState}
          setEditorState={setEditorState}
          spellCheck={spellCheck}
          setSpellCheck={setSpellCheck}
        />
        <EditorContainer
          elevation={0}
          onClick={() => editorRef.current?.focus()}
          sx={{
            '.public-DraftEditorPlaceholder-root': {
              display: isPlaceholderVisible(editorState) ? 'block' : 'none',
            },
          }}
        >
          <Editor
            ref={editorRef}
            editorState={editorState}
            placeholder='Enter your note here...'
            spellCheck={spellCheck}
            onChange={setEditorState}
            handleKeyCommand={handleKeyCommand}
          />
        </EditorContainer>
      </NoteContainer>
    )
  }
)

export default Note
