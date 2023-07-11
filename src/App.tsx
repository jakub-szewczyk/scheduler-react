import { ClerkProvider } from '@clerk/clerk-react'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import theme from './theme'

const App = () => (
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </ClerkProvider>
)

export default App
