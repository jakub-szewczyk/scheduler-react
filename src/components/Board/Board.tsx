import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { useImmerReducer } from 'use-immer'
import { STATUSES } from '../../mocks/board'
import { reducer } from '../../modules/board'
import { Action, Status } from '../../types/board'
import StrictModeDroppable from '../layout/StrictModeDroppable/StrictModeDroppable'
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
      type: 'board/drag',
      payload: {
        source,
        destination,
      },
    })
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <StrictModeDroppable
        droppableId='board'
        type='board'
        direction='horizontal'
      >
        {({ droppableProps, innerRef, placeholder }) => (
          <BoardContainer {...droppableProps} ref={innerRef}>
            {statuses.map((status, index) => (
              <StatusColumn {...status} key={status.title} index={index} />
            ))}
            {placeholder}
          </BoardContainer>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  )
}

export default Board
