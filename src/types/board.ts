import { DraggableLocation } from 'react-beautiful-dnd'
import { Status } from './status'

export interface Board {
  id: string
  createdAt: string
  name: string
  statuses: Status[]
}

export type InitialValues = { name: string }

export type DropResultLocation = {
  source: DraggableLocation
  destination: DraggableLocation
}
