import { Note } from '@/types/note'
import { useAuth } from '@clerk/clerk-react'
import CloseIcon from '@mui/icons-material/Close'
import StickyNote2Icon from '@mui/icons-material/StickyNote2'
import { Box, IconButton, ListItemButton, Stack, Tooltip } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { useBoolean, useReadLocalStorage } from 'usehooks-ts'
import DeleteNoteDialog from './DeleteNoteDialog'
import { deleteNote } from '@/services/note'

interface NotesDrawerItemProps {
  note: Pick<Note, 'id' | 'createdAt' | 'name'>
  notes: Pick<Note, 'id' | 'createdAt' | 'name'>[]
  onSelect: (noteId: string) => void
}

const NotesDrawerItem = ({ note, notes, onSelect }: NotesDrawerItemProps) => {
  const selectedProjectId = useReadLocalStorage<string | null>(
    'selectedProjectId'
  )

  const selectedNoteId = useReadLocalStorage<string | null>('selectedNoteId')

  const {
    value: isDeleteNoteDialogOpen,
    setFalse: closeDeleteNoteDialog,
    setTrue: openDeleteNoteDialog,
  } = useBoolean(false)

  const { getToken } = useAuth()

  const queryClient = useQueryClient()

  const { mutate: deleteNoteMutation, isLoading: isNoteDeleting } = useMutation(
    deleteNote,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(
          ['projects', selectedProjectId, 'notes'],
          { exact: true }
        )
        closeDeleteNoteDialog()
      },
    }
  )

  const handleNoteDelete = async (noteId: string) =>
    deleteNoteMutation({
      projectId: selectedProjectId!,
      noteId,
      token: await getToken(),
    })

  return (
    <>
      <Stack direction='row' alignItems='start'>
        <ListItemButton onClick={() => onSelect(note.id)}>
          <ListItemAvatar>
            <Avatar
              sx={{
                ...(note.id === selectedNoteId && {
                  bgcolor: (theme) => theme.palette.primary.main,
                }),
              }}
            >
              <StickyNote2Icon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={note.name}
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
              onClick={openDeleteNoteDialog}
            >
              <CloseIcon fontSize='small' />
            </IconButton>
          </Box>
        </Tooltip>
      </Stack>
      <DeleteNoteDialog
        open={isDeleteNoteDialogOpen}
        onClose={closeDeleteNoteDialog}
        note={note}
        loading={isNoteDeleting}
        onDelete={handleNoteDelete}
      />
    </>
  )
}

export default NotesDrawerItem
