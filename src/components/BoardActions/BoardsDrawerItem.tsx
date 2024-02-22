import { PostIconNavy } from '@/layout/PostIcon/PostIcon.styled'
import { deleteBoard } from '@/services/board'
import CloseIcon from '@mui/icons-material/Close'
import { Box, IconButton, ListItemButton, Stack, Tooltip } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useBoolean } from 'usehooks-ts'
import { Board } from '../../types/board'
import DeleteBoardDialog from './DeleteBoardDialog'

type Params = {
  projectId: string
  boardId: string
}

interface BoardsDrawerItemProps {
  board: Pick<Board, 'id' | 'createdAt' | 'name'>
  boards: Pick<Board, 'id' | 'createdAt' | 'name'>[]
  disableDelete?: boolean
  onSelect: (boardId: string) => void
}

const BoardsDrawerItem = ({
  board,
  boards,
  disableDelete,
  onSelect,
}: BoardsDrawerItemProps) => {
  const {
    value: isDeleteBoardDialogOpen,
    setFalse: closeDeleteBoardDialog,
    setTrue: openDeleteBoardDialog,
  } = useBoolean(false)

  const [searchParams] = useSearchParams()

  const params = useParams<Params>()

  const navigate = useNavigate()

  const queryClient = useQueryClient()

  const { mutate: deleteBoardMutation, isLoading: isBoardDeleting } =
    useMutation(deleteBoard, {
      onSuccess: async () => {
        const isBoardSelected = board.id === params.boardId
        const index = boards.findIndex(({ id }) => id === board.id)
        if (isBoardSelected && index === 0)
          return navigate(
            {
              pathname: `/projects/${params.projectId}/boards/${boards[index + 1].id
                }`,
              search: searchParams.toString(),
            },
            { replace: true }
          )
        if (isBoardSelected && index > 0)
          return navigate(
            {
              pathname: `/projects/${params.projectId}/boards/${boards[index - 1].id
                }`,
              search: searchParams.toString(),
            },
            { replace: true }
          )
        await queryClient.invalidateQueries([
          'infinite',
          'projects',
          params.projectId,
          'boards',
        ])
        closeDeleteBoardDialog()
      },
    })

  const handleBoardDelete = (boardId: string) =>
    deleteBoardMutation({
      projectId: params.projectId!,
      boardId,
    })

  return (
    <>
      <Stack direction='row' alignItems='start'>
        <ListItemButton onClick={() => onSelect(board.id)}>
          <ListItemAvatar>
            <Avatar
              sx={{
                ...(board.id === params.boardId && {
                  bgcolor: (theme) => theme.palette.primary.main,
                }),
              }}
            >
              <PostIconNavy style={{ width: 18, height: 18 }} />
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
          title={disableDelete && 'At least one board is required'}
        >
          <Box>
            <IconButton
              size='small'
              disabled={disableDelete}
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
