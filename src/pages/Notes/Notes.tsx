import Note from '@/components/Note/Note'
import NoteActions from '@/components/NoteActions/NoteActions'
import { ProjectContainer } from '@/components/Project/styles/Project.styles'
import { deserialize } from '@/modules/note'
import { getNote, getNotes } from '@/services/note'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { Editor, EditorState, RawDraftContentState } from 'draft-js'
import { useRef } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useImmer } from 'use-immer'

type Params = {
  projectId: string
  noteId: string
}

const Notes = () => {
  const editorRef = useRef<Editor>(null)

  const [editorState, setEditorState] = useImmer<EditorState>(
    EditorState.createEmpty()
  )

  const [searchParams] = useSearchParams()

  const params = useParams<Params>()

  const navigate = useNavigate()

  useQuery(
    ['projects', params.projectId, 'notes'],
    () => getNotes({ projectId: params.projectId! }),
    {
      enabled: !params.noteId,
      onSuccess: (notes) =>
        !params.noteId &&
        navigate(
          {
            pathname: `/projects/${params.projectId}/notes/${notes[0].id}`,
            search: searchParams.toString(),
          },
          { replace: true }
        ),
    }
  )

  const {
    data: note,
    isLoading: isNoteLoading,
    isError: isNoteFetchedUnsuccessfully,
  } = useQuery(
    ['projects', params.projectId, 'notes', params.noteId],
    () => getNote({ projectId: params.projectId!, noteId: params.noteId! }),
    {
      enabled: !!params.noteId,
      select: (note) => ({
        ...note,
        editorState: deserialize(note.editorState as RawDraftContentState),
      }),
      onSuccess: (note) => setEditorState(note.editorState),
    }
  )

  /**
   * TODO:
   * Test loading and error states.
   */
  if (isNoteLoading)
    return (
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <CircularProgress />
      </Box>
    )

  if (isNoteFetchedUnsuccessfully)
    return (
      <ProjectContainer>
        <Typography color='error'>
          Something went wrong. Please try again.
        </Typography>
      </ProjectContainer>
    )

  return (
    <>
      <Note
        ref={editorRef}
        note={note}
        editorState={editorState}
        setEditorState={setEditorState}
      />
      <NoteActions ref={editorRef} note={note} />
    </>
  )
}

export default Notes
