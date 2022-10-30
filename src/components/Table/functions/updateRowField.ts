import { GridRowId } from '@mui/x-data-grid'
import { update } from 'ramda'
import { Row } from '../Table.types'
import findRowIndexById from './findRowIndexById'

/**
 * Updates `row[field]` with `value`
 *
 * @param id
 * @param rows
 * @param field
 * @param value
 * @returns updated `rows` array
 */
const updateRowField = (
  id: GridRowId,
  rows: Row[],
  field: string,
  value: any
) => {
  const index = findRowIndexById(id, rows)
  return update(index, { ...rows[index], [field]: value }, rows)
}

export default updateRowField
