import { updateNote } from '@/services/note'
import { InitialValues, Note } from '@/types/note'
import EditIcon from '@mui/icons-material/Edit'
import { IconButton, Stack, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FormikHelpers } from 'formik'
import { useParams } from 'react-router-dom'
import { useBoolean } from 'usehooks-ts'
import UpsertNoteDialog from '../NoteActions/UpsertNoteDialog'

type Params = {
  projectId: string
  noteId: string
}

interface NoteHeaderProps {
  note: Note
}

const NoteHeader = ({ note }: NoteHeaderProps) => {
  const {
    value: isEditNoteDialogOpen,
    setFalse: closeEditNoteDialog,
    setTrue: openEditNoteDialog,
  } = useBoolean()

  const params = useParams<Params>()

  const queryClient = useQueryClient()

  const { mutate: updateNoteMutation, isLoading: isNoteUpdating } = useMutation(
    updateNote,
    {
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries([
            'projects',
            params.projectId,
            'notes',
          ]),
          queryClient.invalidateQueries([
            'infinite',
            'projects',
            params.projectId,
            'notes',
          ]),
        ])
        closeEditNoteDialog()
      },
    }
  )

  const handleNoteEdit = (
    values: InitialValues,
    { setSubmitting }: FormikHelpers<InitialValues>
  ) =>
    updateNoteMutation(
      {
        projectId: params.projectId!,
        noteId: note.id,
        name: values.name,
      },
      { onSettled: () => setSubmitting(false) }
    )

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
        mode='update'
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
