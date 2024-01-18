import ChangesBar from '@/layout/ChangesBar/ChangesBar'
import { isPlaceholderVisible, serialize } from '@/modules/note'
import { updateEditorState } from '@/services/editorState'
import { Note as INote } from '@/types/note'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
import { useParams } from 'react-router-dom'
import NoteHeader from './NoteHeader'
import Toolbar from './Toolbar'
import { EditorContainer, NoteContainer } from './styles/Note.styled'

type Params = {
  projectId: string
  noteId: string
}

interface NoteProps {
  note: INote & { editorState: EditorState }
  editorState: EditorState
  setEditorState: Dispatch<SetStateAction<EditorState>>
}

const Note = forwardRef<Editor, NoteProps>(
  ({ note, editorState, setEditorState }, ref) => {
    const editorRef = ref as RefObject<Editor>

    const [spellCheck, setSpellCheck] = useState(true)

    const params = useParams<Params>()

    const queryClient = useQueryClient()

    const {
      mutate: updateEditorStateMutation,
      isLoading: isEditorStateUpdating,
    } = useMutation(updateEditorState, {
      onSuccess: () =>
        queryClient.invalidateQueries(['projects', params.projectId, 'notes']),
    })

    const handleKeyCommand = (
      command: string,
      editorState: EditorState,
      _: number
    ): DraftHandleValue => {
      const newEditorState = RichUtils.handleKeyCommand(editorState, command)
      if (newEditorState) {
        setEditorState(newEditorState)
        return 'handled'
      }
      return 'not-handled'
    }

    /**
     * TODO:
     * Handle state reset without the flicker
     * caused by complete input clearing.
     */
    const handleDiscard = () => {
      setEditorState(EditorState.createEmpty())
      setTimeout(() => setEditorState(note.editorState), 0)
    }

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
            loading={isEditorStateUpdating}
            onDiscard={handleDiscard}
            onSave={() =>
              updateEditorStateMutation({
                projectId: params.projectId!,
                noteId: note.id,
                editorState: serialize(editorState),
              })
            }
          />
        )}
      </>
    )
  }
)

export default Note
