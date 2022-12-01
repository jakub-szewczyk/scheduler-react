import { GridRowId } from '@mui/x-data-grid'

type Time = string | number | undefined

type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'

type Row = Readonly<{
  id: GridRowId
  day?: Day
  starts?: string
  ends?: string
  room?: string
  subject?: string
  notification?: boolean
}>

export type { Time, Day, Row }
