import produce from 'immer'
import { curry, move } from 'ramda'
import { DraggableLocation } from 'react-beautiful-dnd'
import { DropResultLocation, Status } from '../types/board'

const matchByDraggableLocation = curry(
  ({ droppableId }: DraggableLocation, { title }: Status) =>
    title === droppableId
)

const calculateDragState = ({ source, destination }: DropResultLocation) =>
  produce((statuses: Status[]) => {
    if (source.droppableId === 'board' && destination.droppableId === 'board') {
      return move(source.index, destination.index, statuses)
    } else if (source.droppableId === destination.droppableId) {
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
  })

export { calculateDragState }
