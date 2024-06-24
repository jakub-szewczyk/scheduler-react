import { TableCell, TableRow } from '@/components/ui/table'
import { ReactNode } from 'react'

interface NoResultsRowProps {
  columnsLength: number
  children?: ReactNode
}

const NoResultsRow = ({
  children = 'No results',
  columnsLength,
}: NoResultsRowProps) => (
  <TableRow>
    <TableCell className='h-24 text-center' colSpan={columnsLength}>
      {children}
    </TableCell>
  </TableRow>
)

export default NoResultsRow
