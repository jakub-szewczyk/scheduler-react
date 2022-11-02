import { GridRowId } from '@mui/x-data-grid'
import { pipe } from 'fp-ts/lib/function'
import { curry, findIndex } from 'ramda'
import { Row } from '../types/Table.types'
import equalsToRowId from './equalsToRowId'

/**
 * Find row index by `id` in the `rows` array
 *
 * @params id
 * @params rows
 * @returns index
 */
const findRowIndexById = curry((id: GridRowId, rows: Row[]) =>
  pipe(rows, findIndex(equalsToRowId(id)))
)

export default findRowIndexById
