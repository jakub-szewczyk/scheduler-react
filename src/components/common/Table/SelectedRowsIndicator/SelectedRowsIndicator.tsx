import { Table } from '@tanstack/react-table'

interface SelectedRowsIndicatorProps<Data> {
  table: Table<Data>
}

const SelectedRowsIndicator = <Data,>({
  table,
}: SelectedRowsIndicatorProps<Data>) => (
  <div className='hidden text-sm text-muted-foreground md:block'>
    {table.getFilteredSelectedRowModel().rows.length} of{' '}
    {table.getFilteredRowModel().rows.length} row(s) selected
  </div>
)

export default SelectedRowsIndicator
