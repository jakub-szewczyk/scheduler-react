import { Dispatch, SetStateAction } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import * as BOARD from '../modules/board'
import { Status } from '../types/board'
import useProjects from './useProjects'

const useBoards = () => {
  const { project } = useProjects()

  const [boards, setBoards] = useLocalStorage('boards', BOARD.INITIAL_VALUES)

  const workingBoard = boards.find(
    (board) => board.project === project.name && board.selected
  )!

  const workingBoards = boards.filter((board) => board.project === project.name)

  const setStatuses: Dispatch<SetStateAction<Status[]>> = (statuses) =>
    setBoards(
      BOARD.statusesSetter(
        typeof statuses === 'function'
          ? statuses(workingBoard.statuses)
          : statuses,
        project
      )
    )

  return { board: workingBoard, boards: workingBoards, setBoards, setStatuses }
}

export default useBoards
