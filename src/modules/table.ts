import { GridColDef } from '@mui/x-data-grid'
import { pipe } from 'fp-ts/lib/function'
import { add, map, prop, reduce, Reduced } from 'ramda'
import { Row } from '../components/Schedule/types/Schedule.types'

type T = (a: number, b: unknown) => number | Reduced<number>

const HEADER_HEIGHT = 60

const ROW_HEIGHT = 60

const FOOTER_HEIGHT = 60

const calculateHeight = (rows: Row[]) =>
  HEADER_HEIGHT + ROW_HEIGHT * rows.length + FOOTER_HEIGHT + 2

const calculateMaxWidth = (columns: GridColDef[]) =>
  pipe(columns, map(prop('width')), reduce(add as T, 0), add(10))

export {
  HEADER_HEIGHT,
  ROW_HEIGHT,
  FOOTER_HEIGHT,
  calculateHeight,
  calculateMaxWidth,
}
