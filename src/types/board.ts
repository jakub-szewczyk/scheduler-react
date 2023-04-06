import { DraggableLocation } from 'react-beautiful-dnd'
import { Status } from './status'

interface Board {
  name: string
  selected: boolean
  createdAt: string
  statuses: Status[]
}

type DropResultLocation = {
  source: DraggableLocation
  destination: DraggableLocation
}

export type { Board, Status, DropResultLocation }
