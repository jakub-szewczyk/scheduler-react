import { Button, ButtonProps } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/modules/common'
import {
  DropdownMenuContentProps,
  DropdownMenuItemProps,
} from '@radix-ui/react-dropdown-menu'
import { ReactNode } from '@tanstack/react-router'
import { MoreHorizontal } from 'lucide-react'

interface Item extends DropdownMenuItemProps {
  children: ReactNode
}

interface ActionsDropdownProps {
  items: Item[]
  buttonProps?: ButtonProps
  dropdownMenuContentProps?: DropdownMenuContentProps
}

const ActionsDropdown = ({
  items,
  buttonProps,
  dropdownMenuContentProps,
}: ActionsDropdownProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        className={cn('w-8 h-8 p-0', buttonProps?.className)}
        variant='ghost'
        {...buttonProps}
      >
        <MoreHorizontal className='w-4 h-4' />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent {...dropdownMenuContentProps}>
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {items.map((action, index) => (
        <DropdownMenuItem key={index} {...action}>
          {action.children}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
)

export default ActionsDropdown
