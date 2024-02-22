import { deleteNote } from '@/services/note'
import { Note } from '@/types/note'
import CloseIcon from '@mui/icons-material/Close'
import StickyNote2Icon from '@mui/icons-material/StickyNote2'
import { Box, IconButton, ListItemButton, Stack, Tooltip } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useBoolean } from 'usehooks-ts'
import DeleteNoteDialog from './DeleteNoteDialog'

type Params = {
  projectId: string
  noteId: string
}

interface NotesDrawerItemProps {
  note: Pick<Note, 'id' | 'createdAt' | 'name'>
  notes: Pick<Note, 'id' | 'createdAt' | 'name'>[]
  disableDelete?: boolean
  onSelect: (noteId: string) => void
}

const NotesDrawerItem = ({
  note,
  notes,
  disableDelete,
  onSelect,
}: NotesDrawerItemProps) => {
  const {
    value: isDeleteNoteDialogOpen,
    setFalse: closeDeleteNoteDialog,
    setTrue: openDeleteNoteDialog,
  } = useBoolean(false)

  const [searchParams] = useSearchParams()

  const params = useParams<Params>()

  const navigate = useNavigate()

  const queryClient = useQueryClient()

  const { mutate: deleteNoteMutation, isLoading: isNoteDeleting } = useMutation(
    deleteNote,
    {
      onSuccess: async () => {
        const isNoteSelected = note.id === params.noteId
        const index = notes.findIndex(({ id }) => id === note.id)
        if (isNoteSelected && index === 0)
          return navigate(
            {
              pathname: `/projects/${params.projectId}/notes/${notes[index + 1].id
                }`,
              search: searchParams.toString(),
            },
            { replace: true }
          )
        if (isNoteSelected && index > 0)
          return navigate(
            {
              pathname: `/projects/${params.projectId}/notes/${notes[index - 1].id
                }`,
              search: searchParams.toString(),
            },
            { replace: true }
          )
        await queryClient.invalidateQueries([
          'infinite',
          'projects',
          params.projectId,
          'notes',
        ])
        closeDeleteNoteDialog()
      },
    }
  )

  const handleNoteDelete = (noteId: string) =>
    deleteNoteMutation({
      projectId: params.projectId!,
      noteId,
    })

  return (
    <>
      <Stack direction='row' alignItems='start'>
        <ListItemButton onClick={() => onSelect(note.id)}>
          <ListItemAvatar>
            <Avatar
              sx={{
                ...(note.id === params.noteId && {
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
          title={disableDelete && 'At least one note is required'}
        >
          <Box>
            <IconButton
              size='small'
              disabled={disableDelete}
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
