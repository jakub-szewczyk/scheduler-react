import { GridRowId } from '@mui/x-data-grid'
import { update } from 'ramda'
import { Row } from '../Table.types'
import findRowIndexById from './findRowIndexById'

/**
 * Updates value of `row.subject`
 *
 * @param id
 * @param rows
 * @param subject
 * @returns updated `rows` array
 */
const updateSubject = (id: GridRowId, rows: Row[], subject: any) =>
  update(
    findRowIndexById(id, rows),
    { ...rows[findRowIndexById(id, rows)], subject },
    rows
  )

export default updateSubject
