import { GridRowId } from '@mui/x-data-grid'
import { update } from 'ramda'
import { Row } from '../types/Schedule.types'
import findRowIndexById from './findRowIndexById'

/**
 * Updates `row[field]` with `value`
 *
 * @param field
 * @param value
 * @param id
 * @param rows
 * @returns updated `rows` array
 */
const updateRowField = <T>(
  field: string,
  value: T,
  id: GridRowId,
  rows: Row[]
) => {
  const index = findRowIndexById(id, rows)
  return update(index, { ...rows[index], [field]: value }, rows)
}

export default updateRowField
