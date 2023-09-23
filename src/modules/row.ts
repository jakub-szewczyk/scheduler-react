import { GridRowId } from '@mui/x-data-grid'
import { prop } from 'fp-ts-ramda'
import * as Option from 'fp-ts/Option'
import { constant, flow, pipe } from 'fp-ts/lib/function'
import { update as _update, curry, equals, findIndex } from 'ramda'
import { Row } from '../types/row'
import * as TIME from './time'

const equalsId = (id: GridRowId) => flow(prop('id'), equals(id))

const findIndexById = curry((id: GridRowId, rows: Row[]) =>
  pipe(rows, findIndex(equalsId(id)))
)

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
