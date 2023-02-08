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

interface BoardDragAction {
  type: 'board/drag'
  payload: Payload
}

type Action = BoardDragAction

export type { Status, Issue, Action }
