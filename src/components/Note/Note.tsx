import useNotes from '@/hooks/useNotes'
import { isPlaceholderVisible } from '@/modules/note'
import { DraftHandleValue, Editor, EditorState, RichUtils } from 'draft-js'
import 'draft-js/dist/Draft.css'
import { RefObject, forwardRef, useState } from 'react'
import NoteHeader from './NoteHeader'
import Toolbar from './Toolbar'
import { EditorContainer, NoteContainer } from './styles/Note.styled'

const Note = forwardRef<Editor>((_, ref) => {
  const editorRef = ref as RefObject<Editor>

  const { note, notes, setNotes, editorState, setEditorState } = useNotes()

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
    <>
      <NoteHeader note={note} notes={notes} setNotes={setNotes} />
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
    </>
  )
})

export default Note
