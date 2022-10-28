import { GridRowId } from '@mui/x-data-grid'
import { prop } from 'fp-ts-ramda'
import { flow } from 'fp-ts/lib/function'
import { equals } from 'ramda'

/**
 * Checks if `row.id` === `id`
 * @param id
 * @returns predicate
 */
const equalsToRowId = (id: GridRowId) => flow(prop('id'), equals(id))

export default equalsToRowId
