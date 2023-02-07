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

interface IssueReorderAction {
  type: 'issue/reorder'
  payload: Payload
}

interface IssueMoveAction {
  type: 'issue/move'
  payload: Payload
}

type Action = IssueReorderAction | IssueMoveAction

export type { Status, Issue, Action }
