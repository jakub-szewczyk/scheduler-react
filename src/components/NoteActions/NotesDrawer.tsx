import { Note } from '@/types/note'
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
import NotesDrawerItem from './NotesDrawerItem'

interface NotesDrawerProps extends Omit<SwipeableDrawerProps, 'onSelect'> {
  note: Note
  notes: Note[]
  onCreate: MouseEventHandler<HTMLButtonElement> | undefined
  onDelete: (name: string) => void
  onSelect: (name: string) => void
}

const NotesDrawer = ({
  note,
  notes,
  onCreate,
  onDelete,
  onSelect,
  ...props
}: NotesDrawerProps) => (
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
          Create or load notes
        </Typography>
        <List
          sx={{
            overflow: 'auto',
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 1,
          }}
        >
          {notes.map((note) => (
            <NotesDrawerItem
              key={note.name}
              note={note}
              notes={notes}
              onSelect={onSelect}
              onDelete={onDelete}
            />
          ))}
        </List>
      </Stack>
      <Tooltip
        title={
          any(isUnsaved, notes) &&
          'All notes must be saved before creating a new one'
        }
      >
        <Box>
          <Button
            variant='outlined'
            endIcon={<AddIcon />}
            disabled={any(isUnsaved, notes)}
            onClick={onCreate}
            fullWidth
          >
            New note
          </Button>
        </Box>
      </Tooltip>
    </Stack>
  </SwipeableDrawer>
)

export default NotesDrawer
