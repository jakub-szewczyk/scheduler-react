import produce from 'immer'
import { curry, move } from 'ramda'
import { DraggableLocation } from 'react-beautiful-dnd'
import { DropResultLocation, Status } from '../types/board'

const INITIAL_VALUES: Status[] = [
  {
    title: 'todo',
    issues: [
      {
        title: 'Adjust column titles',
        content:
          'To rename a status, simply click on the three dots icon next to the status title. This will open the configuration menu, where you can find the option to rename it.',
      },
      {
        title: 'Create your own issues',
        content:
          'Click on the floating action button in the bottom-right corner of the screen to add more issues',
      },
      {
        title: 'Get familiar with the kanban board',
        content:
          'Get to know the kanban board. Customize statuses and issues to fit your needs.',
      },
    ],
  },
  {
    title: 'inprogress',
    issues: [],
  },
  {
    title: 'review',
    issues: [],
  },
  {
    title: 'done',
    issues: [],
  },
]

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

export { INITIAL_VALUES, calculateDragState }
