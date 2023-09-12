import { LoadingButton } from '@mui/lab'
import { Button, Typography } from '@mui/material'
import { MouseEventHandler } from 'react'
import DraggableDialog, {
  DraggableDialogProps,
} from '../../layout/DraggableDialog/DraggableDialog'
import { Schedule } from '../../types/schedule'

interface DeleteScheduleDialogProps extends DraggableDialogProps {
  schedule: Pick<Schedule, 'id' | 'createdAt' | 'name'>
  loading?: boolean
  onDelete: (id: string) => void
  onCancel?: MouseEventHandler<HTMLButtonElement> | undefined
}

const DeleteScheduleDialog = ({
  schedule,
  loading = false,
  onDelete,
  onClose,
  onCancel = onClose as MouseEventHandler<HTMLButtonElement> | undefined,
  ...props
}: DeleteScheduleDialogProps) => (
  <DraggableDialog
    {...props}
    onClose={onClose}
    dialogTitle='Delete schedule'
    dialogContent={
      <Typography>Are you sure you want to delete this schedule?</Typography>
    }
    dialogActions={
      <>
        <Button variant='outlined' onClick={onCancel}>
          Cancel
        </Button>
        <LoadingButton
          variant='outlined'
          loading={loading}
          onClick={() => onDelete(schedule.id)}
        >
          Delete
        </LoadingButton>
      </>
    }
  />
)

export default DeleteScheduleDialog
