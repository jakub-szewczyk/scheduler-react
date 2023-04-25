import { isUnsaved } from '@/modules/common'
import * as NOTE from '@/modules/note'
import { exportToPDF } from '@/modules/note'
import { Note } from '@/types/note'
import DownloadIcon from '@mui/icons-material/Download'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import StickyNote2Icon from '@mui/icons-material/StickyNote2'
import { SpeedDial, SpeedDialAction } from '@mui/material'
import SpeedDialIcon from '@mui/material/SpeedDialIcon'
import { Editor } from 'draft-js'
import { pipe } from 'fp-ts/lib/function'
import { trim } from 'ramda'
import { Dispatch, RefObject, SetStateAction, forwardRef } from 'react'
import { useBoolean } from 'usehooks-ts'
import NotesDrawer from './NotesDrawer'
import SaveNoteDialog from './SaveNoteDialog'

interface NoteActionsProps {
  note: Note
  notes: Note[]
  setNotes: Dispatch<SetStateAction<Note[]>>
}

const NoteActions = forwardRef<Editor, NoteActionsProps>(
  ({ note, notes, setNotes }, ref) => {
    const editorRef = ref as RefObject<Editor>

    const {
      value: isNotesDrawerOpen,
      setFalse: closeNotesDrawer,
      setTrue: openNotesDrawer,
    } = useBoolean()

    const {
      value: isSaveNoteDialogOpen,
      setFalse: closeSaveNoteDialog,
      setTrue: openSaveNoteDialog,
    } = useBoolean()

    const handleNoteSave = ({ name }: { name: string }) => {
      setNotes(pipe(name, trim, NOTE.save))
      closeSaveNoteDialog()
    }

    const handleNoteCreate = () => {
      setNotes(NOTE.add)
      closeNotesDrawer()
    }

    const handleNoteDelete = (name: string) => {
      setNotes(NOTE.remove(name))
      closeNotesDrawer()
    }

    const handleNoteSelect = (name: string) => {
      setNotes(NOTE.select(name))
      closeNotesDrawer()
    }

    return (
      <>
        <SpeedDial
          ariaLabel='speed-dial'
          icon={<SpeedDialIcon />}
          sx={{
            position: 'fixed',
            bottom: { xs: 16, sm: 24 },
            right: { xs: 16, sm: 24 },
          }}
        >
          <SpeedDialAction
            tooltipTitle='Download'
            icon={<DownloadIcon />}
            onClick={() => exportToPDF(editorRef.current!)}
          />
          <SpeedDialAction
            tooltipTitle={isUnsaved(note) ? 'Save' : 'Rename'}
            icon={isUnsaved(note) ? <SaveIcon /> : <EditIcon />}
            onClick={openSaveNoteDialog}
          />
          <SpeedDialAction
            tooltipTitle='Notes'
            icon={<StickyNote2Icon fontSize='small' />}
            onClick={openNotesDrawer}
          />
        </SpeedDial>
        <NotesDrawer
          open={isNotesDrawerOpen}
          onOpen={openNotesDrawer}
          onClose={closeNotesDrawer}
          note={note}
          notes={notes}
          onCreate={handleNoteCreate}
          onDelete={handleNoteDelete}
          onSelect={handleNoteSelect}
        />
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
)

export default NoteActions
