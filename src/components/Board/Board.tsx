import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { useImmerReducer } from 'use-immer'
import { STATUSES } from '../../mocks/board'
import { reducer } from '../../modules/board'
import { Action, Status } from '../../types/board'
import StatusColumn from './StatusColumn'
import { BoardContainer } from './styles/Board.styled'

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

    dispatch({
      type: 'issue/drag',
      payload: {
        source,
        destination,
      },
    })
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
