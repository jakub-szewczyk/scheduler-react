import { cn } from '@/modules/common'
import { Table } from '@tanstack/react-table'
import { HTMLAttributes } from 'react'
import PaginationCapacity from './PaginationCapacity/PaginationCapacity'
import PaginationControls from './PaginationControls/PaginationControls'

interface DataTablePaginationProps<Data> {
  className?: HTMLAttributes<HTMLDivElement>['className']
  table: Table<Data>
}

const DataTablePagination = <Data,>({
  className,
  table,
}: DataTablePaginationProps<Data>) => (
  <div className={cn('flex items-center gap-x-4', className)}>
    <PaginationCapacity table={table} />
    <PaginationControls table={table} />
  </div>
)

export default DataTablePagination
