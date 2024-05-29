import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'
import { ColumnDef, Table } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'

interface LoadingTableRowsProps<Data> {
  table: Table<Data>
  columns: ColumnDef<Data>[]
}

const LoadingTableRows = <Data,>({
  table,
  columns,
}: LoadingTableRowsProps<Data>) =>
  Array(table.getState().pagination.pageSize)
    .fill(null)
    .map((_, index) => (
      <TableRow key={index} data-state={false}>
        {columns.map((column, index) => (
          <TableCell key={`${index}_${column.id}`}>
            {column.id?.includes('check') ? (
              <Checkbox className='translate-y-0.5' disabled />
            ) : column.id?.includes('actions') ? (
              <Button
                className='w-8 h-8 p-0 float-right'
                variant='ghost'
                disabled
              >
                <MoreHorizontal className=' w-4 h-4' />
              </Button>
            ) : (
              <Skeleton className='h-4 w-full' />
            )}
          </TableCell>
        ))}
      </TableRow>
    ))

export default LoadingTableRows
