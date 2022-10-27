import { createTheme } from '@mui/material'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0fbd92',
    },
    secondary: {
      main: '#1f2647',
    },
    background: {
      default: '#1f2647',
      paper: 'rgb(21, 26, 49)',
    },
  },
})

export default theme
