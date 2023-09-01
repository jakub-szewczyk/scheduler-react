import { ClerkProvider } from '@clerk/clerk-react'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import useSnackbarStore from './hooks/useSnackbarStore'
import Snackbar from './layout/Snackbar/Snackbar'
import router from './router'
import theme from './theme'

const App = () => {
  const openSnackbar = useSnackbarStore((state) => state.open)

  const [queryClient] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: Infinity,
          cacheTime: 0,
          onError: (error) =>
            openSnackbar({
              message:
                (error as AxiosError<{ message: string }>).response?.data
                  .message || 'Something went wrong',
              severity: 'error',
            }),
        },
        mutations: {
          onError: (error) =>
            openSnackbar({
              message:
                (error as AxiosError<{ message: string }>).response?.data
                  .message || 'Something went wrong',
              severity: 'error',
            }),
        },
      },
    })
  )

  return (
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      appearance={{
        variables: {
          colorPrimary: theme.palette.primary.main,
          colorBackground: theme.palette.secondary.dark,
          colorText: theme.palette.text.primary,
          colorTextSecondary: theme.palette.text.secondary,
          colorTextOnPrimaryBackground: theme.palette.common.black,
          colorSuccess: theme.palette.success.main,
          colorWarning: theme.palette.warning.main,
          colorDanger: theme.palette.error.main,
          colorShimmer: theme.palette.divider,
          colorAlphaShade: theme.palette.divider,
          colorInputText: theme.palette.text.primary,
          colorInputBackground: theme.palette.secondary.dark,
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Snackbar />
          <RouterProvider router={router} />
        </ThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  )
}

export default App
