import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material'
import { Dispatch, SetStateAction, useState } from 'react'
import { useBoolean } from 'usehooks-ts'
import * as BOARD from '../../modules/board'
import { Status, UpsertStatusDialogMode } from '../../types/board'
import DeleteStatusDialog from './DeleteStatusDialog'
import UpsertStatusDialog from './UpsertStatusDialog'

interface StatusActionsMenuProps {
  status: Status
  statuses: Status[]
  setStatuses: Dispatch<SetStateAction<Status[]>>
}

const StatusActionsMenu = ({
  status,
  statuses,
  setStatuses,
}: StatusActionsMenuProps) => {
  const [menu, setMenu] = useState<HTMLElement | null>(null)
  const [mode, setMode] =
    useState<Exclude<UpsertStatusDialogMode, 'CREATE'>>('EDIT')
  const {
    value: isUpsertDialogOpen,
    setFalse: closeUpsertDialog,
    setTrue: openUpsertDialog,
  } = useBoolean(false)
  const {
    value: isDeleteDialogOpen,
    setFalse: closeDeleteDialog,
    setTrue: openDeleteDialog,
  } = useBoolean(false)

  const handleEditMenuItemClick = () => {
    setMenu(null)
    setMode('EDIT')
    openUpsertDialog()
  }

  const handleDeleteMenuItemClick = () => {
    setMenu(null)
    openDeleteDialog()
  }

  const handleInsertBeforeMenuItemClick = () => {
    setMenu(null)
    setMode('INSERT_BEFORE')
    openUpsertDialog()
  }

  const handleInsertAfterMenuItemClick = () => {
    setMenu(null)
    setMode('INSERT_AFTER')
    openUpsertDialog()
  }

  const handleStatusEdit = ({ title }: Pick<Status, 'title'>) => {
    setStatuses(BOARD.editStatus(status.title, title))
    closeUpsertDialog()
  }

  const handleStatusDelete = ({ title }: Pick<Status, 'title'>) => {
    setStatuses(BOARD.deleteStatus(title))
    closeDeleteDialog()
  }

  const handleStatusInsertBefore = ({ title }: Pick<Status, 'title'>) => {
    setStatuses(BOARD.insertStatusBefore(status.title, title))
    closeUpsertDialog()
  }

  const handleStatusInsertAfter = ({ title }: Pick<Status, 'title'>) => {
    setStatuses(BOARD.insertStatusAfter(status.title, title))
    closeUpsertDialog()
  }

  return (
    <>
      <IconButton
        size='small'
        onClick={(event) => setMenu(event.currentTarget)}
        sx={{
          position: 'absolute',
          top: '50%',
          right: 8,
          translate: '0 -50%',
          color: 'inherit',
        }}
      >
        <MoreVertIcon fontSize='small' />
      </IconButton>
      <Menu open={!!menu} anchorEl={menu} onClose={() => setMenu(null)}>
        <MenuItem onClick={handleEditMenuItemClick}>
          <ListItemIcon>
            <EditIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteMenuItemClick}>
          <ListItemIcon>
            <DeleteIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleInsertBeforeMenuItemClick}>
          <ListItemIcon>
            <ArrowBackIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText>Insert before</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleInsertAfterMenuItemClick}>
          <ListItemIcon>
            <ArrowForwardIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText>Insert after</ListItemText>
        </MenuItem>
      </Menu>
      <UpsertStatusDialog
        open={isUpsertDialogOpen}
        onClose={closeUpsertDialog}
        mode={mode}
        status={status}
        statuses={statuses}
        onEdit={handleStatusEdit}
        onInsertBefore={handleStatusInsertBefore}
        onInsertAfter={handleStatusInsertAfter}
      />
      <DeleteStatusDialog
        open={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        status={status}
        onDelete={handleStatusDelete}
      />
    </>
  )
}

export default StatusActionsMenu
