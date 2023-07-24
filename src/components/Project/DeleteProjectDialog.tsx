import { Button, Typography } from '@mui/material'
import { MouseEventHandler } from 'react'
import DraggableDialog, {
  DraggableDialogProps,
} from '../../layout/DraggableDialog/DraggableDialog'
import { Project } from '@/types/project'
import { LoadingButton } from '@mui/lab'

interface DeleteProjectDialogProps extends DraggableDialogProps {
  project: Project
  loading?: boolean
  onDelete: (name: string) => void
  onCancel?: MouseEventHandler<HTMLButtonElement> | undefined
}

const DeleteProjectDialog = ({
  project,
  loading = false,
  onDelete,
  onClose,
  onCancel = onClose as MouseEventHandler<HTMLButtonElement> | undefined,
  ...props
}: DeleteProjectDialogProps) => (
  <DraggableDialog
    {...props}
    onClose={onClose}
    dialogTitle='Delete project'
    dialogContent={
      <Typography>Are you sure you want to delete this project?</Typography>
    }
    dialogActions={
      <>
        <Button variant='outlined' onClick={onCancel}>
          Cancel
        </Button>
        <LoadingButton
          variant='outlined'
          loading={loading}
          onClick={() => onDelete(project.name)}
        >
          Delete
        </LoadingButton>
      </>
    }
  />
)

export default DeleteProjectDialog
