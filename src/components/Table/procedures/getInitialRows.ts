import { constant, Lazy, pipe } from 'fp-ts/lib/function'
import { IO } from 'fp-ts/lib/IO'
import * as IOOption from 'fp-ts/lib/IOOption'
import { thunkify } from 'ramda'
import initialRows from '../constants/initialRows'
import { Row } from '../types/Table.types'
import getRowsFromLocalStorage from './getRowsFromLocalStorage'

const getInitialRows = pipe(
  getRowsFromLocalStorage,
  IOOption.getOrElse(thunkify(constant(initialRows)) as Lazy<IO<Row[]>>)
)

export default getInitialRows
