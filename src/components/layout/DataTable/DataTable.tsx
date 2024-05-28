import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { lowerCase, upperFirst } from 'lodash/fp'
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react'
import { HTMLAttributes, useState } from 'react'

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
  pagination: PaginationState & {
    rowCount: number | undefined
    onPaginationChange: OnChangeFn<PaginationState>
  }
}

const DataTable = ({
  data = [],
  isFetching,
  isPlaceholderData,
  pagination,
  className,
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
      cell: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className='w-8 h-8 p-0 float-right'
              variant='ghost'
              disabled={isFetching}
            >
              <MoreHorizontal className=' w-4 h-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Details</DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
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
      pagination,
    },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    rowCount: pagination.rowCount,
    onPaginationChange: pagination.onPaginationChange,
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className='w-full justify-between sm:max-w-fit'
              variant='outline'
            >
              Columns <ChevronDown className='w-4 h-4 ml-2' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(value)}
                >
                  {upperFirst(lowerCase(column.id))}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
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
              Array(pagination.pageSize)
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
            ) : (
              <TableRow>
                <TableCell
                  className='h-24 text-center'
                  colSpan={columns.length}
                >
                  No results
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center gap-x-2 mt-4'>
        <div className='flex-1 text-sm text-muted-foreground'>
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className='flex gap-x-2'>
          <Button
            size='sm'
            variant='outline'
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            Previous
          </Button>
          <Button
            size='sm'
            variant='outline'
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DataTable
