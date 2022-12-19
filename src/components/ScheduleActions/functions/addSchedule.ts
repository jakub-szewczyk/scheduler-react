import { flow } from 'fp-ts/lib/function'
import { concat, lensProp, map, set, __ } from 'ramda'
import initialSchedules from '../../Schedule/constants/initialSchedules'
import { Schedule } from '../../Schedule/types/Schedule.types'

const addSchedule: (schedules: Schedule[]) => Schedule[] = flow(
  map(set(lensProp('selected'), false)),
  concat(__, initialSchedules)
)

export default addSchedule
