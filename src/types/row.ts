import { Notification } from './notification'

export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'

export interface Row {
  id: string
  rowId?: string | null
  index: number
  day?: Day
  starts?: string | null
  ends?: string | null
  room?: string | null
  subject?: string | null
  notification?: Notification | null
}
