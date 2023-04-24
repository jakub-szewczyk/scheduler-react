import { Note } from '@/types/note'
import CloseIcon from '@mui/icons-material/Close'
import ViewListIcon from '@mui/icons-material/ViewList'
import { Box, IconButton, ListItemButton, Stack, Tooltip } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import { formatDistanceToNow } from 'date-fns'
import { useBoolean } from 'usehooks-ts'
import { asteriskSuffix } from '../../modules/common'
import DeleteNoteDialog from './DeleteNoteDialog'

interface NotesDrawerItemProps {
  note: Note
  notes: Note[]
  onDelete: (name: string) => void
  onSelect: (name: string) => void
}

const NotesDrawerItem = ({
  note,
  notes,
  onDelete,
  onSelect,
}: NotesDrawerItemProps) => {
  const {
    value: isDeleteDialogOpen,
    setFalse: closeDeleteDialog,
    setTrue: openDeleteDialog,
  } = useBoolean(false)

  return (
    <>
      <Stack direction='row' alignItems='start'>
        <ListItemButton onClick={() => onSelect(note.name)}>
          <ListItemAvatar>
            <Avatar>
              <ViewListIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={asteriskSuffix(note.name)}
            secondary={formatDistanceToNow(new Date(note.createdAt), {
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
          title={notes.length === 1 && 'At least one note is required'}
        >
          <Box>
            <IconButton
              size='small'
              disabled={notes.length === 1}
              onClick={openDeleteDialog}
            >
              <CloseIcon fontSize='small' />
            </IconButton>
          </Box>
        </Tooltip>
      </Stack>
      <DeleteNoteDialog
        open={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        note={note}
        onDelete={onDelete}
      />
    </>
  )
}

export default NotesDrawerItem
