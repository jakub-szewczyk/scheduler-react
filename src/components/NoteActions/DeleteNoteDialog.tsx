import { Note } from '@/types/note'
import { LoadingButton } from '@mui/lab'
import { Button, Typography } from '@mui/material'
import { MouseEventHandler } from 'react'
import DraggableDialog, {
  DraggableDialogProps,
} from '../../layout/DraggableDialog/DraggableDialog'

interface DeleteNoteDialogProps extends DraggableDialogProps {
  note: Pick<Note, 'id' | 'createdAt' | 'name'>
  loading?: boolean
  onDelete: (noteId: string) => void
  onCancel?: MouseEventHandler<HTMLButtonElement> | undefined
}

const DeleteNoteDialog = ({
  note,
  loading = false,
  onDelete,
  onClose,
  onCancel = onClose as MouseEventHandler<HTMLButtonElement> | undefined,
  ...props
}: DeleteNoteDialogProps) => (
  <DraggableDialog
    {...props}
    onClose={onClose}
    dialogTitle='Delete note'
    dialogContent={
      <Typography>Are you sure you want to delete this note?</Typography>
    }
    dialogActions={
      <>
        <Button variant='outlined' onClick={onCancel}>
          Cancel
        </Button>
        <LoadingButton
          variant='outlined'
          loading={loading}
          onClick={() => onDelete(note.id)}
        >
          Delete
        </LoadingButton>
      </>
    }
  />
)

export default DeleteNoteDialog
