import { Button } from '@/components/ui/button'
import { Table } from '@tanstack/react-table'
import { ChevronLeftIcon } from 'lucide-react'

interface PaginationPreviousPageButtonProps<Data> {
  table: Table<Data>
}

const PaginationPreviousPageButton = <Data,>({
  table,
}: PaginationPreviousPageButtonProps<Data>) => (
  <Button
    className='w-8 h-8'
    size='icon'
    variant='outline'
    disabled={!table.getCanPreviousPage()}
    onClick={() => table.previousPage()}
  >
    <ChevronLeftIcon className='w-4 h-4' />
  </Button>
)

export default PaginationPreviousPageButton
