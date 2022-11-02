import { pipe } from 'fp-ts/lib/function'
import * as IOOption from 'fp-ts/lib/IOOption'

const getRowsFromLocalStorage = pipe(
  IOOption.fromNullable(localStorage.getItem('rows')),
  IOOption.map(JSON.parse)
)

export default getRowsFromLocalStorage
