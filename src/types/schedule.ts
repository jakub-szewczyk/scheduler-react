import { Row } from './row'

export interface Schedule {
  id: string
  createdAt: string
  name: string
  rows: Row[]
}

export type InitialValues = { name: string }
