import { Dispatch, SetStateAction } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import * as BOARD from '../modules/board'
import useProjects from './useProjects'
import { Status } from '@/types/status'

const useBoards = () => {
  const { project } = useProjects()

  const [boards, setBoards] = useLocalStorage('boards', BOARD.initialValues())

  const workingBoard = boards.find(
    (board) => board.project === project.name && board.selected
  )!

  const workingBoards = boards.filter((board) => board.project === project.name)

  const setStatuses: Dispatch<SetStateAction<Status[]>> = (statuses) =>
    setBoards(
      BOARD.calculateSubState(
        typeof statuses === 'function'
          ? statuses(workingBoard.statuses)
          : statuses,
        project
      )
    )

  return { board: workingBoard, boards: workingBoards, setBoards, setStatuses }
}

export default useBoards
