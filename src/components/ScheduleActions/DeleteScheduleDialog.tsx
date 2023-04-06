import { Button, Typography } from '@mui/material'
import { MouseEventHandler } from 'react'
import { Schedule } from '../../types/schedule'
import DraggableDialog, {
  DraggableDialogProps,
} from '../../layout/DraggableDialog/DraggableDialog'

interface DeleteScheduleDialogProps extends DraggableDialogProps {
  schedule: Schedule
  onDelete: (name: string) => void
  onCancel?: MouseEventHandler<HTMLButtonElement> | undefined
}

const DeleteScheduleDialog = ({
  schedule,
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
        <Button variant='outlined' onClick={() => onDelete(schedule.name)}>
          Delete
        </Button>
      </>
    }
  />
)

export default DeleteScheduleDialog
