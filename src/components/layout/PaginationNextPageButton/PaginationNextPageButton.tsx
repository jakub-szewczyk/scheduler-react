import { Button } from '@/components/ui/button'
import { Table } from '@tanstack/react-table'
import { ChevronRightIcon } from 'lucide-react'

interface PaginationNextPageButtonProps<Data> {
  table: Table<Data>
}

const PaginationNextPageButton = <Data,>({
  table,
}: PaginationNextPageButtonProps<Data>) => (
  <Button
    className='w-8 h-8'
    size='icon'
    variant='outline'
    disabled={!table.getCanNextPage()}
    onClick={() => table.nextPage()}
  >
    <ChevronRightIcon className='w-4 h-4' />
  </Button>
)

export default PaginationNextPageButton
