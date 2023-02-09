import { DraggableLocation } from 'react-beautiful-dnd'

interface Status {
  title: string
  issues: Issue[]
}

interface Issue {
  title: string
  content: string
}

type DropResultLocation = {
  source: DraggableLocation
  destination: DraggableLocation
}

export type { Status, Issue, DropResultLocation }
