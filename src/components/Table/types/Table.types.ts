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
  notification?: {
    active: boolean
    time: string | null
    title: string
  }
}>

interface NotificationConfiguration {
  notification: 0 | 5 | 10 | 15 | 'custom'
  time: string | null
  title: string
}

export type { Time, Day, Row, NotificationConfiguration }
