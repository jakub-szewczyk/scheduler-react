import { GridRowId } from '@mui/x-data-grid'
import { remove } from 'ramda'
import { Row } from '../Table.types'
import findRowIndexById from './findRowIndexById'

/**
 * Removes row from the existing `rows` array and returns it
 *
 * @param id
 * @param rows
 * @returns updated `rows` array
 */
const removeRow = (id: GridRowId, rows: Row[]) =>
  remove(findRowIndexById(id, rows), 1, rows)

export default removeRow
