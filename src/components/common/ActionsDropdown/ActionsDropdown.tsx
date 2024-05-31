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
import { FileText, MoreHorizontal, Pencil, Trash } from 'lucide-react'

interface ActionsDropdownProps {
  buttonProps?: ButtonProps
}

const ActionsDropdown = ({ buttonProps }: ActionsDropdownProps) => (
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
    <DropdownMenuContent align='end'>
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
