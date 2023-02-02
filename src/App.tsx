import { CssBaseline, ThemeProvider } from '@mui/material'
import { RouterProvider } from 'react-router-dom'
import useSchedules from './hooks/useSchedules'
import createRouter from './router'
import theme from './theme'

const App = () => {
  const { schedule } = useSchedules()

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={createRouter(schedule)} />
    </ThemeProvider>
  )
}

export default App
