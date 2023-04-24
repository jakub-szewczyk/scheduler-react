import { exportToPDF } from '@/modules/note'
import DownloadIcon from '@mui/icons-material/Download'
import StickyNote2Icon from '@mui/icons-material/StickyNote2'
import { SpeedDial, SpeedDialAction } from '@mui/material'
import SpeedDialIcon from '@mui/material/SpeedDialIcon'
import { Editor } from 'draft-js'
import { RefObject, forwardRef } from 'react'
import { useBoolean } from 'usehooks-ts'

const NoteActions = forwardRef<Editor>((_, ref) => {
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

  return (
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
      {/* TODO: Handle save */}
      {/* <SpeedDialAction
        tooltipTitle={isUnsaved(note) ? 'Save' : 'Rename'}
        icon={isUnsaved(note) ? <SaveIcon /> : <EditIcon />}
        onClick={openSaveNoteDialog}
      /> */}
      {/* TODO: Handle drawer */}
      <SpeedDialAction
        tooltipTitle='Notes'
        icon={<StickyNote2Icon fontSize='small' />}
        onClick={openNotesDrawer}
      />
    </SpeedDial>
  )
})

export default NoteActions
