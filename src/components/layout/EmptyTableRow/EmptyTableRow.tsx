import { TableCell, TableRow } from '@/components/ui/table'
import { ColumnDef } from '@tanstack/react-table'

interface EmptyTableRowProps<Data> {
  columns: ColumnDef<Data>[]
}

const EmptyTableRow = <Data,>({ columns }: EmptyTableRowProps<Data>) => (
  <TableRow>
    <TableCell className='h-24 text-center' colSpan={columns.length}>
      No results
    </TableCell>
  </TableRow>
)

export default EmptyTableRow
