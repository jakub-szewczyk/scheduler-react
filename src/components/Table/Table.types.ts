import { GridRowId } from '@mui/x-data-grid'

interface Row {
  id: GridRowId
  day?: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'
  subject?: string
}

export type { Row }
