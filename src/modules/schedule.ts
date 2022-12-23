import { prop } from 'fp-ts-ramda'
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
  set,
  slice,
  unless,
  when,
  __,
} from 'ramda'
import { utils, writeFileXLSX } from 'xlsx'
import * as ROW from '../modules/row'
import { Schedule } from '../types/schedule'

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

const select = (name: string): SchedulesEndomorphism =>
  map(
    flow(
      set(lensProp('selected'), false),
      when(flow(prop('name'), equals(name)), set(lensProp('selected'), true))
    )
  )

const isUnsaved: (schedule: Schedule) => boolean = flow(
  prop('name'),
  equals('unsaved')
)

const asteriskSuffix = when(equals('unsaved'), concat(__, '*'))

const findSelected = find<Schedule>(prop('selected'))

const exportToXLSX = (schedule: Schedule) => () => {
  const ws = utils.json_to_sheet(pipe(schedule.rows, map(ROW.toXLSX)))
  const wb = utils.book_new()
  utils.book_append_sheet(wb, ws, 'Data')
  writeFileXLSX(wb, `${schedule.name}.xlsx`)
}

export {
  INITIAL_VALUES,
  add,
  remove,
  save,
  select,
  isUnsaved,
  asteriskSuffix,
  findSelected,
  exportToXLSX,
}
