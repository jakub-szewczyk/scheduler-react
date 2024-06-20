import useTheme from '@/hooks/useTheme'
import { Router } from '@/main'
import { ClerkProvider } from '@clerk/clerk-react'
import { ReactNode } from '@tanstack/react-router'

const COLOR = {
  BACKGROUND: 'hsl(222.2 84% 4.9%)',
  DESTRUCTIVE: 'hsl(0 84.2% 60.2%)',
  MUTED_FOREGROUND: 'hsl(215 20.2% 65.1%)',
  PRIMARY_FOREGROUND: 'hsl(222.2 47.4% 11.2%)',
  PRIMARY: 'hsl(210 40% 98%)',
}

interface AuthProviderProps {
  router: Router
  children?: ReactNode
}

const AuthProvider = ({ router, children }: AuthProviderProps) => {
  const { theme } = useTheme()

  return (
    <ClerkProvider
      routerPush={(to) => router.navigate({ to })}
      routerReplace={(to) => router.navigate({ to, replace: true })}
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      appearance={{
        variables: {
          colorDanger: COLOR.DESTRUCTIVE,
          ...((theme === 'system'
            ? window.matchMedia('(prefers-color-scheme: dark)').matches
              ? 'dark'
              : 'light'
            : theme) === 'dark' && {
            colorBackground: COLOR.BACKGROUND,
            colorInputBackground: COLOR.BACKGROUND,
            colorInputText: COLOR.PRIMARY,
            colorNeutral: COLOR.PRIMARY,
            colorPrimary: COLOR.PRIMARY,
            colorText: COLOR.PRIMARY,
            colorTextOnPrimaryBackground: COLOR.PRIMARY_FOREGROUND,
            colorTextSecondary: COLOR.MUTED_FOREGROUND,
          }),
        },
      }}
    >
      {children}
    </ClerkProvider>
  )
}

export default AuthProvider
