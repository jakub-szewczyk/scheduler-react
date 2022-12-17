import { GridRowId } from '@mui/x-data-grid'
import { nanoid } from 'nanoid'
import { insert } from 'ramda'
import { Row } from '../types/Schedule.types'
import calculateNewRowIndex from './calculateNewRowIndex'

/**
 * Appends a new row to the existing `rows` array and returns it
 *
 * @param id
 * @param rows
 * @returns updated `rows` array
 */
const addRow = (id: GridRowId, rows: Row[]) =>
  insert(calculateNewRowIndex(id, rows), { id: `${id}${nanoid()}` }, rows)

export default addRow
