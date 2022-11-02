import { Row } from '../types/Table.types'

const saveRowsToLocalStorage = (rows: Row[]) =>
  localStorage.setItem('rows', JSON.stringify(rows))

export default saveRowsToLocalStorage
