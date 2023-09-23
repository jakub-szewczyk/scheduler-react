import ChangesBar from '@/layout/ChangesBar/ChangesBar'
import { isPlaceholderVisible, serialize } from '@/modules/note'
import { Note as INote } from '@/types/note'
import { DraftHandleValue, Editor, EditorState, RichUtils } from 'draft-js'
import 'draft-js/dist/Draft.css'
import { equals, omit } from 'ramda'
import {
  Dispatch,
  RefObject,
  SetStateAction,
  forwardRef,
  useState,
} from 'react'
import NoteHeader from './NoteHeader'
import Toolbar from './Toolbar'
import { EditorContainer, NoteContainer } from './styles/Note.styled'

interface NoteProps {
  note: INote & { editorState: EditorState }
  editorState: EditorState
  setEditorState: Dispatch<SetStateAction<EditorState>>
}

const Note = forwardRef<Editor, NoteProps>(
  ({ note, editorState, setEditorState }, ref) => {
    const editorRef = ref as RefObject<Editor>

    const [spellCheck, setSpellCheck] = useState(true)

    const hasChanges = !equals(
      {
        ...serialize(editorState),
        blocks: serialize(editorState).blocks.map(omit(['key'])),
      },
      {
        ...serialize(note.editorState),
        blocks: serialize(note.editorState).blocks.map(omit(['key'])),
      }
    )

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

    const handleDiscard = () => {
      setEditorState(EditorState.createEmpty())
      setTimeout(() => setEditorState(note.editorState), 0)
    }

    return (
      <>
        <NoteHeader note={note} />
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
              '.public-DraftEditor-content': {
                '.public-DraftStyleDefault-pre, blockquote': {
                  bgcolor: 'rgba(0, 0, 0, 0.35)',
                },
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
        {hasChanges && (
          <ChangesBar
            loading={false /* isUpdatingEditorState */}
            onDiscard={handleDiscard}
            onSave={
              async () =>
                console.log(
                  'editorState',
                  JSON.stringify(serialize(editorState))
                )
              // updateEditorStateMutation({
              //   projectId: selectedProjectId!,
              //   noteId: note.id,
              //   editorState,
              //   token: await getToken(),
              // })
            }
          />
        )}
      </>
    )
  }
)

export default Note
