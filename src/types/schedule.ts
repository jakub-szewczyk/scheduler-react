import { Row } from './row'

interface Schedule {
  name: string
  selected: boolean
  createdAt: string
  rows: Row[]
}

export type { Schedule }
