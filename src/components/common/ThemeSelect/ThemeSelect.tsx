import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import useTheme from '@/hooks/useTheme'
import { DropdownMenuContentProps } from '@radix-ui/react-dropdown-menu'
import { Moon, Sun } from 'lucide-react'

interface ThemeSelectProps {
  dropdownMenuContentProps?: DropdownMenuContentProps
}

const ThemeSelect = ({ dropdownMenuContentProps }: ThemeSelectProps) => {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className='w-8 h-8' size='icon' variant='outline'>
          <Sun className='w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
          <Moon className='absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent {...dropdownMenuContentProps}>
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ThemeSelect
