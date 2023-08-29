import useSnackbarStore from '@/hooks/useSnackbarStore'
import {
  Alert,
  CircularProgress,
  Snackbar as MuiSnackbar,
  Stack,
  Typography,
} from '@mui/material'
import { useIsFetching } from '@tanstack/react-query'
import { SyntheticEvent, useEffect } from 'react'
import { shallow } from 'zustand/shallow'

const Snackbar = () => {
  const [isOpen, message, severity, close] = useSnackbarStore(
    (state) => [state.isOpen, state.message, state.severity, state.close],
    shallow
  )

  const isFetching = useIsFetching()

  const handleClose = (event?: Event | SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') return
    close()
  }

  useEffect(() => {
    if (isFetching > 0) close()
  }, [isFetching, close])

  return (
    <>
      <MuiSnackbar
        open={isOpen}
        onClose={handleClose}
        autoHideDuration={isFetching > 0 ? null : 6000}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <Alert severity={severity} onClose={handleClose} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </MuiSnackbar>
      <MuiSnackbar
        open={isFetching > 0}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <Alert severity='info' icon={false} sx={{ width: '100%' }}>
          <Stack direction='row' alignItems='center' columnGap={2}>
            <CircularProgress size={16} />
            <Typography fontSize={14}>Loading, please wait...</Typography>
          </Stack>
        </Alert>
      </MuiSnackbar>
    </>
  )
}

export default Snackbar
