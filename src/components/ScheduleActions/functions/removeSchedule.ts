import { flow, pipe } from 'fp-ts/lib/function'
import {
  any,
  complement,
  concat,
  equals,
  filter,
  last,
  lensProp,
  prop,
  set,
  slice,
  unless,
  __,
} from 'ramda'
import { Schedule } from '../../Schedule/types/Schedule.types'

type T = (x: any[]) => any[]

const removeSchedule = (
  name: string
): ((schedules: Schedule[]) => Schedule[]) =>
  flow(
    filter(flow(prop('name'), complement(equals(name)))),
    unless(any(prop('selected')), (schedules: any[]) =>
      pipe(
        schedules,
        slice(0, -1) as T,
        concat(__, [set(lensProp('selected'), true, last(schedules))])
      )
    )
  )

export default removeSchedule
