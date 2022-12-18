import { flow } from 'fp-ts/lib/function'
import { equals, prop } from 'ramda'
import { Schedule } from '../../Schedule/types/Schedule.types'

type T = (schedule: Schedule) => boolean

const isUnsavedSchedule: T = flow(prop('name'), equals('unsaved'))

export default isUnsavedSchedule
