import { Row } from '../Table.types'

/**
 * TODO:
 * Impure function
 */
const getRowsFromLocalStorage = () => {
  const rows = localStorage.getItem('rows')
  return rows ? (JSON.parse(rows) as Row[]) : null
}

export default getRowsFromLocalStorage
