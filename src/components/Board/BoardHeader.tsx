import { updateBoard } from '@/services/board'
import { Board, InitialValues } from '@/types/board'
import EditIcon from '@mui/icons-material/Edit'
import { IconButton, Stack, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FormikHelpers } from 'formik'
import { useParams } from 'react-router-dom'
import { useBoolean } from 'usehooks-ts'
import UpsertBoardDialog from '../BoardActions/UpsertBoardDialog'

type Params = {
  projectId: string
  boardId: string
}

interface BoardHeaderProps {
  board: Board
}

const BoardHeader = ({ board }: BoardHeaderProps) => {
  const {
    value: isEditBoardDialogOpen,
    setFalse: closeEditBoardDialog,
    setTrue: openEditBoardDialog,
  } = useBoolean()

  const params = useParams<Params>()

  const queryClient = useQueryClient()

  const { mutate: updateBoardMutation, isLoading: isBoardUpdating } =
    useMutation(updateBoard, {
      onSuccess: async () => {
        await queryClient.invalidateQueries([
          'projects',
          params.projectId,
          'boards',
        ])
        closeEditBoardDialog()
      },
    })

  const handleBoardEdit = (
    values: InitialValues,
    _: FormikHelpers<InitialValues>
  ) =>
    updateBoardMutation({
      projectId: params.projectId!,
      boardId: board.id,
      name: values.name,
    })

  return (
    <>
      <Stack
        direction='row'
        justifyContent='center'
        alignItems='center'
        columnGap={1.5}
        width={{
          xs: 'calc(100% - 32px)',
          sm: 'calc(100% - 48px)',
        }}
        maxWidth={(theme) => theme.breakpoints.values.lg}
        marginX='auto'
      >
        <IconButton size='small' onClick={openEditBoardDialog}>
          <EditIcon fontSize='small' />
        </IconButton>
        <Typography maxWidth={(theme) => theme.breakpoints.values.sm} noWrap>
          {board.name}
        </Typography>
      </Stack>
      <UpsertBoardDialog
        mode='EDIT'
        open={isEditBoardDialogOpen}
        onClose={closeEditBoardDialog}
        board={board}
        loading={isBoardUpdating}
        onEdit={handleBoardEdit}
      />
    </>
  )
}
export default BoardHeader
