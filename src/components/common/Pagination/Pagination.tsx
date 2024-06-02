import PaginationCapacity from '@/components/common/Pagination/PaginationCapacity/PaginationCapacity'
import PaginationControls from '@/components/common/Pagination/PaginationControls/PaginationControls'
import { cn } from '@/modules/common'
import { Table } from '@tanstack/react-table'
import { HTMLAttributes } from 'react'

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
