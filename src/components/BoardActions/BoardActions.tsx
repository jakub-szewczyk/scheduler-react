import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import TableRowsIcon from '@mui/icons-material/TableRows'
import ViewColumnIcon from '@mui/icons-material/ViewColumn'
import ViewKanbanIcon from '@mui/icons-material/ViewKanban'
import { SpeedDial, SpeedDialAction } from '@mui/material'
import SpeedDialIcon from '@mui/material/SpeedDialIcon'
import { pipe } from 'fp-ts/lib/function'
import { trim } from 'ramda'
import { useBoolean } from 'usehooks-ts'
import useBoards from '../../hooks/useBoards'
import * as BOARD from '../../modules/board'
import { createIssue, createStatus } from '../../modules/board'
import { isUnsaved } from '../../modules/common'
import { Issue, Status } from '../../types/board'
import UpsertIssueDialog from '../Board/UpsertIssueDialog'
import UpsertStatusDialog from '../Board/UpsertStatusDialog'
import BoardsDrawer from './BoardsDrawer'
import SaveBoardDialog from './SaveBoardDialog'

const BoardActions = () => {
  const { board, boards, setBoards, setStatuses } = useBoards()

  const {
    value: isBoardsDrawerOpen,
    setFalse: closeBoardsDrawer,
    setTrue: openBoardsDrawer,
  } = useBoolean()

  const {
    value: isSaveBoardDialogOpen,
    setFalse: closeSaveBoardDialog,
    setTrue: openSaveBoardDialog,
  } = useBoolean()

  const {
    value: isUpsertStatusDialogOpen,
    setFalse: closeUpsertStatusDialog,
    setTrue: openUpsertStatusDialog,
  } = useBoolean(false)

  const {
    value: isUpsertIssueDialogOpen,
    setFalse: closeUpsertIssueDialog,
    setTrue: openUpsertIssueDialog,
  } = useBoolean(false)

  const handleStatusCreate = ({ title }: Pick<Status, 'title'>) => {
    setStatuses(createStatus(title))
    closeUpsertStatusDialog()
  }

  const handleIssueCreate = (issue: Issue) => {
    setStatuses(createIssue(issue))
    closeUpsertIssueDialog()
  }

  const handleBoardSave = ({ name }: { name: string }) => {
    setBoards(pipe(name, trim, BOARD.save))
    closeSaveBoardDialog()
  }

  const handleBoardCreate = () => {
    setBoards(BOARD.add)
    closeBoardsDrawer()
  }

  const handleBoardDelete = (name: string) => {
    setBoards(BOARD.remove(name))
    closeBoardsDrawer()
  }

  const handleBoardSelect = (name: string) => {
    setBoards(BOARD.select(name))
    closeBoardsDrawer()
  }

  return (
    <>
      <SpeedDial
        ariaLabel='speed-dial'
        icon={<SpeedDialIcon />}
        sx={{
          position: 'fixed',
          bottom: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
        }}
      >
        <SpeedDialAction
          tooltipTitle='Issue'
          icon={<TableRowsIcon />}
          onClick={openUpsertIssueDialog}
          FabProps={{
            disabled: board.statuses.length === 0,
          }}
        />
        <SpeedDialAction
          tooltipTitle='Status'
          icon={<ViewColumnIcon />}
          onClick={openUpsertStatusDialog}
        />
        <SpeedDialAction
          tooltipTitle={isUnsaved(board) ? 'Save' : 'Rename'}
          icon={isUnsaved(board) ? <SaveIcon /> : <EditIcon />}
          onClick={openSaveBoardDialog}
        />
        <SpeedDialAction
          tooltipTitle='Boards'
          icon={<ViewKanbanIcon />}
          onClick={openBoardsDrawer}
        />
      </SpeedDial>
      <BoardsDrawer
        open={isBoardsDrawerOpen}
        onOpen={openBoardsDrawer}
        onClose={closeBoardsDrawer}
        board={board}
        boards={boards}
        onCreate={handleBoardCreate}
        onDelete={handleBoardDelete}
        onSelect={handleBoardSelect}
      />
      <SaveBoardDialog
        open={isSaveBoardDialogOpen}
        onClose={closeSaveBoardDialog}
        board={board}
        boards={boards}
        onSave={handleBoardSave}
      />
      <UpsertStatusDialog
        open={isUpsertStatusDialogOpen}
        onClose={closeUpsertStatusDialog}
        mode='CREATE'
        statuses={board.statuses}
        onCreate={handleStatusCreate}
      />
      <UpsertIssueDialog
        open={isUpsertIssueDialogOpen}
        onClose={closeUpsertIssueDialog}
        mode='CREATE'
        statuses={board.statuses}
        onCreate={handleIssueCreate}
      />
    </>
  )
}
export default BoardActions
