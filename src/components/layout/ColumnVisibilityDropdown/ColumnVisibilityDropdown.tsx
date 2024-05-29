import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Table } from '@tanstack/react-table'
import { lowerCase, upperFirst } from 'lodash/fp'
import { ChevronDown } from 'lucide-react'

interface ColumnVisibilityDropdownProps<Data> {
  table: Table<Data>
}

const ColumnVisibilityDropdown = <Data,>({
  table,
}: ColumnVisibilityDropdownProps<Data>) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        className='w-full justify-between gap-x-2 sm:max-w-fit'
        variant='outline'
      >
        Columns <ChevronDown className='w-4 h-4' />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align='end'>
      {table
        .getAllColumns()
        .filter((column) => column.getCanHide())
        .map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            checked={column.getIsVisible()}
            onCheckedChange={(value) => column.toggleVisibility(value)}
          >
            {upperFirst(lowerCase(column.id))}
          </DropdownMenuCheckboxItem>
        ))}
    </DropdownMenuContent>
  </DropdownMenu>
)

export default ColumnVisibilityDropdown
