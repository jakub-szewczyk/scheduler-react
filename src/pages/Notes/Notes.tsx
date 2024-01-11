import Note from '@/components/Note/Note'
import NoteActions from '@/components/NoteActions/NoteActions'
import { ProjectContainer } from '@/components/Project/styles/Project.styles'
import { deserialize } from '@/modules/note'
import { getAllNotes, getNote } from '@/services/note'
import { getProjects } from '@/services/project'
import { useAuth } from '@clerk/clerk-react'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { Editor, EditorState, RawDraftContentState } from 'draft-js'
import { useRef } from 'react'
import { useImmer } from 'use-immer'
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts'

const Notes = () => {
  const editorRef = useRef<Editor>(null)

  const [editorState, setEditorState] = useImmer<EditorState>(
    EditorState.createEmpty()
  )

  const selectedProjectId = useReadLocalStorage<string | null>(
    'selectedProjectId'
  )

  const [selectedNoteId, setSelectedNoteId] = useLocalStorage<string | null>(
    'selectedNoteId',
    null
  )

  const { getToken } = useAuth()

  const { data: projects, isSuccess: isEachProjectFetchedSuccessfully } =
    useQuery(['projects'], async () => getProjects(await getToken()))

  const { data: notes, isSuccess: isEachNoteFetchedSuccessfully } = useQuery(
    ['projects', selectedProjectId, 'notes'],
    async () =>
      getAllNotes({
        projectId: selectedProjectId!,
        token: await getToken(),
      }),
    {
      enabled:
        !!selectedProjectId &&
        isEachProjectFetchedSuccessfully &&
        projects.map((project) => project.id).includes(selectedProjectId),
      onSuccess: (notes) => {
        if (
          selectedNoteId &&
          notes.map((note) => note.id).includes(selectedNoteId)
        )
          return
        setSelectedNoteId(notes[0].id)
      },
    }
  )

  const {
    data: note,
    isLoading: isNoteLoading,
    isError: isNoteFetchedWithError,
  } = useQuery(
    ['projects', selectedProjectId, 'notes', selectedNoteId],
    async () =>
      getNote({
        projectId: selectedProjectId!,
        noteId: selectedNoteId!,
        token: await getToken(),
      }),
    {
      enabled:
        !!selectedNoteId &&
        isEachNoteFetchedSuccessfully &&
        notes.map((note) => note.id).includes(selectedNoteId),
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

  if (isNoteFetchedWithError)
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
