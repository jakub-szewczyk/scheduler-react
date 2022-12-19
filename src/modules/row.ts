import { GridRowId } from '@mui/x-data-grid'
import { prop } from 'fp-ts-ramda'
import { flow, pipe } from 'fp-ts/lib/function'
import { nanoid } from 'nanoid'
import {
  add as _add,
  count,
  curry,
  equals,
  find,
  findIndex,
  includes,
  insert,
  map,
  remove as _remove,
  update as _update,
} from 'ramda'
import { Day, Row } from '../components/Schedule/types/Schedule.types'

type T = (x: Row[]) => (string | readonly string[])[]

const equalsId = (id: GridRowId) => flow(prop('id'), equals(id))

const findById = (id: GridRowId, rows: Row[]): Row | undefined =>
  pipe(rows, find(equalsId(id)))

const findIndexById = curry((id: GridRowId, rows: Row[]) =>
  pipe(rows, findIndex(equalsId(id)))
)

const countPerDays = (day: Day, rows: Row[]) =>
  pipe(rows, map(prop('id')) as T, count(includes(day)))

const calculateNewIndex = (id: GridRowId, rows: Row[]) =>
  pipe(rows, findIndexById(id), _add(countPerDays(id as Day, rows)))

const add = (id: GridRowId, rows: Row[]) =>
  insert(calculateNewIndex(id, rows), { id: `${id}${nanoid()}` }, rows)

const remove = (id: GridRowId, rows: Row[]) =>
  _remove(findIndexById(id, rows), 1, rows)

const update = <T>(field: string, value: T, id: GridRowId, rows: Row[]) => {
  const index = findIndexById(id, rows)
  return _update(index, { ...rows[index], [field]: value }, rows)
}

export {
  equalsId,
  findById,
  findIndexById,
  countPerDays,
  calculateNewIndex,
  add,
  remove,
  update,
}
