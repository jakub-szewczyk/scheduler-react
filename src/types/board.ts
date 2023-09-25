import { DraggableLocation } from 'react-beautiful-dnd'
import { Status } from './status'
import { initialValues } from '@/modules/board'

export interface Board {
  id: string
  createdAt: string
  name: string
  statuses: Status[]
}

export type InitialValues = ReturnType<typeof initialValues>

export type DropResultLocation = {
  source: DraggableLocation
  destination: DraggableLocation
}
