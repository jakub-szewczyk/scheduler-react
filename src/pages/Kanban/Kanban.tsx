import { useLocalStorage } from 'usehooks-ts'
import Board from '../../components/Board/Board'
import BoardActions from '../../components/Board/BoardActions/BoardActions'
import * as BOARD from '../../modules/board'

const Kanban = () => {
  const [statuses, setStatuses] = useLocalStorage(
    'statuses',
    BOARD.INITIAL_VALUES
  )

  return (
    <>
      <Board statuses={statuses} setStatuses={setStatuses} />
      <BoardActions statuses={statuses} setStatuses={setStatuses} />
    </>
  )
}

export default Kanban
