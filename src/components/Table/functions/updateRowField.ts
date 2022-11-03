import { GridRowId } from '@mui/x-data-grid'
import { update } from 'ramda'
import { Row } from '../types/Table.types'
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
const updateRowField = (
  field: string,
  value: any,
  id: GridRowId,
  rows: Row[]
) => {
  const index = findRowIndexById(id, rows)
  return update(index, { ...rows[index], [field]: value }, rows)
}

export default updateRowField
