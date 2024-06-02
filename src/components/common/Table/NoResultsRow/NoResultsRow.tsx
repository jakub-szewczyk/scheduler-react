import { TableCell, TableRow } from '@/components/ui/table'

interface NoResultsRowProps {
  columnsLength: number
}

const NoResultsRow = ({ columnsLength }: NoResultsRowProps) => (
  <TableRow>
    <TableCell className='h-24 text-center' colSpan={columnsLength}>
      No results
    </TableCell>
  </TableRow>
)

export default NoResultsRow
