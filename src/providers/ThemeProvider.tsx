import { createContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'

export const ThemeProviderContext = createContext<{
  theme: Theme
  setTheme: (theme: Theme) => void
}>({
  theme: 'system',
  setTheme: () => null,
})

interface ThemeProviderProps {
  children: React.ReactNode
  storageKey?: string
  defaultTheme?: Theme
}

const ThemeProvider = ({
  children,
  storageKey = 'theme',
  defaultTheme = 'system',
  ...props
}: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    if (theme === 'system')
      return root.classList.add(
        window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
      )
    root.classList.add(theme)
  }, [theme])

  return (
    <ThemeProviderContext.Provider
      {...props}
      value={{
        theme,
        setTheme: (theme: Theme) => {
          localStorage.setItem(storageKey, theme)
          setTheme(theme)
        },
      }}
    >
      {children}
    </ThemeProviderContext.Provider>
  )
}

export default ThemeProvider
