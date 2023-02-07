import { curry, move } from 'ramda'
import {
  DragDropContext,
  DraggableLocation,
  DropResult,
} from 'react-beautiful-dnd'
import { ImmerReducer, useImmerReducer } from 'use-immer'
import { Action, Status } from '../../types/board'
import StatusColumn from './StatusColumn'
import { BoardContainer } from './styles/Board.styled'

const STATUSES = [
  {
    title: 'todo',
    issues: [
      {
        title: 'Lorem ipsum',
        content:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia doloremque fuga aliquid esse non ratione dolorem odit enim, sed quam, iusto dicta vero? Optio et, ipsam veniam earum ratione repellat.',
      },
      {
        title: 'Lorem ipsum 2',
        content:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia doloremque fuga aliquid esse non ratione dolorem odit enim, sed quam, iusto dicta vero? Optio et, ipsam veniam earum ratione repellat.',
      },
    ],
  },
  {
    title: 'inprogress',
    issues: [
      {
        title: 'Lorem ipsum 3',
        content:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia doloremque fuga aliquid esse non ratione dolorem odit enim, sed quam, iusto dicta vero? Optio et, ipsam veniam earum ratione repellat.',
      },
      {
        title: 'Lorem ipsum 4',
        content:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia doloremque fuga aliquid esse non ratione dolorem odit enim, sed quam, iusto dicta vero? Optio et, ipsam veniam earum ratione repellat.',
      },
      {
        title: 'Lorem ipsum 5',
        content:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia doloremque fuga aliquid esse non ratione dolorem odit enim, sed quam, iusto dicta vero? Optio et, ipsam veniam earum ratione repellat.',
      },
      {
        title: 'Lorem ipsum 7',
        content:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia doloremque fuga aliquid esse non ratione dolorem odit enim, sed quam, iusto dicta vero? Optio et, ipsam veniam earum ratione repellat.',
      },
    ],
  },
  {
    title: 'done',
    issues: [
      {
        title: 'Lorem ipsum 6',
        content:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia doloremque fuga aliquid esse non ratione dolorem odit enim, sed quam, iusto dicta vero? Optio et, ipsam veniam earum ratione repellat.',
      },
    ],
  },
]

const statusByLocation = curry(
  ({ droppableId }: DraggableLocation, { title }: Status) =>
    title === droppableId
)

const reducer: ImmerReducer<Status[], Action> = (
  draft,
  { type, payload: { source, destination } }
) => {
  switch (type) {
    case 'issue/reorder':
      const status = draft.find(statusByLocation(source))!
      status.issues = move(source.index, destination.index, status.issues)
      break
    case 'issue/move':
      const sourceStatus = draft.find(statusByLocation(source))!
      const destinationStatus = draft.find(statusByLocation(destination))!
      const [sourceIssue] = sourceStatus.issues.splice(source.index, 1)
      destinationStatus.issues.splice(destination.index, 0, sourceIssue)
      break
  }
}

const Board = () => {
  const [statuses, dispatch] = useImmerReducer<Status[], Action>(
    reducer,
    STATUSES
  )

  const handleDragEnd = ({ source, destination }: DropResult) => {
    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    )
      return

    if (source.droppableId === destination.droppableId) {
      dispatch({
        type: 'issue/reorder',
        payload: {
          source,
          destination,
        },
      })
    } else {
      dispatch({
        type: 'issue/move',
        payload: {
          source,
          destination,
        },
      })
    }
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <BoardContainer>
        {statuses.map((status) => (
          <StatusColumn key={status.title} {...status} />
        ))}
      </BoardContainer>
    </DragDropContext>
  )
}

export default Board
