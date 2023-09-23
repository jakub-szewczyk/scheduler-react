import { deleteBoard } from '@/services/board'
import { useAuth } from '@clerk/clerk-react'
import CloseIcon from '@mui/icons-material/Close'
import ViewKanbanIcon from '@mui/icons-material/ViewKanban'
import { Box, IconButton, ListItemButton, Stack, Tooltip } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { useBoolean, useReadLocalStorage } from 'usehooks-ts'
import { Board } from '../../types/board'
import DeleteBoardDialog from './DeleteBoardDialog'

interface BoardsDrawerItemProps {
  board: Pick<Board, 'id' | 'createdAt' | 'name'>
  boards: Pick<Board, 'id' | 'createdAt' | 'name'>[]
  onSelect: (boardId: string) => void
}

const BoardsDrawerItem = ({
  board,
  boards,
  onSelect,
}: BoardsDrawerItemProps) => {
  const selectedProjectId = useReadLocalStorage<string | null>(
    'selectedProjectId'
  )

  const selectedBoardId = useReadLocalStorage<string | null>('selectedBoardId')

  const {
    value: isDeleteBoardDialogOpen,
    setFalse: closeDeleteBoardDialog,
    setTrue: openDeleteBoardDialog,
  } = useBoolean(false)

  const { getToken } = useAuth()

  const queryClient = useQueryClient()

  const { mutate: deleteBoardMutation, isLoading: isBoardDeleting } =
    useMutation(deleteBoard, {
      onSuccess: () => {
        queryClient.invalidateQueries(
          ['projects', selectedProjectId, 'boards'],
          { exact: true }
        )
        closeDeleteBoardDialog()
      },
    })

  const handleBoardDelete = async (boardId: string) =>
    deleteBoardMutation({
      projectId: selectedProjectId!,
      boardId,
      token: await getToken(),
    })

  return (
    <>
      <Stack direction='row' alignItems='start'>
        <ListItemButton onClick={() => onSelect(board.id)}>
          <ListItemAvatar>
            <Avatar
              sx={{
                ...(board.id === selectedBoardId && {
                  bgcolor: (theme) => theme.palette.primary.main,
                }),
              }}
            >
              <ViewKanbanIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={board.name}
            secondary={formatDistanceToNow(new Date(board.createdAt), {
              addSuffix: true,
            })}
            sx={{
              '.MuiTypography-root': {
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              },
            }}
          />
        </ListItemButton>
        <Tooltip
          placement='left'
          title={boards.length === 1 && 'At least one board is required'}
        >
          <Box>
            <IconButton
              size='small'
              disabled={boards.length === 1}
              onClick={openDeleteBoardDialog}
            >
              <CloseIcon fontSize='small' />
            </IconButton>
          </Box>
        </Tooltip>
      </Stack>
      <DeleteBoardDialog
        open={isDeleteBoardDialogOpen}
        onClose={closeDeleteBoardDialog}
        board={board}
        loading={isBoardDeleting}
        onDelete={handleBoardDelete}
      />
    </>
  )
}

export default BoardsDrawerItem
