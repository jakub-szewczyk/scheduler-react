import { cn } from '@/modules/common'
import { ReactNode } from '@tanstack/react-router'
import { HTMLAttributes } from 'react'

interface NavbarProps {
  className?: HTMLAttributes<HTMLElement>['className']
  children?: ReactNode
}

const Navbar = ({ className, children }: NavbarProps) => (
  <header
    className={cn(
      'z-10 inset-x-0 fixed flex items-center justify-end gap-x-4 h-12 px-3 border-b bg-background/50 backdrop-blur-sm sm:px-6',
      className
    )}
  >
    {children}
  </header>
)

export default Navbar
