import { asteriskSuffix } from '@/modules/common'
import { updateBoard } from '@/services/board'
import { Board, InitialValues } from '@/types/board'
import { useAuth } from '@clerk/clerk-react'
import EditIcon from '@mui/icons-material/Edit'
import { IconButton, Stack, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FormikHelpers } from 'formik'
import { useBoolean, useReadLocalStorage } from 'usehooks-ts'
import UpsertBoardDialog from '../BoardActions/UpsertBoardDialog'

interface BoardHeaderProps {
  board: Board
}

const BoardHeader = ({ board }: BoardHeaderProps) => {
  const selectedProjectId = useReadLocalStorage<string | null>(
    'selectedProjectId'
  )

  const {
    value: isEditBoardDialogOpen,
    setFalse: closeEditBoardDialog,
    setTrue: openEditBoardDialog,
  } = useBoolean()

  const { getToken } = useAuth()

  const queryClient = useQueryClient()

  const { mutate: updateBoardMutation, isLoading: isBoardUpdating } =
    useMutation(updateBoard, {
      onSuccess: () => {
        queryClient.invalidateQueries(['projects', selectedProjectId, 'boards'])
        closeEditBoardDialog()
      },
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
          {asteriskSuffix(board.name)}
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
