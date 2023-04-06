import AddIcon from '@mui/icons-material/Add'
import {
  Box,
  Button,
  Stack,
  SwipeableDrawer,
  SwipeableDrawerProps,
  Tooltip,
  Typography,
} from '@mui/material'
import List from '@mui/material/List'
import { any } from 'ramda'
import { MouseEventHandler } from 'react'
import { isUnsaved } from '../../modules/common'
import { Board } from '../../types/board'
import BoardsDrawerItem from './BoardsDrawerItem'

interface BoardsDrawerProps extends Omit<SwipeableDrawerProps, 'onSelect'> {
  board: Board
  boards: Board[]
  onCreate: MouseEventHandler<HTMLButtonElement> | undefined
  onDelete: (name: string) => void
  onSelect: (name: string) => void
}

const BoardsDrawer = ({
  board,
  boards,
  onCreate,
  onDelete,
  onSelect,
  ...props
}: BoardsDrawerProps) => (
  <SwipeableDrawer
    {...props}
    anchor='right'
    PaperProps={{
      sx: { width: 320 },
    }}
  >
    <Stack padding={2} justifyContent='space-between' height='100%' rowGap={2}>
      <Stack spacing={2} overflow='auto'>
        <Typography variant='h6' align='center'>
          Create or load boards
        </Typography>
        <List
          sx={{
            overflow: 'auto',
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 1,
          }}
        >
          {boards.map((board) => (
            <BoardsDrawerItem
              key={board.name}
              board={board}
              boards={boards}
              onSelect={onSelect}
              onDelete={onDelete}
            />
          ))}
        </List>
      </Stack>
      <Tooltip
        title={
          any(isUnsaved, boards) &&
          'All boards must be saved before creating a new one'
        }
      >
        <Box>
          <Button
            variant='outlined'
            endIcon={<AddIcon />}
            disabled={any(isUnsaved, boards)}
            onClick={onCreate}
            fullWidth
          >
            New board
          </Button>
        </Box>
      </Tooltip>
    </Stack>
  </SwipeableDrawer>
)

export default BoardsDrawer
