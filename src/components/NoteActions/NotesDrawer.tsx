import DrawerEmptyItem from '@/layout/DrawerEmptyItem/DrawerEmptyItem'
import DrawerSkeletonItem from '@/layout/DrawerSkeletonItem/DrawerSkeletonItem'
import { NOTES_PAGE_SIZE } from '@/modules/note'
import { getNotes } from '@/services/note'
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
import NotesDrawerItem from './NotesDrawerItem'

type Params = {
  projectId: string
  boardId: string
}

interface NotesDrawerProps extends Omit<SwipeableDrawerProps, 'onSelect'> {
  onCreate: MouseEventHandler<HTMLButtonElement> | undefined
  onSelect: (noteId: string) => void
}

const NotesDrawer = ({ onCreate, onSelect, ...props }: NotesDrawerProps) => {
  const [search, setSearch] = useState('')

  const params = useParams<Params>()

  const inputRef = useRef<HTMLInputElement>()

  const {
    data: notes,
    isLoading: isEachNoteLoading,
    isSuccess: isEachNoteFetchedSuccessfully,
    isFetchingNextPage: isFetchingNextNotesPage,
    hasNextPage: hasNextNotesPage,
    fetchNextPage: fetchNextNotesPage,
  } = useInfiniteQuery(
    [
      'infinite',
      'projects',
      params.projectId,
      'notes',
      {
        ...(search && { name: search }),
      },
    ],
    ({ pageParam = 0 }) =>
      getNotes({
        projectId: params.projectId!,
        page: pageParam,
        size: NOTES_PAGE_SIZE,
        ...(search && { name: search }),
      }),
    {
      getNextPageParam: (lastPage) =>
        lastPage.page < Math.ceil(lastPage.total / NOTES_PAGE_SIZE) - 1
          ? lastPage.page + 1
          : undefined,
    }
  )

  const { ref: itemRef } = useIntersectionObserver({
    freezeOnceVisible: isFetchingNextNotesPage,
    onChange: (isIntersecting) => isIntersecting && fetchNextNotesPage(),
  })

  const handleNoteSearchChange = useDebounceCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setSearch(event.target.value),
    500
  )

  const handleNoteSearchClear = () => {
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
            Create or load notes
          </Typography>
          <Box>
            <TextField
              size='small'
              label='Search by name'
              fullWidth
              defaultValue={search || ''}
              onChange={handleNoteSearchChange}
              InputProps={{
                inputRef,
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: search ? (
                  <InputAdornment position='end'>
                    <IconButton size='small' onClick={handleNoteSearchClear}>
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
            {isEachNoteLoading &&
              Array(3)
                .fill(null)
                .map((_, index) => <DrawerSkeletonItem key={index} />)}
            {isEachNoteFetchedSuccessfully &&
              notes.pages.flatMap((page) =>
                page.content.map((note) => (
                  <NotesDrawerItem
                    key={note.id}
                    note={note}
                    notes={notes.pages.flatMap((page) => page.content)}
                    onSelect={onSelect}
                  />
                ))
              )}
            {isEachNoteFetchedSuccessfully &&
              notes.pages.flatMap((page) => page.content).length === 0 && (
                <DrawerEmptyItem />
              )}
            {hasNextNotesPage && <DrawerSkeletonItem ref={itemRef} />}
          </List>
        </Stack>
        <Box>
          <Button
            variant='outlined'
            endIcon={<AddIcon />}
            onClick={onCreate}
            fullWidth
          >
            New note
          </Button>
        </Box>
      </Stack>
    </SwipeableDrawer>
  )
}

export default NotesDrawer
