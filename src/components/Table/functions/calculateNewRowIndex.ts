import { GridRowId } from '@mui/x-data-grid'
import { pipe } from 'fp-ts/lib/function'
import { add } from 'ramda'
import { Day, Row } from '../types/Table.types'
import countRowsPerDay from './countRowsPerDay'
import findRowIndexById from './findRowIndexById'

/**
 * Calculates and returns the position (index) for appending a new row.
 *
 * @param id
 * @param rows
 * @returns index
 */
const calculateNewRowIndex = (id: GridRowId, rows: Row[]) =>
  pipe(rows, findRowIndexById(id), add(countRowsPerDay(id as Day, rows)))

export default calculateNewRowIndex
