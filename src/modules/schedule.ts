import { flow, pipe } from 'fp-ts/lib/function'
import {
  any,
  complement,
  concat,
  equals,
  filter,
  find,
  last,
  lensProp,
  map,
  prop,
  set,
  slice,
  unless,
  when,
  __,
} from 'ramda'
import { Schedule } from '../components/Schedule/types/Schedule.types'

type SchedulesEndomorphism = (schedules: Schedule[]) => Schedule[]

const INITIAL_VALUES: Schedule[] = [
  {
    name: 'unsaved',
    selected: true,
    createdAt: new Date().toISOString(),
    rows: [
      { id: 'Monday', day: 'Monday' },
      { id: 'Tuesday', day: 'Tuesday' },
      { id: 'Wednesday', day: 'Wednesday' },
      { id: 'Thursday', day: 'Thursday' },
      { id: 'Friday', day: 'Friday' },
    ],
  },
]

const add: SchedulesEndomorphism = flow(
  map(set(lensProp('selected'), false)),
  concat(__, INITIAL_VALUES)
)

const remove = (name: string): SchedulesEndomorphism =>
  flow(
    filter(flow(prop('name'), complement(equals(name)))),
    unless(any(prop('selected')), (schedules: any[]) =>
      pipe(
        schedules,
        slice(0, -1) as (x: any[]) => any[],
        concat(__, [set(lensProp('selected'), true, last(schedules))])
      )
    )
  )

const save = (name: string): SchedulesEndomorphism =>
  map(when(prop('selected'), set(lensProp('name'), name)))

const isUnsaved: (schedule: Schedule) => boolean = flow(
  prop('name'),
  equals('unsaved')
)

const asteriskSuffix = when(equals('unsaved'), concat(__, '*'))

const findSelected = find<Schedule>(prop('selected'))

export {
  INITIAL_VALUES,
  add,
  remove,
  save,
  isUnsaved,
  asteriskSuffix,
  findSelected,
}
