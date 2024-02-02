import DrawerItemSkeleton from '@/layout/DrawerItemSkeleton/DrawerItemSkeleton'
import { BOARDS_PAGE_SIZE } from '@/modules/board'
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
import { useInfiniteQuery } from '@tanstack/react-query'
import { MouseEventHandler, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useIntersectionObserver } from 'usehooks-ts'
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

  /* FIXME:
   * Subsequent pages not fetching when opening a drawer while the initial set of items is still loading.
   */
  const {
    data: boards,
    isLoading: isEachBoardLoading,
    isSuccess: isEachBoardFetchedSuccessfully,
    isFetchingNextPage: isFetchingNextBoardsPage,
    hasNextPage: hasNextBoardsPage,
    fetchNextPage: fetchNextBoardsPage,
  } = useInfiniteQuery(
    ['infinite', 'projects', params.projectId, 'boards'],
    ({ pageParam = 0 }) =>
      getBoards({
        projectId: params.projectId!,
        page: pageParam,
        size: BOARDS_PAGE_SIZE,
      }),
    {
      getNextPageParam: (lastPage) =>
        lastPage.page < Math.ceil(lastPage.total / BOARDS_PAGE_SIZE) - 1
          ? lastPage.page + 1
          : undefined,
    }
  )

  const ref = useRef<HTMLDivElement | null>(null)

  const entry = useIntersectionObserver(ref, {
    freezeOnceVisible: isFetchingNextBoardsPage,
  })

  useEffect(() => {
    entry?.isIntersecting && fetchNextBoardsPage()
  }, [entry?.isIntersecting, fetchNextBoardsPage])

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
              boards.pages.flatMap((page) =>
                page.content.map((board) => (
                  <BoardsDrawerItem
                    key={board.name}
                    board={board}
                    boards={boards.pages.flatMap((page) => page.content)}
                    onSelect={onSelect}
                  />
                ))
              )}
            {hasNextBoardsPage && <DrawerItemSkeleton ref={ref} />}
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
