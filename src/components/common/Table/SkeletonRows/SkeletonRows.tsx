import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'
import { Table } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'

interface SkeletonRowsProps<Data> {
  table: Table<Data>
}

const SkeletonRows = <Data,>({ table }: SkeletonRowsProps<Data>) =>
  Array(table.getState().pagination.pageSize)
    .fill(null)
    .map((_, index) => (
      <TableRow key={index} data-state={false}>
        {table.getAllColumns().map((column, index) => (
          <TableCell key={`${index}_${column.id}`}>
            {column.id?.includes('check') ? (
              <Checkbox className='translate-y-0.5' disabled />
            ) : column.id?.includes('actions') ? (
              <Button
                className='w-8 h-8 p-0 float-right'
                variant='ghost'
                disabled
              >
                <MoreHorizontal className='size-4' />
              </Button>
            ) : (
              <Skeleton className='w-full h-4' />
            )}
          </TableCell>
        ))}
      </TableRow>
    ))

export default SkeletonRows
