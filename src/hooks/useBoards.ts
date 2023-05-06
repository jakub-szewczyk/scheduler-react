import { Project } from '@/types/project'
import produce from 'immer'
import { Dispatch, SetStateAction } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import * as BOARD from '../modules/board'
import { Board, Status } from '../types/board'
import useProjects from './useProjects'

// TODO: Move to board module
const statusesSetter = (statuses: Status[], project: Project) =>
  produce((boards: Board[]) => {
    boards.forEach((board) => {
      if (board.project === project.name && board.selected)
        board.statuses = statuses
    })
  })

const useBoards = () => {
  const { project } = useProjects()

  const [boards, setBoards] = useLocalStorage(
    'boards',
    BOARD.INITIAL_VALUES.map((board) => ({ ...board, name: project.name })) // TODO: Check if map is necessary
  )

  const workingBoard = boards.find(
    (board) => board.project === project.name && board.selected
  )!

  const workingBoards = boards.filter((board) => board.project === project.name)

  const setStatuses: Dispatch<SetStateAction<Status[]>> = (statuses) =>
    setBoards(
      // map(
      //   when(
      //     prop('selected'),
      //     set(
      //       lensProp('statuses'),
      //       typeof statuses === 'function' ? statuses(board.statuses) : statuses
      //     )
      //   )
      // )
      statusesSetter(
        typeof statuses === 'function'
          ? statuses(workingBoard.statuses)
          : statuses,
        project
      )
    )

  return { board: workingBoard, boards: workingBoards, setBoards, setStatuses }
}

export default useBoards
