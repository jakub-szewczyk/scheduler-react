import ChangesBar from '@/layout/ChangesBar/ChangesBar'
import { updateBoardStatuses } from '@/services/status'
import { Board as IBoard } from '@/types/board'
import { Status } from '@/types/status'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { equals } from 'ramda'
import { Dispatch, SetStateAction } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { useParams } from 'react-router-dom'
import StrictModeDroppable from '../../layout/StrictModeDroppable/StrictModeDroppable'
import * as STATUS from '../../modules/status'
import BoardHeader from './BoardHeader'
import StatusColumn from './StatusColumn'
import { BoardContainer } from './styles/Board.styled'

type Params = {
  projectId: string
  boardId: string
}

interface BoardProps {
  board: IBoard
  statuses: Status[]
  setStatuses: Dispatch<SetStateAction<Status[]>>
}

const Board = ({ board, statuses, setStatuses }: BoardProps) => {
  const params = useParams<Params>()

  const queryClient = useQueryClient()

  const {
    mutate: updateBoardStatusesMutation,
    isLoading: isEachBoardStatusUpdating,
  } = useMutation(updateBoardStatuses, {
    onSuccess: () =>
      queryClient.invalidateQueries(
        ['projects', params.projectId, 'boards', params.boardId],
        { exact: true }
      ),
  })

  const handleDragEnd = ({ source, destination }: DropResult) => {
    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    )
      return
    setStatuses(STATUS.drag({ source, destination }))
  }

  const hasChanges =
    !equals(statuses, board.statuses) || isEachBoardStatusUpdating

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
                  key={status.id}
                  index={index}
                  status={status}
                  statuses={statuses}
                  disabled={hasChanges}
                />
              ))}
              {placeholder}
            </BoardContainer>
          )}
        </StrictModeDroppable>
      </DragDropContext>
      {hasChanges && (
        <ChangesBar
          loading={isEachBoardStatusUpdating}
          onDiscard={() => setStatuses(board.statuses)}
          onSave={() =>
            updateBoardStatusesMutation({
              projectId: params.projectId!,
              boardId: board.id,
              statuses,
            })
          }
        />
      )}
    </>
  )
}

export default Board
