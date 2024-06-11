import { Button } from '@/components/ui/button'
import { Table } from '@tanstack/react-table'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from 'lucide-react'

interface PaginationControlsProps<Data> {
  table: Table<Data>
}

const PaginationControls = <Data,>({
  table,
}: PaginationControlsProps<Data>) => (
  <div className='flex items-center gap-x-2'>
    <div className='text-sm text-muted-foreground md:hidden'>
      {table.getState().pagination.pageIndex + 1}/{table.getPageCount()}
    </div>
    <div className='hidden text-sm text-muted-foreground whitespace-nowrap md:block'>
      Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
    </div>
    <div className='flex items-center gap-x-2'>
      <Button
        data-testid='first-page'
        className='w-8 h-8'
        size='icon'
        variant='outline'
        disabled={!table.getCanPreviousPage()}
        onClick={() => table.firstPage()}
      >
        <ChevronsLeftIcon className='h-4 w-4' />
      </Button>
      <Button
        data-testid='previous-page'
        className='w-8 h-8'
        size='icon'
        variant='outline'
        disabled={!table.getCanPreviousPage()}
        onClick={() => table.previousPage()}
      >
        <ChevronLeftIcon className='w-4 h-4' />
      </Button>
      <Button
        data-testid='next-page'
        className='w-8 h-8'
        size='icon'
        variant='outline'
        disabled={!table.getCanNextPage()}
        onClick={() => table.nextPage()}
      >
        <ChevronRightIcon className='w-4 h-4' />
      </Button>
      <Button
        data-testid='last-page'
        className='w-8 h-8'
        size='icon'
        variant='outline'
        disabled={!table.getCanNextPage()}
        onClick={() => table.lastPage()}
      >
        <ChevronsRightIcon className='w-4 h-4' />
      </Button>
    </div>
  </div>
)

export default PaginationControls
