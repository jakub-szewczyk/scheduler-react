import { ThemeProviderContext } from '@/providers/ThemeProvider'
import { useContext } from 'react'

const useTheme = () => useContext(ThemeProviderContext)

export default useTheme
