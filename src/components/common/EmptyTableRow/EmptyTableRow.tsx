import { TableCell, TableRow } from '@/components/ui/table'

interface EmptyTableRowProps {
  columnsLength: number
}

const EmptyTableRow = ({ columnsLength }: EmptyTableRowProps) => (
  <TableRow>
    <TableCell className='h-24 text-center' colSpan={columnsLength}>
      No results
    </TableCell>
  </TableRow>
)

export default EmptyTableRow
