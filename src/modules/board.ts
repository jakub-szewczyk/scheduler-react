import { curry, move } from 'ramda'
import { DraggableLocation } from 'react-beautiful-dnd'
import { ImmerReducer } from 'use-immer'
import { Action, Status } from '../types/board'

const matchByDraggableLocation = curry(
  ({ droppableId }: DraggableLocation, { title }: Status) =>
    title === droppableId
)

const reducer: ImmerReducer<Status[], Action> = (
  statuses,
  { type, payload: { source, destination } }
) => {
  switch (type) {
    case 'issue/drag':
      if (source.droppableId === destination.droppableId) {
        const status = statuses.find(matchByDraggableLocation(source))!
        status.issues = move(source.index, destination.index, status.issues)
      } else {
        const sourceStatus = statuses.find(matchByDraggableLocation(source))!
        const destinationStatus = statuses.find(
          matchByDraggableLocation(destination)
        )!
        const [sourceIssue] = sourceStatus.issues.splice(source.index, 1)
        destinationStatus.issues.splice(destination.index, 0, sourceIssue)
      }
      break
  }
}

export { reducer }
