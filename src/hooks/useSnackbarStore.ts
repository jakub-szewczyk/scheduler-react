import { AlertColor } from '@mui/material'
import { create } from 'zustand'

interface State {
  isOpen: boolean
  message: string
  severity: AlertColor
}

interface Actions {
  open: ({
    message,
    severity,
  }: {
    message: string
    severity?: AlertColor
  }) => void
  close: () => void
}

const useSnackbarStore = create<State & Actions>()((set) => ({
  isOpen: false,
  message: '',
  severity: 'success',
  open: ({ message, severity }) => set({ isOpen: true, message, severity }),
  close: () => set({ isOpen: false }),
}))

export default useSnackbarStore
