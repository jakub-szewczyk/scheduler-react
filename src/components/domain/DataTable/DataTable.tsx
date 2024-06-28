import ActionsDropdown from '@/components/common/ActionsDropdown/ActionsDropdown'
import DeleteConfirmationDialog from '@/components/common/Table/DeleteConfirmationDialog/DeleteConfirmationDialog'
import NoResultsRow from '@/components/common/Table/NoResultsRow/NoResultsRow'
import Pagination from '@/components/common/Table/Pagination/Pagination'
import SelectedRowsIndicator from '@/components/common/Table/SelectedRowsIndicator/SelectedRowsIndicator'
import SkeletonRows from '@/components/common/Table/SkeletonRows/SkeletonRows'
import TableSearch from '@/components/common/Table/TableSearch/TableSearch'
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
import { cn, subjectToDeleteMutationFn, toDateFormat } from '@/modules/common'
import { Board } from '@/types/board'
import { Subject } from '@/types/common'
import { Note } from '@/types/note'
import { Project } from '@/types/project'
import { Schedule } from '@/types/schedule'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from '@tanstack/react-router'
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowDown, ArrowUp, FileText, Pencil, Trash } from 'lucide-react'
import { HTMLAttributes, useState } from 'react'
import { useBoolean } from 'usehooks-ts'

interface DataTableProps<Data> {
  className?: HTMLAttributes<HTMLDivElement>['className']
  isFetching?: boolean
  isPlaceholderData?: boolean
  subject: Subject
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

const DataTable = <Data extends Project & Schedule & Board & Note>({
  className,
  isFetching,
  isPlaceholderData,
  subject,
  data = [],
  sorting,
  filtering,
  pagination,
}: DataTableProps<Data>) => {
  const [rowSelection, setRowSelection] = useState({})
  const [targetRow, setTargetRow] = useState<Row<Data> | null>(null)

  const {
    value: isDialogOpen,
    setValue: setIsDialogOpen,
    setTrue: openDialog,
    setFalse: closeDialog,
  } = useBoolean()

  const params = useParams({ strict: false })

  const navigate = useNavigate()

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
      cell: ({ row }) => (
        <Link
          className='hover:underline'
          to={
            subject === 'project'
              ? `/${subject}s/${row.id}`
              : `/projects/${params.projectId}/${subject}s/${row.id}`
          }
        >
          {row.getValue('title')}
        </Link>
      ),
    },
    {
      accessorKey: 'description',
      enableSorting: false,
      header: 'Description',
      cell: ({ row }) => row.getValue('description'),
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
            <ArrowUp className='size-4 ml-2' />
          ) : (
            <ArrowDown className='size-4 ml-2' />
          )}
        </Button>
      ),
      cell: ({ row }) => <div>{toDateFormat(row.getValue('createdAt'))}</div>,
    },
    {
      id: 'actions',
      meta: { style: { width: '4rem' } },
      enableHiding: false,
      enableSorting: false,
      cell: ({ row }) => (
        <ActionsDropdown
          items={[
            {
              children: (
                <div className='flex items-center justify-center gap-x-2'>
                  <FileText className='size-4' />
                  Details
                </div>
              ),
              onClick: () =>
                navigate({
                  to:
                    subject === 'project'
                      ? `/${subject}s/${row.id}`
                      : `/projects/${params.projectId}/${subject}s/${row.id}`,
                }),
            },
            {
              children: (
                <div className='flex items-center justify-center gap-x-2'>
                  <Pencil className='size-4' />
                  Edit
                </div>
              ),
              onClick: () =>
                navigate({
                  to:
                    subject === 'project'
                      ? `/${subject}s/${row.id}/edit`
                      : `/projects/${params.projectId}/${subject}s/${row.id}/edit`,
                }),
            },
            {
              children: (
                <div className='flex items-center justify-center gap-x-2 text-destructive'>
                  <Trash className='size-4' />
                  Delete
                </div>
              ),
              onSelect: () => {
                openDialog()
                setTargetRow(row)
              },
            },
          ]}
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

  const queryClient = useQueryClient()

  /**
   * FIXME:
   * Issues when deleting all elements on the last page:
   * - Unnecessary request when auto-navigating to the previous page.
   * - Invalid pending state indicator when using the "Delete selected" button.
   */
  const deleteMutation = useMutation({
    mutationFn: subjectToDeleteMutationFn(subject)(params?.projectId || ''),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey:
          subject === 'project'
            ? [`${subject}s`]
            : ['projects', params?.projectId, `${subject}s`],
      })
      closeDialog()
      if (
        variables.length === table.getFilteredRowModel().rows.length &&
        table.getPageCount() === table.getState().pagination.pageIndex + 1
      )
        table.previousPage()
    },
  })

  const selectedRows = table.getSelectedRowModel().rows

  return (
    <>
      <div className={className}>
        <div className='flex items-center justify-between gap-x-2 gap-y-4 mb-4'>
          <TableSearch table={table} />
          {selectedRows.length > 0 && (
            <Button
              className='gap-x-2 text-destructive'
              variant='ghost'
              disabled={!!queryClient.isFetching({ queryKey: [`${subject}s`] })}
              onClick={openDialog}
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
                    <TableHead
                      key={header.id}
                      {...header.column.columnDef.meta}
                    >
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
                          'max-w-0 truncate',
                          isFetching && !isPlaceholderData && 'opacity-50'
                        )}
                      >
                        {isFetching &&
                        isPlaceholderData &&
                        !cell.id.includes('check') &&
                        !cell.id.includes('actions') ? (
                          <Skeleton className='w-full h-4' />
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
      <DeleteConfirmationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        isPending={deleteMutation.isPending}
        subject={subject}
        rows={
          selectedRows.length > 0 ? selectedRows : targetRow ? [targetRow] : []
        }
        onConfirm={(rows) => deleteMutation.mutate(rows.map((row) => row.id))}
      />
    </>
  )
}

export default DataTable
