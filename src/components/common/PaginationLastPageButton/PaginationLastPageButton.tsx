import { Button } from '@/components/ui/button'
import { Table } from '@tanstack/react-table'
import { ChevronsRightIcon } from 'lucide-react'

interface PaginationLastPageButtonProps<Data> {
  table: Table<Data>
}

const PaginationLastPageButton = <Data,>({
  table,
}: PaginationLastPageButtonProps<Data>) => (
  <Button
    className='w-8 h-8'
    size='icon'
    variant='outline'
    disabled={!table.getCanNextPage()}
    onClick={() => table.lastPage()}
  >
    <ChevronsRightIcon className='w-4 h-4' />
  </Button>
)

export default PaginationLastPageButton
