import { asteriskSuffix } from '@/modules/common'
import * as NOTE from '@/modules/note'
import { Note } from '@/types/note'
import EditIcon from '@mui/icons-material/Edit'
import { IconButton, Stack, Typography } from '@mui/material'
import { pipe } from 'fp-ts/lib/function'
import { trim } from 'ramda'
import { Dispatch, SetStateAction } from 'react'
import { useBoolean } from 'usehooks-ts'
import SaveNoteDialog from '../NoteActions/SaveNoteDialog'

interface NoteHeaderProps {
  note: Note
  notes: Note[]
  setNotes: Dispatch<SetStateAction<Note[]>>
}

const NoteHeader = ({ note, notes, setNotes }: NoteHeaderProps) => {
  const {
    value: isSaveNoteDialogOpen,
    setFalse: closeSaveNoteDialog,
    setTrue: openSaveNoteDialog,
  } = useBoolean()

  const handleNoteSave = ({ name }: { name: string }) => {
    setNotes(pipe(name, trim, NOTE.save))
    closeSaveNoteDialog()
  }

  return (
    <>
      <Stack
        direction='row'
        justifyContent='center'
        alignItems='center'
        columnGap={1.5}
        width={{
          xs: 'calc(100% - 32px)',
          sm: 'calc(100% - 48px)',
        }}
        maxWidth={(theme) => theme.breakpoints.values.lg}
        marginX='auto'
      >
        <IconButton size='small' onClick={openSaveNoteDialog}>
          <EditIcon fontSize='small' />
        </IconButton>
        <Typography maxWidth={(theme) => theme.breakpoints.values.sm} noWrap>
          {asteriskSuffix(note.name)}
        </Typography>
      </Stack>
      <SaveNoteDialog
        open={isSaveNoteDialogOpen}
        onClose={closeSaveNoteDialog}
        note={note}
        notes={notes}
        onSave={handleNoteSave}
      />
    </>
  )
}
export default NoteHeader
