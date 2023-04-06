import CloseIcon from '@mui/icons-material/Close'
import ViewListIcon from '@mui/icons-material/ViewList'
import { Box, IconButton, ListItemButton, Stack, Tooltip } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import { formatDistanceToNow } from 'date-fns'
import { useBoolean } from 'usehooks-ts'
import { asteriskSuffix } from '../../modules/common'
import { Board } from '../../types/board'
import DeleteBoardDialog from './DeleteBoardDialog'

interface BoardsDrawerItemProps {
  board: Board
  boards: Board[]
  onDelete: (name: string) => void
  onSelect: (name: string) => void
}

const BoardsDrawerItem = ({
  board,
  boards,
  onDelete,
  onSelect,
}: BoardsDrawerItemProps) => {
  const {
    value: isDeleteDialogOpen,
    setFalse: closeDeleteDialog,
    setTrue: openDeleteDialog,
  } = useBoolean(false)

  return (
    <>
      <Stack direction='row' alignItems='start'>
        <ListItemButton onClick={() => onSelect(board.name)}>
          <ListItemAvatar>
            <Avatar>
              <ViewListIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={asteriskSuffix(board.name)}
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
              onClick={openDeleteDialog}
            >
              <CloseIcon fontSize='small' />
            </IconButton>
          </Box>
        </Tooltip>
      </Stack>
      <DeleteBoardDialog
        open={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        board={board}
        onDelete={onDelete}
      />
    </>
  )
}

export default BoardsDrawerItem
