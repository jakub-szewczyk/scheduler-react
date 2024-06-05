import ActionsDropdown from '@/components/common/ActionsDropdown/ActionsDropdown'
import NoResultsRow from '@/components/common/Table/NoResultsRow/NoResultsRow'
import Pagination from '@/components/common/Table/Pagination/Pagination'
import SelectedRowsIndicator from '@/components/common/Table/SelectedRowsIndicator/SelectedRowsIndicator'
import SkeletonRows from '@/components/common/Table/SkeletonRows/SkeletonRows'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/modules/common'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowDown, ArrowUp, Trash } from 'lucide-react'
import { HTMLAttributes, useState } from 'react'
import DataTableSearch from '../DataTableSearch/DataTableSearch'

interface Data {
  id: string
  createdAt: string
  title: string
  description: string
}

interface DataTableProps {
  className?: HTMLAttributes<HTMLDivElement>['className']
  isFetching?: boolean
  isPlaceholderData?: boolean
  data: Data[] | undefined
  sorting: {
    state: SortingState
    onChange: (state: SortingState) => void
  }
  filtering: {
    state: ColumnFiltersState
    onChange: (state: ColumnFiltersState) => void
  }
  pagination: {
    page: number
    size: number
    total: number | undefined
    onChange: (state: { page: number; size: number }) => void
  }
}

const DataTable = ({
  className,
  isFetching,
  isPlaceholderData,
  data = [],
  sorting,
  filtering,
  pagination,
}: DataTableProps) => {
  const [rowSelection, setRowSelection] = useState({})

  const columns: ColumnDef<Data>[] = [
    {
      id: 'check',
      meta: { style: { width: '4rem' } },
      enableHiding: false,
      enableSorting: false,
      header: ({ table }) => (
        <Checkbox
          className='translate-y-0.5'
          disabled={isFetching}
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className='translate-y-0.5'
          disabled={isFetching}
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
    },
    {
      meta: { style: { width: '25%' } },
      accessorKey: 'title',
      enableSorting: false,
      header: 'Title',
      cell: ({ row }) => <div>{row.getValue('title')}</div>,
    },
    {
      accessorKey: 'description',
      enableSorting: false,
      header: 'Description',
      cell: ({ row }) => <div>{row.getValue('description')}</div>,
    },
    {
      meta: { style: { width: '15%' } },
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <Button
          className='-ml-4'
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Created at
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className='w-4 h-4 ml-2' />
          ) : (
            <ArrowDown className='w-4 h-4 ml-2' />
          )}
        </Button>
      ),
      cell: ({ row }) => (
        <div>
          {new Intl.DateTimeFormat('en-US').format(
            new Date(row.getValue('createdAt'))
          )}
        </div>
      ),
    },
    {
      id: 'actions',
      meta: { style: { width: '4rem' } },
      enableHiding: false,
      enableSorting: false,
      cell: () => (
        <ActionsDropdown
          buttonProps={{ className: 'float-right', disabled: isFetching }}
          dropdownMenuContentProps={{ align: 'end' }}
        />
      ),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      sorting: sorting.state,
      columnFilters: filtering.state,
      pagination: { pageIndex: pagination.page, pageSize: pagination.size },
    },
    rowCount: pagination.total,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    manualSorting: true,
    manualFiltering: true,
    manualPagination: true,
    getRowId: (row) => row.id,
    onSortingChange: (updater) => {
      if (typeof updater !== 'function') return
      sorting.onChange(updater(sorting.state))
    },
    onColumnFiltersChange: (updater) => {
      if (typeof updater !== 'function') return
      filtering.onChange(updater(filtering.state))
    },
    onPaginationChange: (updater) => {
      if (typeof updater !== 'function') return
      const { pageIndex, pageSize } = updater({
        pageIndex: pagination.page,
        pageSize: pagination.size,
      })
      pagination.onChange({ page: pageIndex, size: pageSize })
    },
  })

  const selectedRowIds = table.getSelectedRowModel().rows.map(({ id }) => id)

  return (
    <div className={className}>
      <div className='flex items-center justify-between gap-x-2 gap-y-4 mb-4'>
        <DataTableSearch table={table} />
        {selectedRowIds.length > 0 && (
          <Button
            className='gap-x-2 text-destructive'
            variant='ghost'
            // TODO: Open confirm dialog
            onClick={() => console.log(selectedRowIds)}
          >
            <span className='hidden sm:inline'>Delete selected</span>
            <Trash className='size-4' />
          </Button>
        )}
      </div>
      <div className='border rounded-md bg-background'>
        <Table className='min-w-[36rem]'>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} {...header.column.columnDef.meta}>
                    {!header.isPlaceholder &&
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        'max-w-0 [&>div]:truncate',
                        isFetching && !isPlaceholderData && 'opacity-50'
                      )}
                    >
                      {isFetching &&
                      isPlaceholderData &&
                      !cell.id.includes('check') &&
                      !cell.id.includes('actions') ? (
                        <Skeleton className='h-4 w-full' />
                      ) : (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : isFetching ? (
              <SkeletonRows table={table} />
            ) : (
              <NoResultsRow columnsLength={columns.length} />
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-between gap-x-2 mt-4'>
        <SelectedRowsIndicator table={table} />
        <Pagination className='ml-auto' table={table} />
      </div>
    </div>
  )
}

export default DataTable
