import { isPlaceholderVisible } from '@/modules/note'
import { DraftHandleValue, Editor, EditorState, RichUtils } from 'draft-js'
import 'draft-js/dist/Draft.css'
import { useRef, useState } from 'react'
import Toolbar from './Toolbar'
import { EditorContainer, NoteContainer } from './styles/Note.styled'
import useNotes from '@/hooks/useNotes'

/**
 * TODO:
 * 1. Refactor.
 * 2. PDF or other document format export.
 */
const Note = () => {
  const { note: editorState, setNote: setEditorState } = useNotes()
  const [spellCheck, setSpellCheck] = useState(true)

  const editorRef = useRef<Editor>(null)

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
export default Note
