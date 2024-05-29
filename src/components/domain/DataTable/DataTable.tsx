import ActionsDropdown from '@/components/layout/ActionsDropdown/ActionsDropdown'
import ColumnVisibilityDropdown from '@/components/layout/ColumnVisibilityDropdown/ColumnVisibilityDropdown'
import EmptyTableRow from '@/components/layout/EmptyTableRow/EmptyTableRow'
import LoadingTableRows from '@/components/layout/LoadingTableRows/LoadingTableRows'
import SelectedRowsIndicator from '@/components/layout/SelectedRowsIndicator/SelectedRowsIndicator'
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
  OnChangeFn,
  PaginationState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
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
  data: Data[] | undefined
  isFetching?: boolean
  isPlaceholderData?: boolean
  pagination: {
    page: number
    size: number
    total: number | undefined
    onChange: OnChangeFn<PaginationState>
  }
}

const DataTable = ({
  className,
  data = [],
  isFetching,
  isPlaceholderData,
  pagination,
}: DataTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
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
          <ArrowUpDown className='w-4 h-4 ml-2' />
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
      sorting,
      rowSelection,
      columnFilters,
      columnVisibility,
      pagination: { pageIndex: pagination.page, pageSize: pagination.size },
    },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    rowCount: pagination.total,
    onPaginationChange: pagination.onChange,
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
