import { GridRowId } from '@mui/x-data-grid'
import { Day } from './time'

interface Row {
  id: GridRowId
  day?: Day
  starts?: string | null
  ends?: string | null
  room?: string
  subject?: string
  notification?: {
    active: boolean
    time: string | null
    title: string
  }
}

export type { Row }
