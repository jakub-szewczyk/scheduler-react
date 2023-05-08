import { Row } from './row'

export interface Schedule {
  name: string
  project: string
  selected: boolean
  createdAt: string
  rows: Row[]
}

export type SchedulesEndomorphism = (schedules: Schedule[]) => Schedule[]
