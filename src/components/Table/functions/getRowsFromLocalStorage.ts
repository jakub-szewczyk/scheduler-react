import * as IOOption from 'fp-ts/lib/IOOption'

const getRowsFromLocalStorage = IOOption.fromNullable(
  localStorage.getItem('rows')
)

export default getRowsFromLocalStorage
