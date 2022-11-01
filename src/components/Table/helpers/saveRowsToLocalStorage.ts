import { Row } from '../Table.types'

/**
 * TODO:
 * Impure function.
 * Lift to IO monad.
 */
const saveRowsToLocalStorage = (rows: Row[]) =>
  localStorage.setItem('rows', JSON.stringify(rows))

export default saveRowsToLocalStorage
