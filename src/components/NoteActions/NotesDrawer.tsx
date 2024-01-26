import DrawerItemSkeleton from '@/layout/DrawerItemSkeleton/DrawerItemSkeleton'
import { NOTES_PAGE_SIZE } from '@/modules/note'
import { getNotes } from '@/services/note'
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
  const params = useParams<Params>()

  const {
    data: notes,
    isLoading: isEachNoteLoading,
    isSuccess: isEachNoteFetchedSuccessfully,
    isFetchingNextPage: isFetchingNextNotesPage,
    hasNextPage: hasNextNotesPage,
    fetchNextPage: fetchNextNotesPage,
  } = useInfiniteQuery(
    ['infinite', 'projects', params.projectId, 'notes'],
    ({ pageParam = 0 }) =>
      getNotes({
        projectId: params.projectId!,
        page: pageParam,
        size: NOTES_PAGE_SIZE,
      }),
    {
      getNextPageParam: (lastPage) =>
        lastPage.page < Math.ceil(lastPage.total / NOTES_PAGE_SIZE) - 1
          ? lastPage.page + 1
          : undefined,
    }
  )

  const ref = useRef<HTMLDivElement | null>(null)

  const entry = useIntersectionObserver(ref, {
    freezeOnceVisible: isFetchingNextNotesPage,
  })

  /* FIXME:
   * Fix null ref bug.
   */
  useEffect(() => {
    entry?.isIntersecting && fetchNextNotesPage()
  }, [entry?.isIntersecting, fetchNextNotesPage])

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
                .map((_, index) => <DrawerItemSkeleton key={index} />)}
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
            {hasNextNotesPage && <DrawerItemSkeleton ref={ref} />}
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
