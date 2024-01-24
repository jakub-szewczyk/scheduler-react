import DrawerItemSkeleton from '@/layout/DrawerItemSkeleton/DrawerItemSkeleton'
import { getBoards } from '@/services/board'
import AddIcon from '@mui/icons-material/Add'
import {
  Box,
  Button,
  Stack,
  SwipeableDrawer,
  SwipeableDrawerProps,
  Typography,
} from '@mui/material'
import List from '@mui/material/List'
import { useQuery } from '@tanstack/react-query'
import { MouseEventHandler } from 'react'
import { useParams } from 'react-router-dom'
import BoardsDrawerItem from './BoardsDrawerItem'

type Params = {
  projectId: string
  boardId: string
}

interface BoardsDrawerProps extends Omit<SwipeableDrawerProps, 'onSelect'> {
  onCreate: MouseEventHandler<HTMLButtonElement> | undefined
  onSelect: (boardId: string) => void
}

const BoardsDrawer = ({ onSelect, onCreate, ...props }: BoardsDrawerProps) => {
  const params = useParams<Params>()

  // TODO: Implement infinite scrolling
  const {
    data: boards,
    isLoading: isEachBoardLoading,
    isSuccess: isEachBoardFetchedSuccessfully,
  } = useQuery(['projects', params.projectId, 'boards'], () =>
    getBoards({
      projectId: params.projectId!,
    })
  )

  return (
    <SwipeableDrawer
      {...props}
      anchor='right'
      PaperProps={{
        sx: { width: 320 },
      }}
    >
      <Stack
        padding={2}
        justifyContent='space-between'
        height='100%'
        rowGap={2}
      >
        <Stack spacing={2} overflow='auto'>
          <Typography variant='h6' align='center'>
            Select & manage boards
          </Typography>
          <List
            sx={{
              overflow: 'auto',
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 1,
              '::-webkit-scrollbar': {
                width: {
                  xs: 4,
                  sm: 8,
                },
              },
              '::-webkit-scrollbar-track': {
                bgcolor: (theme) => theme.palette.secondary.light,
                borderRadius: (theme) => theme.shape.borderRadius,
              },
              '::-webkit-scrollbar-thumb': {
                bgcolor: (theme) => theme.palette.primary.main,
                borderRadius: (theme) => theme.shape.borderRadius,
                '&:hover': {
                  bgcolor: (theme) => theme.palette.primary.dark,
                },
              },
            }}
          >
            {isEachBoardLoading &&
              Array(3)
                .fill(null)
                .map((_, index) => <DrawerItemSkeleton key={index} />)}
            {isEachBoardFetchedSuccessfully &&
              boards.content.map((board) => (
                <BoardsDrawerItem
                  key={board.name}
                  board={board}
                  boards={boards.content}
                  onSelect={onSelect}
                />
              ))}
          </List>
        </Stack>
        <Box>
          <Button
            variant='outlined'
            endIcon={<AddIcon />}
            onClick={onCreate}
            fullWidth
          >
            New board
          </Button>
        </Box>
      </Stack>
    </SwipeableDrawer>
  )
}

export default BoardsDrawer
