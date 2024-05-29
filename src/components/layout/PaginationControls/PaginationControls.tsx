import { Table } from '@tanstack/react-table'
import PaginationFirstPageButton from '../PaginationFirstPageButton/PaginationFirstPageButton'
import PaginationLastPageButton from '../PaginationLastPageButton/PaginationLastPageButton'
import PaginationNextPageButton from '../PaginationNextPageButton/PaginationNextPageButton'
import PaginationPreviousPageButton from '../PaginationPreviousPageButton/PaginationPreviousPageButton'

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
      <PaginationFirstPageButton table={table} />
      <PaginationPreviousPageButton table={table} />
      <PaginationNextPageButton table={table} />
      <PaginationLastPageButton table={table} />
    </div>
  </div>
)

export default PaginationControls
