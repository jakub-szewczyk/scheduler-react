export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'

interface Notification {
  time: string
  active: boolean
  // title: string
}

export interface Row {
  id: string
  rowId?: string | null
  day?: Day
  starts?: string | null
  ends?: string | null
  room?: string | null
  subject?: string | null
  notification?: Notification | null
}
