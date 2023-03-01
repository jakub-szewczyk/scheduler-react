import { Dispatch, SetStateAction } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import * as BOARD from '../../modules/board'
import { Status } from '../../types/board'
import StrictModeDroppable from '../layout/StrictModeDroppable/StrictModeDroppable'
import StatusColumn from './StatusColumn'
import { BoardContainer } from './styles/Board.styled'

interface BoardProps {
  statuses: Status[]
  setStatuses: Dispatch<SetStateAction<Status[]>>
}

const Board = ({ statuses, setStatuses }: BoardProps) => {
  const handleDragEnd = ({ source, destination }: DropResult) => {
    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    )
      return

    setStatuses(BOARD.drag({ source, destination }))
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
