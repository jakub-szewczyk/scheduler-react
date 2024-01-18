import { exportToPDF } from '@/modules/note'
import { createNote, updateNote } from '@/services/note'
import { InitialValues, Note } from '@/types/note'
import DownloadIcon from '@mui/icons-material/Download'
import EditIcon from '@mui/icons-material/Edit'
import StickyNote2Icon from '@mui/icons-material/StickyNote2'
import { SpeedDial, SpeedDialAction } from '@mui/material'
import SpeedDialIcon from '@mui/material/SpeedDialIcon'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Editor } from 'draft-js'
import { FormikHelpers } from 'formik'
import { RefObject, forwardRef } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useBoolean } from 'usehooks-ts'
import NotesDrawer from './NotesDrawer'
import UpsertNoteDialog from './UpsertNoteDialog'

type Params = {
  projectId: string
  noteId: string
}

interface NoteActionsProps {
  note: Note
}

const NoteActions = forwardRef<Editor, NoteActionsProps>(({ note }, ref) => {
  const editorRef = ref as RefObject<Editor>

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

  const [searchParams] = useSearchParams()

  const params = useParams<Params>()

  const navigate = useNavigate()

  const queryClient = useQueryClient()

  const { mutate: createNoteMutation, isLoading: isNoteCreating } = useMutation(
    createNote,
    {
      onSuccess: async (note) => {
        await queryClient.invalidateQueries(
          ['projects', params.projectId, 'notes'],
          { exact: true }
        )
        navigate({
          pathname: `/projects/${params.projectId}/notes/${note.id}`,
          search: searchParams.toString(),
        })
        closeCreateNoteDialog()
      },
    }
  )

  const { mutate: updateNoteMutation, isLoading: isNoteUpdating } = useMutation(
    updateNote,
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries([
          'projects',
          params.projectId,
          'notes',
        ])
        closeEditNoteDialog()
      },
    }
  )

  const handleNoteSelect = (noteId: string) => {
    navigate({
      pathname: `/projects/${params.projectId}/notes/${noteId}`,
      search: searchParams.toString(),
    })
    closeNotesDrawer()
  }

  const handleNoteCreate = (
    values: InitialValues,
    _: FormikHelpers<InitialValues>
  ) =>
    createNoteMutation({
      projectId: params.projectId!,
      name: values.name,
    })

  const handleNoteEdit = (
    values: InitialValues,
    _: FormikHelpers<InitialValues>
  ) =>
    updateNoteMutation({
      projectId: params.projectId!,
      noteId: note.id,
      name: values.name,
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
