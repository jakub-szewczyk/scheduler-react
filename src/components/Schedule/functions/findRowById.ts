import { GridRowId } from '@mui/x-data-grid'
import { pipe } from 'fp-ts/lib/function'
import { find } from 'ramda'
import { Row } from '../types/Schedule.types'
import equalsToRowId from './equalsToRowId'

const findRowById = (id: GridRowId, rows: Row[]): Row | undefined =>
  pipe(rows, find(equalsToRowId(id)))

export default findRowById
