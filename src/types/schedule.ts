import { Row } from './row'

export type SchedulesEndomorphism = (schedules: Schedule[]) => Schedule[]

export interface Schedule {
  name: string
  project: string
  selected: boolean
  createdAt: string
  rows: Row[]
}
