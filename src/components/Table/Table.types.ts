import { GridRowId } from '@mui/x-data-grid'

type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'

interface Row {
  id: GridRowId
  day?: Day
  subject?: string
}

export type { Day, Row }
