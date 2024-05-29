import { Button } from '@/components/ui/button'
import { Table } from '@tanstack/react-table'
import { ChevronsLeftIcon } from 'lucide-react'

interface PaginationFirstPageButtonProps<Data> {
  table: Table<Data>
}

const PaginationFirstPageButton = <Data,>({
  table,
}: PaginationFirstPageButtonProps<Data>) => (
  <Button
    className='w-8 h-8'
    size='icon'
    variant='outline'
    disabled={!table.getCanPreviousPage()}
    onClick={() => table.firstPage()}
  >
    <ChevronsLeftIcon className='h-4 w-4' />
  </Button>
)

export default PaginationFirstPageButton
