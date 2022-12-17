import footerHeight from '../constants/footerHeight'
import headerHeight from '../constants/headerHeight'
import rowHeight from '../constants/rowHeight'
import { Row } from '../types/Table.types'

const calculateTableHeight = (rows: Row[]) =>
  headerHeight + rowHeight * rows.length + footerHeight + 2

export default calculateTableHeight
