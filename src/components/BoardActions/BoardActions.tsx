import * as ISSUE from '@/modules/issue'
import * as STATUS from '@/modules/status'
import { createBoard, updateBoard } from '@/services/board'
import { updateBoardStatuses } from '@/services/status'
import { Board, InitialValues } from '@/types/board'
import { UpsertedIssue } from '@/types/issue'
import { Status } from '@/types/status'
import { useAuth } from '@clerk/clerk-react'
import EditIcon from '@mui/icons-material/Edit'
import TableRowsIcon from '@mui/icons-material/TableRows'
import ViewColumnIcon from '@mui/icons-material/ViewColumn'
import ViewKanbanIcon from '@mui/icons-material/ViewKanban'
import { SpeedDial, SpeedDialAction } from '@mui/material'
import SpeedDialIcon from '@mui/material/SpeedDialIcon'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FormikHelpers } from 'formik'
import { useBoolean, useLocalStorage, useReadLocalStorage } from 'usehooks-ts'
import UpsertIssueDialog from '../Board/UpsertIssueDialog'
import UpsertStatusDialog from '../Board/UpsertStatusDialog'
import BoardsDrawer from './BoardsDrawer'
import UpsertBoardDialog from './UpsertBoardDialog'

interface BoardActionsProps {
  board: Board
}

const BoardActions = ({ board }: BoardActionsProps) => {
  const selectedProjectId = useReadLocalStorage<string | null>(
    'selectedProjectId'
  )

  const [, setSelectedBoardId] = useLocalStorage<string | null>(
    'selectedBoardId',
    null
  )

  const {
    value: isBoardsDrawerOpen,
    setFalse: closeBoardsDrawer,
    setTrue: openBoardsDrawer,
  } = useBoolean()

  const {
    value: isCreateBoardDialogOpen,
    setFalse: closeCreateBoardDialog,
    setTrue: openCreateBoardDialog,
  } = useBoolean()

  const {
    value: isEditBoardDialogOpen,
    setFalse: closeEditBoardDialog,
    setTrue: openEditBoardDialog,
  } = useBoolean()

  const {
    value: isCreateStatusDialogOpen,
    setFalse: closeCreateStatusDialog,
    setTrue: openCreateStatusDialog,
  } = useBoolean(false)

  const {
    value: isCreateIssueDialogOpen,
    setFalse: closeCreateIssueDialog,
    setTrue: openCreateIssueDialog,
  } = useBoolean(false)

  const { getToken } = useAuth()

  const queryClient = useQueryClient()

  const { mutate: createBoardMutation, isLoading: isBoardCreating } =
    useMutation(createBoard, {
      onSuccess: ({ id }) => {
        queryClient.invalidateQueries(
          ['projects', selectedProjectId, 'boards'],
          { exact: true }
        )
        setSelectedBoardId(id)
        closeCreateBoardDialog()
      },
    })

  const { mutate: updateBoardMutation, isLoading: isBoardUpdating } =
    useMutation(updateBoard, {
      onSuccess: () => {
        queryClient.invalidateQueries(['projects', selectedProjectId, 'boards'])
        closeEditBoardDialog()
      },
    })

  const {
    mutate: updateBoardStatusesMutation,
    isLoading: isUpdatingBoardStatuses,
  } = useMutation(updateBoardStatuses, {
    onSuccess: () => {
      queryClient.invalidateQueries(
        ['projects', selectedProjectId, 'boards', board.id],
        { exact: true }
      )
      closeCreateStatusDialog()
      closeCreateIssueDialog()
    },
  })

  const handleBoardSelect = (boardId: string) => {
    setSelectedBoardId(boardId)
    closeBoardsDrawer()
  }

  const handleBoardCreate = async (
    values: InitialValues,
    formikHelpers: FormikHelpers<InitialValues>
  ) =>
    createBoardMutation({
      projectId: selectedProjectId!,
      name: values.name,
      token: await getToken(),
    })

  const handleBoardEdit = async (
    values: InitialValues,
    formikHelpers: FormikHelpers<InitialValues>
  ) =>
    updateBoardMutation({
      projectId: selectedProjectId!,
      boardId: board.id,
      name: values.name,
      token: await getToken(),
    })

  const handleStatusCreate = async ({ title }: Pick<Status, 'title'>) =>
    updateBoardStatusesMutation({
      projectId: selectedProjectId!,
      boardId: board.id,
      statuses: STATUS.create(title)(board.statuses),
      token: await getToken(),
    })

  const handleIssueCreate = async (issue: UpsertedIssue) =>
    updateBoardStatusesMutation({
      projectId: selectedProjectId!,
      boardId: board.id,
      statuses: ISSUE.create(issue)(board.statuses),
      token: await getToken(),
    })

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
          onClick={openCreateIssueDialog}
          FabProps={{
            disabled: board.statuses.length === 0,
          }}
        />
        <SpeedDialAction
          tooltipTitle='Status'
          icon={<ViewColumnIcon />}
          onClick={openCreateStatusDialog}
        />
        <SpeedDialAction
          tooltipTitle='Rename'
          icon={<EditIcon />}
          onClick={openEditBoardDialog}
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
        onSelect={handleBoardSelect}
        onCreate={openCreateBoardDialog}
      />
      <UpsertBoardDialog
        mode='CREATE'
        open={isCreateBoardDialogOpen}
        onClose={closeCreateBoardDialog}
        board={board}
        loading={isBoardCreating}
        onCreate={handleBoardCreate}
      />
      <UpsertBoardDialog
        mode='EDIT'
        open={isEditBoardDialogOpen}
        onClose={closeEditBoardDialog}
        board={board}
        loading={isBoardUpdating}
        onEdit={handleBoardEdit}
      />
      <UpsertStatusDialog
        mode='CREATE'
        open={isCreateStatusDialogOpen}
        onClose={closeCreateStatusDialog}
        statuses={board.statuses}
        loading={isUpdatingBoardStatuses}
        onCreate={handleStatusCreate}
      />
      <UpsertIssueDialog
        mode='CREATE'
        open={isCreateIssueDialogOpen}
        onClose={closeCreateIssueDialog}
        statuses={board.statuses}
        loading={isUpdatingBoardStatuses}
        onCreate={handleIssueCreate}
      />
    </>
  )
}
export default BoardActions
