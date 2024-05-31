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
import { DropdownMenuContentProps } from '@radix-ui/react-dropdown-menu'
import { FileText, MoreHorizontal, Pencil, Trash } from 'lucide-react'

interface ActionsDropdownProps {
  buttonProps?: ButtonProps
  dropdownMenuContentProps?: DropdownMenuContentProps
}

const ActionsDropdown = ({
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
      <DropdownMenuItem>
        <div className='flex items-center justify-center gap-x-2'>
          <FileText className='w-4 h-4' />
          Details
        </div>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <div className='flex items-center justify-center gap-x-2'>
          <Pencil className='w-4 h-4' />
          Edit
        </div>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <div className='flex items-center justify-center gap-x-2 text-destructive'>
          <Trash className='w-4 h-4' />
          Delete
        </div>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
)

export default ActionsDropdown
