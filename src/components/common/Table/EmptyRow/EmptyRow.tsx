import { TableCell, TableRow } from '@/components/ui/table'

interface EmptyRowProps {
  columnsLength: number
}

const EmptyRow = ({ columnsLength }: EmptyRowProps) => (
  <TableRow>
    <TableCell className='h-24 text-center' colSpan={columnsLength}>
      No results
    </TableCell>
  </TableRow>
)

export default EmptyRow
