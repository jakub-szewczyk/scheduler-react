import { GridRowId } from '@mui/x-data-grid'

type Time = number | string | null | undefined

type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'

type Row = Readonly<{
  id: GridRowId
  day?: Day
  starts?: string | null
  ends?: string | null
  room?: string
  subject?: string
  notification?: boolean
}>

export type { Time, Day, Row }
