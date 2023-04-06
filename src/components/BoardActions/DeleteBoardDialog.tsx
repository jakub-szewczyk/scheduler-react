import { Button, Typography } from '@mui/material'
import { MouseEventHandler } from 'react'
import DraggableDialog, {
  DraggableDialogProps,
} from '../layout/DraggableDialog/DraggableDialog'
import { Board } from '../../types/board'

interface DeleteBoardDialogProps extends DraggableDialogProps {
  board: Board
  onDelete: (name: string) => void
  onCancel?: MouseEventHandler<HTMLButtonElement> | undefined
}

const DeleteBoardDialog = ({
  board,
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
        <Button variant='outlined' onClick={() => onDelete(board.name)}>
          Delete
        </Button>
      </>
    }
  />
)

export default DeleteBoardDialog
