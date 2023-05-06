import { GridRowId } from '@mui/x-data-grid'
import { prop } from 'fp-ts-ramda'
import { constant, flow, pipe } from 'fp-ts/lib/function'
import * as Option from 'fp-ts/Option'
import { nanoid } from 'nanoid'
import {
  add as _add,
  count,
  curry,
  equals,
  findIndex,
  includes,
  insert,
  map,
  remove as _remove,
  update as _update,
} from 'ramda'
import { Row } from '../types/row'
import { Day } from '../types/time'
import * as TIME from './time'

type T = (x: Row[]) => (string | readonly string[])[]

const equalsId = (id: GridRowId) => flow(prop('id'), equals(id))

const findIndexById = curry((id: GridRowId, rows: Row[]) =>
  pipe(rows, findIndex(equalsId(id)))
)

const countPerDays = (day: Day, rows: Row[]) =>
  pipe(rows, map(prop('id')) as T, count(includes(day)))

const calculateNewIndex = (id: GridRowId, rows: Row[]) =>
  pipe(rows, findIndexById(id), _add(countPerDays(id as Day, rows)))

export const add = (id: GridRowId, rows: Row[]) =>
  insert(calculateNewIndex(id, rows), { id: `${id}${nanoid()}` }, rows)

export const remove = (id: GridRowId, rows: Row[]) =>
  _remove(findIndexById(id, rows), 1, rows)

export const update = curry(
  <T>(field: string, value: T, id: GridRowId, rows: Row[]) => {
    const index = findIndexById(id, rows)
    return _update(index, { ...rows[index], [field]: value }, rows)
  }
)

export const toXLSX = ({ day, starts, ends, room, subject }: Row) => ({
  Day: day,
  Starts: pipe(TIME.format(starts), Option.getOrElse(constant(''))),
  Ends: pipe(TIME.format(ends), Option.getOrElse(constant(''))),
  Room: room,
  Subject: subject,
})
