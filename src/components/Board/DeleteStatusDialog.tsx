import { Button, Typography } from '@mui/material'
import { MouseEventHandler } from 'react'
import { Status } from '../../types/board'
import DraggableDialog, {
  DraggableDialogProps,
} from '../layout/DraggableDialog/DraggableDialog'

interface DeleteStatusDialogProps extends DraggableDialogProps {
  status: Status
  onDelete: (status: Status) => void
  onCancel?: MouseEventHandler<HTMLButtonElement> | undefined
}

const DeleteStatusDialog = ({
  status,
  onDelete,
  onClose,
  onCancel = onClose as MouseEventHandler<HTMLButtonElement> | undefined,
  ...props
}: DeleteStatusDialogProps) => (
  <DraggableDialog
    {...props}
    onClose={onClose}
    dialogTitle='Delete status'
    dialogContent={
      <Typography>
        Are you sure you want to delete this status and all its related issues?
      </Typography>
    }
    dialogActions={
      <>
        <Button variant='outlined' onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type='submit'
          form='status'
          variant='outlined'
          onClick={() => onDelete(status)}
        >
          Delete
        </Button>
      </>
    }
  />
)

export default DeleteStatusDialog
