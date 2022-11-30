import { format } from 'date-fns'
import { flow } from 'fp-ts/lib/function'
import { map } from 'fp-ts/lib/Option'
import { equals } from 'ramda'
import timeFormat from '../constants/timeFormat'
import toTimeFormat from './toTimeFormat'

/**
 * NOTE:
 * Learn more about monad composition in order to
 * reuse `toTimeFormat` for the right side of the equation.
 */
const matchesHour = flow(
  toTimeFormat,
  map(equals(format(Date.now(), timeFormat)))
)

export default matchesHour
