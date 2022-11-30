import { constant, pipe } from 'fp-ts/lib/function'
import { getOrElse } from 'fp-ts/lib/Option'
import { Row } from '../types/Table.types'
import matchesHour from './matchesHour'

/**
 * NOTE:
 * There is probably a better way to write this function with fp-ts.
 */
const shouldNotificationTrigger = (
  starts: Row['starts'],
  notification: Row['notification']
) => notification && pipe(matchesHour(starts), getOrElse(constant(false)))

export default shouldNotificationTrigger
