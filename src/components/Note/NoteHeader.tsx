import { updateNote } from '@/services/note'
import { InitialValues, Note } from '@/types/note'
import { useAuth } from '@clerk/clerk-react'
import EditIcon from '@mui/icons-material/Edit'
import { IconButton, Stack, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FormikHelpers } from 'formik'
import { useBoolean, useReadLocalStorage } from 'usehooks-ts'
import UpsertNoteDialog from '../NoteActions/UpsertNoteDialog'

interface NoteHeaderProps {
  note: Note
}

const NoteHeader = ({ note }: NoteHeaderProps) => {
  const selectedProjectId = useReadLocalStorage<string | null>(
    'selectedProjectId'
  )

  const {
    value: isEditNoteDialogOpen,
    setFalse: closeEditNoteDialog,
    setTrue: openEditNoteDialog,
  } = useBoolean()

  const { getToken } = useAuth()

  const queryClient = useQueryClient()

  const { mutate: updateNoteMutation, isLoading: isNoteUpdating } = useMutation(
    updateNote,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['projects', selectedProjectId, 'notes'])
        closeEditNoteDialog()
      },
    }
  )

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
      <Stack
        direction='row'
        justifyContent='center'
        alignItems='center'
        columnGap={1.5}
        width={{
          xs: 'calc(100% - 32px)',
          sm: 'calc(100% - 48px)',
        }}
        maxWidth={(theme) => theme.breakpoints.values.lg}
        marginX='auto'
      >
        <IconButton size='small' onClick={openEditNoteDialog}>
          <EditIcon fontSize='small' />
        </IconButton>
        <Typography maxWidth={(theme) => theme.breakpoints.values.sm} noWrap>
          {note.name}
        </Typography>
      </Stack>
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
}
export default NoteHeader
