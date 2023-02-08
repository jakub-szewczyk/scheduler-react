import { DraggableLocation } from 'react-beautiful-dnd'

interface Status {
  title: string
  issues: Issue[]
}

interface Issue {
  title: string
  content: string
}

type Payload = {
  source: DraggableLocation
  destination: DraggableLocation
}

interface IssueDragAction {
  type: 'issue/drag'
  payload: Payload
}

type Action = IssueDragAction

export type { Status, Issue, Action }
