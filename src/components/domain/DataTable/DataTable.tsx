import ActionsDropdown from '@/components/common/ActionsDropdown/ActionsDropdown'
import ColumnVisibilityDropdown from '@/components/common/ColumnVisibilityDropdown/ColumnVisibilityDropdown'
import EmptyTableRow from '@/components/common/EmptyTableRow/EmptyTableRow'
import LoadingTableRows from '@/components/common/LoadingTableRows/LoadingTableRows'
import SelectedRowsIndicator from '@/components/common/SelectedRowsIndicator/SelectedRowsIndicator'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
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
  VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { HTMLAttributes, useState } from 'react'
import DataTablePagination from '../DataTablePagination/DataTablePagination'

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
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const columns: ColumnDef<Data>[] = [
    {
      id: 'check',
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
      enableHiding: false,
      enableSorting: false,
      cell: () => <ActionsDropdown disabled={isFetching} />,
    },
  ]

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      columnVisibility,
      sorting: sorting.state,
      columnFilters: filtering.state,
      pagination: { pageIndex: pagination.page, pageSize: pagination.size },
    },
    rowCount: pagination.total,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    manualSorting: true,
    manualFiltering: true,
    manualPagination: true,
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

  return (
    <div className={className}>
      <div className='flex flex-wrap items-center justify-between gap-x-2 gap-y-4 mb-4'>
        <Input
          className='w-full sm:max-w-sm'
          placeholder='Search by title'
          value={(table.getColumn('title')?.getFilterValue() as string) || ''}
          onChange={(event) =>
            table.getColumn('title')?.setFilterValue(event.target.value)
          }
        />
        <ColumnVisibilityDropdown table={table} />
      </div>
      <div className='border rounded-md bg-background'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
              <LoadingTableRows table={table} columns={columns} />
            ) : (
              <EmptyTableRow columns={columns} />
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-between gap-x-2 mt-4'>
        <SelectedRowsIndicator table={table} />
        <DataTablePagination className='ml-auto' table={table} />
      </div>
    </div>
  )
}

export default DataTable
