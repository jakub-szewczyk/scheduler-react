import { Status } from '@/types/status'
import { Button, Typography } from '@mui/material'
import { MouseEventHandler } from 'react'
import DraggableDialog, {
  DraggableDialogProps,
} from '../../layout/DraggableDialog/DraggableDialog'
import { LoadingButton } from '@mui/lab'

interface DeleteStatusDialogProps extends DraggableDialogProps {
  status: Status
  loading?: boolean
  onDelete: (status: Status) => void
  onCancel?: MouseEventHandler<HTMLButtonElement> | undefined
}

const DeleteStatusDialog = ({
  status,
  loading = false,
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
        Are you sure you want to delete this status and all its issues?
      </Typography>
    }
    dialogActions={
      <>
        <Button variant='outlined' onClick={onCancel}>
          Cancel
        </Button>
        <LoadingButton
          variant='outlined'
          loading={loading}
          onClick={() => onDelete(status)}
        >
          Delete
        </LoadingButton>
      </>
    }
  />
)

export default DeleteStatusDialog
