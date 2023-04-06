import { lensProp, map, prop, set, when } from 'ramda'
import { Dispatch, SetStateAction } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import * as BOARD from '../modules/board'
import { Status } from '../types/board'

const useBoards = () => {
  const [boards, setBoards] = useLocalStorage('boards', BOARD.INITIAL_BOARDS)

  const board = BOARD.findSelected(boards)!

  const setStatuses: Dispatch<SetStateAction<Status[]>> = (
    statuses: Status[] | ((rows: Status[]) => Status[])
  ) =>
    setBoards(
      map(
        when(
          prop('selected'),
          set(
            lensProp('statuses'),
            typeof statuses === 'function' ? statuses(board.statuses) : statuses
          )
        )
      )
    )

  return { board, boards, setBoards, setStatuses }
}

export default useBoards
