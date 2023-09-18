import DraggableDialog, {
  DraggableDialogProps,
} from '@/layout/DraggableDialog/DraggableDialog'
import { Issue } from '@/types/issue'
import { LoadingButton } from '@mui/lab'
import { Button, Typography } from '@mui/material'
import { MouseEventHandler } from 'react'

interface DeleteIssueDialogProps extends DraggableDialogProps {
  issue: Issue
  loading?: boolean
  onDelete: (issue: Issue) => void
  onCancel?: MouseEventHandler<HTMLButtonElement> | undefined
}

const DeleteIssueDialog = ({
  issue,
  loading = false,
  onDelete,
  onClose,
  onCancel = onClose as MouseEventHandler<HTMLButtonElement> | undefined,
  ...props
}: DeleteIssueDialogProps) => (
  <DraggableDialog
    {...props}
    onClose={onClose}
    dialogTitle='Delete issue'
    dialogContent={
      <Typography>Are you sure you want to delete this issue?</Typography>
    }
    dialogActions={
      <>
        <Button variant='outlined' onClick={onCancel}>
          Cancel
        </Button>
        <LoadingButton
          variant='outlined'
          loading={loading}
          onClick={() => onDelete(issue)}
        >
          Delete
        </LoadingButton>
      </>
    }
  />
)

export default DeleteIssueDialog
