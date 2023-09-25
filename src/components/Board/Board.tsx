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
import ChangesBar from '@/layout/ChangesBar/ChangesBar'
import { useReadLocalStorage } from 'usehooks-ts'
import { useAuth } from '@clerk/clerk-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateBoardStatuses } from '@/services/status'

interface BoardProps {
  board: IBoard
  statuses: Status[]
  setStatuses: Dispatch<SetStateAction<Status[]>>
}

const Board = ({ board, statuses, setStatuses }: BoardProps) => {
  const selectedProjectId = useReadLocalStorage<string | null>(
    'selectedProjectId'
  )

  const { getToken } = useAuth()

  const queryClient = useQueryClient()

  const {
    mutate: updateBoardStatusesMutation,
    isLoading: isUpdatingBoardStatuses,
  } = useMutation(updateBoardStatuses, {
    onSuccess: () =>
      queryClient.invalidateQueries(
        ['projects', selectedProjectId, 'boards', board.id],
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
    !equals(statuses, board.statuses) || isUpdatingBoardStatuses

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
          loading={isUpdatingBoardStatuses}
          onDiscard={() => setStatuses(board.statuses)}
          onSave={async () =>
            updateBoardStatusesMutation({
              projectId: selectedProjectId!,
              boardId: board.id,
              statuses,
              token: await getToken(),
            })
          }
        />
      )}
    </>
  )
}

export default Board
