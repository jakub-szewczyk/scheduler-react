import { GridColDef } from '@mui/x-data-grid'
import { pipe } from 'fp-ts/lib/function'
import { add, map, prop, reduce, Reduced } from 'ramda'

type T = (a: number, b: unknown) => number | Reduced<number>

const calculateTableMaxWidth = (columns: GridColDef[]) =>
  pipe(columns, map(prop('width')), reduce(add as T, 0), add(10))

export default calculateTableMaxWidth
