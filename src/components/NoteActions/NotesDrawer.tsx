import DrawerItemSkeleton from '@/layout/DrawerItemSkeleton/DrawerItemSkeleton'
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
import { useQuery } from '@tanstack/react-query'
import { MouseEventHandler } from 'react'
import { useParams } from 'react-router-dom'
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

  // TODO: Implement infinite scrolling
  const {
    data: notes,
    isLoading: isEachNoteLoading,
    isSuccess: isEachNoteFetchedSuccessfully,
  } = useQuery(['projects', params.projectId, 'notes'], () =>
    getNotes({ projectId: params.projectId! })
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
              notes.content.map((note) => (
                <NotesDrawerItem
                  key={note.id}
                  note={note}
                  notes={notes.content}
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
            New note
          </Button>
        </Box>
      </Stack>
    </SwipeableDrawer>
  )
}

export default NotesDrawer
