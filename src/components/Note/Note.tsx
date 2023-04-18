import { Editor, EditorState, RichUtils } from 'draft-js'
import 'draft-js/dist/Draft.css'
import { useRef, useState } from 'react'
import Toolbar from './Toolbar'
import { EditorContainer, NoteContainer } from './styles/Note.styled'
import { Divider } from '@mui/material'

const Note = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  )

  const editorRef = useRef<Editor>(null)

  return (
    <NoteContainer>
      <Toolbar editorState={editorState} setEditorState={setEditorState} />
      <Divider />
      <EditorContainer elevation={0} onClick={() => editorRef.current?.focus()}>
        <Editor
          ref={editorRef}
          editorState={editorState}
          onChange={setEditorState}
          handleKeyCommand={(command, editorState) => {
            const newEditorState = RichUtils.handleKeyCommand(
              editorState,
              command
            )
            if (newEditorState) {
              setEditorState(newEditorState)
              return 'handled'
            }
            return 'not-handled'
          }}
        />
      </EditorContainer>
    </NoteContainer>
  )
}
export default Note
