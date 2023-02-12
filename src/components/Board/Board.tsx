import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { useLocalStorage } from 'usehooks-ts'
import * as BOARD from '../../modules/board'
import StrictModeDroppable from '../layout/StrictModeDroppable/StrictModeDroppable'
import StatusColumn from './StatusColumn'
import { BoardContainer } from './styles/Board.styled'

const Board = () => {
  const [statuses, setStatuses] = useLocalStorage(
    'statuses',
    BOARD.INITIAL_VALUES
  )

  const handleDragEnd = ({ source, destination }: DropResult) => {
    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    )
      return

    setStatuses(BOARD.calculateDragState({ source, destination }))
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
              <StatusColumn
                key={status.title}
                index={index}
                status={status}
                statuses={statuses}
                setStatuses={setStatuses}
              />
            ))}
            {placeholder}
          </BoardContainer>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  )
}

export default Board
