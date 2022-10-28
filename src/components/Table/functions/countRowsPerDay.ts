import { prop } from 'fp-ts-ramda'
import { pipe } from 'fp-ts/lib/function'
import { count, includes, map } from 'ramda'
import { Day, Row } from '../Table.types'

/**
 * Counts day sub rows.
 * Returns the number of rows belonging to a given day.
 *
 * @param day
 * @param rows
 * @returns number of rows per day
 */
const countRowsPerDay = (day: Day, rows: Row[]) =>
  pipe(
    rows,
    map(prop('id')) as (x: Row[]) => (string | readonly string[])[],
    count(includes(day))
  )

export default countRowsPerDay
