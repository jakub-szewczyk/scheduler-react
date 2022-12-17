import Dialog, { DialogProps } from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Paper, { PaperProps } from '@mui/material/Paper'
import { ReactNode } from 'react'
import Draggable from 'react-draggable'

interface DraggableDialogProps extends DialogProps {
  dialogTitle?: ReactNode
  dialogContent?: ReactNode
  dialogActions?: ReactNode
}

const DraggableDialog = ({
  dialogTitle,
  dialogContent,
  dialogActions,
  ...props
}: DraggableDialogProps) => (
  <Dialog
    {...props}
    aria-labelledby='draggable-dialog-title'
    PaperComponent={PaperComponent}
  >
    <DialogTitle id='draggable-dialog-title' sx={{ cursor: 'move' }}>
      {dialogTitle}
    </DialogTitle>
    <DialogContent>
      <DialogContentText>{dialogContent}</DialogContentText>
    </DialogContent>
    <DialogActions>{dialogActions}</DialogActions>
  </Dialog>
)

const PaperComponent = (props: PaperProps) => (
  <Draggable
    handle='#draggable-dialog-title'
    cancel='[class*="MuiDialogContent-root"]'
  >
    <Paper {...props} />
  </Draggable>
)

export type { DraggableDialogProps }

export default DraggableDialog
