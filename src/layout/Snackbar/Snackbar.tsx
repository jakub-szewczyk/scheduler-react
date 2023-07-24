import useSnackbarStore from '@/hooks/useSnackbarStore'
import { Alert, Snackbar as MuiSnackbar } from '@mui/material'
import { SyntheticEvent } from 'react'
import { shallow } from 'zustand/shallow'

const Snackbar = () => {
  const [isOpen, message, severity, close] = useSnackbarStore(
    (state) => [state.isOpen, state.message, state.severity, state.close],
    shallow
  )

  const handleClose = (event?: Event | SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') return
    close()
  }

  return (
    <MuiSnackbar
      open={isOpen}
      onClose={handleClose}
      autoHideDuration={6000}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
    >
      <Alert severity={severity} onClose={handleClose} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </MuiSnackbar>
  )
}

export default Snackbar
