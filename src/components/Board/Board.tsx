import { Status } from '@/types/status'
import { Dispatch, SetStateAction } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import StrictModeDroppable from '../../layout/StrictModeDroppable/StrictModeDroppable'
import * as STATUS from '../../modules/status'
import BoardHeader from './BoardHeader'
import StatusColumn from './StatusColumn'
import { BoardContainer } from './styles/Board.styled'
import { equals } from 'ramda'
import { Board as IBoard } from '@/types/board'
import DataChangeBar from '@/layout/DataChangeBar/DataChangeBar'

interface BoardProps {
  board: IBoard
  statuses: Status[]
  setStatuses: Dispatch<SetStateAction<Status[]>>
}

const Board = ({ board, statuses, setStatuses }: BoardProps) => {
  const handleDragEnd = ({ source, destination }: DropResult) => {
    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    )
      return
    setStatuses(STATUS.drag({ source, destination }))
  }

  return (
    <>
      <BoardHeader board={board} />
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
      {!equals(statuses, board.statuses) && (
        <DataChangeBar
          // loading={isUpdatingBoardStatuses}
          onDiscard={() => setStatuses(board.statuses)}
          onSave={
            () => console.log(statuses)
            // async () =>
            // updateBoardStatusesMutation({
            //   projectId: selectedProjectId!,
            //   boardId: board.id,
            //   statuses,
            //   token: await getToken(),
            // })
          }
        />
      )}
    </>
  )
}

export default Board
