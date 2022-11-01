import { constant, pipe } from 'fp-ts/lib/function'
import * as IOOption from 'fp-ts/lib/IOOption'
import initialRows from '../constants/initialRows'
import getRowsFromLocalStorage from './getRowsFromLocalStorage'

const getInitialRows = pipe(
  getRowsFromLocalStorage,
  IOOption.map(JSON.parse),
  IOOption.getOrElse(constant(constant(initialRows)))
)

export default getInitialRows
