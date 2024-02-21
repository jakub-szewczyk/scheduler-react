import DrawerEmptyItem from '@/layout/DrawerEmptyItem/DrawerEmptyItem'
import DrawerSkeletonItem from '@/layout/DrawerSkeletonItem/DrawerSkeletonItem'
import { BOARDS_PAGE_SIZE } from '@/modules/board'
import { getBoards } from '@/services/board'
import AddIcon from '@mui/icons-material/Add'
import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search'
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  SwipeableDrawer,
  SwipeableDrawerProps,
  TextField,
  Typography,
} from '@mui/material'
import List from '@mui/material/List'
import { useInfiniteQuery } from '@tanstack/react-query'
import { ChangeEvent, MouseEventHandler, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDebounceCallback, useIntersectionObserver } from 'usehooks-ts'
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
  const [search, setSearch] = useState('')

  const params = useParams<Params>()

  const inputRef = useRef<HTMLInputElement>()

  const {
    data: boards,
    isLoading: isEachBoardLoading,
    isSuccess: isEachBoardFetchedSuccessfully,
    isFetchingNextPage: isFetchingNextBoardsPage,
    hasNextPage: hasNextBoardsPage,
    fetchNextPage: fetchNextBoardsPage,
  } = useInfiniteQuery(
    [
      'infinite',
      'projects',
      params.projectId,
      'boards',
      {
        ...(search && { name: search }),
      },
    ],
    ({ pageParam = 0 }) =>
      getBoards({
        projectId: params.projectId!,
        page: pageParam,
        size: BOARDS_PAGE_SIZE,
        ...(search && { name: search }),
      }),
    {
      getNextPageParam: (lastPage) =>
        lastPage.page < Math.ceil(lastPage.total / BOARDS_PAGE_SIZE) - 1
          ? lastPage.page + 1
          : undefined,
    }
  )

  const { ref: itemRef } = useIntersectionObserver({
    freezeOnceVisible: isFetchingNextBoardsPage,
    onChange: (isIntersecting) => isIntersecting && fetchNextBoardsPage(),
  })

  const handleBoardSearchChange = useDebounceCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setSearch(event.target.value),
    500
  )

  const handleBoardSearchClear = () => {
    setSearch('')
    inputRef.current!.value = ''
  }

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
          <Box>
            <TextField
              size='small'
              label='Search'
              fullWidth
              defaultValue={search || ''}
              onChange={handleBoardSearchChange}
              InputProps={{
                inputRef,
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: search ? (
                  <InputAdornment position='end'>
                    <IconButton size='small' onClick={handleBoardSearchClear}>
                      <ClearIcon fontSize='small' />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />
          </Box>
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
                .map((_, index) => <DrawerSkeletonItem key={index} />)}
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
            {isEachBoardFetchedSuccessfully &&
              boards.pages.flatMap((page) => page.content).length === 0 && (
                <DrawerEmptyItem />
              )}
            {hasNextBoardsPage && <DrawerSkeletonItem ref={itemRef} />}
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
