import { DraggableLocation } from 'react-beautiful-dnd'
import { Status } from './status'

export interface Board {
  name: string
  project: string
  selected: boolean
  createdAt: string
  statuses: Status[]
}

export type BoardsEndomorphism = (boards: Board[]) => Board[]

export type DropResultLocation = {
  source: DraggableLocation
  destination: DraggableLocation
}
