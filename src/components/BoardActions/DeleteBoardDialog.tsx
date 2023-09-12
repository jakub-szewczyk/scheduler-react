import { LoadingButton } from '@mui/lab'
import { Button, Typography } from '@mui/material'
import { MouseEventHandler } from 'react'
import DraggableDialog, {
  DraggableDialogProps,
} from '../../layout/DraggableDialog/DraggableDialog'
import { Board } from '../../types/board'

interface DeleteBoardDialogProps extends DraggableDialogProps {
  board: Pick<Board, 'id' | 'createdAt' | 'name'>
  loading?: boolean
  onDelete: (id: string) => void
  onCancel?: MouseEventHandler<HTMLButtonElement> | undefined
}

const DeleteBoardDialog = ({
  board,
  loading = false,
  onDelete,
  onClose,
  onCancel = onClose as MouseEventHandler<HTMLButtonElement> | undefined,
  ...props
}: DeleteBoardDialogProps) => (
  <DraggableDialog
    {...props}
    onClose={onClose}
    dialogTitle='Delete board'
    dialogContent={
      <Typography>Are you sure you want to delete this board?</Typography>
    }
    dialogActions={
      <>
        <Button variant='outlined' onClick={onCancel}>
          Cancel
        </Button>
        <LoadingButton
          variant='outlined'
          loading={loading}
          onClick={() => onDelete(board.id)}
        >
          Delete
        </LoadingButton>
      </>
    }
  />
)

export default DeleteBoardDialog
