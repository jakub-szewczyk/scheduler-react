import { GridColDef } from '@mui/x-data-grid'
import { pipe } from 'fp-ts/lib/function'
import { add, map, prop, reduce, Reduced } from 'ramda'
import { Row } from '../types/row'

type T = (a: number, b: unknown) => number | Reduced<number>

export const HEADER_HEIGHT = 60

export const ROW_HEIGHT = 60

export const FOOTER_HEIGHT = 60

export const calculateHeight = (rows: Row[]) =>
  HEADER_HEIGHT + ROW_HEIGHT * rows.length + FOOTER_HEIGHT + 2

export const calculateMaxWidth = (columns: GridColDef[]) =>
  pipe(columns, map(prop('width')), reduce(add as T, 0))
