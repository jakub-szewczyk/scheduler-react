import { exportToPDF } from '@/modules/note'
import { createNote, updateNote } from '@/services/note'
import { InitialValues, Note } from '@/types/note'
import { useAuth } from '@clerk/clerk-react'
import DownloadIcon from '@mui/icons-material/Download'
import EditIcon from '@mui/icons-material/Edit'
import StickyNote2Icon from '@mui/icons-material/StickyNote2'
import { SpeedDial, SpeedDialAction } from '@mui/material'
import SpeedDialIcon from '@mui/material/SpeedDialIcon'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Editor } from 'draft-js'
import { FormikHelpers } from 'formik'
import { RefObject, forwardRef } from 'react'
import { useBoolean, useLocalStorage, useReadLocalStorage } from 'usehooks-ts'
import NotesDrawer from './NotesDrawer'
import UpsertNoteDialog from './UpsertNoteDialog'

interface NoteActionsProps {
  note: Note
}

const NoteActions = forwardRef<Editor, NoteActionsProps>(({ note }, ref) => {
  const editorRef = ref as RefObject<Editor>

  const selectedProjectId = useReadLocalStorage<string | null>(
    'selectedProjectId'
  )

  const [, setSelectedNoteId] = useLocalStorage<string | null>(
    'selectedNoteId',
    null
  )

  const {
    value: isNotesDrawerOpen,
    setFalse: closeNotesDrawer,
    setTrue: openNotesDrawer,
  } = useBoolean()

  const {
    value: isCreateNoteDialogOpen,
    setFalse: closeCreateNoteDialog,
    setTrue: openCreateNoteDialog,
  } = useBoolean()

  const {
    value: isEditNoteDialogOpen,
    setFalse: closeEditNoteDialog,
    setTrue: openEditNoteDialog,
  } = useBoolean()

  const { getToken } = useAuth()

  const queryClient = useQueryClient()

  const { mutate: createNoteMutation, isLoading: isNoteCreating } = useMutation(
    createNote,
    {
      onSuccess: ({ id }) => {
        queryClient.invalidateQueries(
          ['projects', selectedProjectId, 'notes'],
          { exact: true }
        )
        setSelectedNoteId(id)
        closeCreateNoteDialog()
      },
    }
  )

  const { mutate: updateNoteMutation, isLoading: isNoteUpdating } = useMutation(
    updateNote,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['projects', selectedProjectId, 'notes'])
        closeEditNoteDialog()
      },
    }
  )

  const handleNoteSelect = (noteId: string) => {
    setSelectedNoteId(noteId)
    closeNotesDrawer()
  }

  const handleNoteCreate = async (
    values: InitialValues,
    formikHelpers: FormikHelpers<InitialValues>
  ) =>
    createNoteMutation({
      projectId: selectedProjectId!,
      name: values.name,
      token: await getToken(),
    })

  const handleNoteEdit = async (
    values: InitialValues,
    formikHelpers: FormikHelpers<InitialValues>
  ) =>
    updateNoteMutation({
      projectId: selectedProjectId!,
      noteId: note.id,
      name: values.name,
      token: await getToken(),
    })

  return (
    <>
      <SpeedDial
        ariaLabel='speed-dial'
        icon={<SpeedDialIcon />}
        sx={{
          position: 'fixed',
          bottom: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
        }}
      >
        <SpeedDialAction
          tooltipTitle='Download'
          icon={<DownloadIcon />}
          onClick={() => exportToPDF(editorRef.current!, note.name)}
        />
        <SpeedDialAction
          tooltipTitle='Rename'
          icon={<EditIcon />}
          onClick={openEditNoteDialog}
        />
        <SpeedDialAction
          tooltipTitle='Notes'
          icon={<StickyNote2Icon fontSize='small' />}
          onClick={openNotesDrawer}
        />
      </SpeedDial>
      <NotesDrawer
        open={isNotesDrawerOpen}
        onOpen={openNotesDrawer}
        onClose={closeNotesDrawer}
        onSelect={handleNoteSelect}
        onCreate={openCreateNoteDialog}
      />
      <UpsertNoteDialog
        mode='CREATE'
        open={isCreateNoteDialogOpen}
        onClose={closeCreateNoteDialog}
        note={note}
        loading={isNoteCreating}
        onCreate={handleNoteCreate}
      />
      <UpsertNoteDialog
        mode='EDIT'
        open={isEditNoteDialogOpen}
        onClose={closeEditNoteDialog}
        note={note}
        loading={isNoteUpdating}
        onEdit={handleNoteEdit}
      />
    </>
  )
})

export default NoteActions
