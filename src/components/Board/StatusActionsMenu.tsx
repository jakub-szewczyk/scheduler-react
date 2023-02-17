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
import { Status } from '../../types/board'
import DeleteStatusDialog from './DeleteStatusDialog'
import EditStatusDialog from './EditStatusDialog'

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
  const {
    value: isEditDialogOpen,
    setFalse: closeEditDialog,
    setTrue: openEditDialog,
  } = useBoolean(false)
  const {
    value: isDeleteDialogOpen,
    setFalse: closeDeleteDialog,
    setTrue: openDeleteDialog,
  } = useBoolean(false)

  const handleEditMenuItemClick = () => {
    setMenu(null)
    openEditDialog()
  }

  const handleDeleteMenuItemClick = () => {
    setMenu(null)
    openDeleteDialog()
  }

  const handleStatusEdit = ({ title }: { title: string }) => {
    setStatuses(BOARD.renameStatus(status.title, title))
    closeEditDialog()
  }

  const handleStatusDelete = ({ title }: { title: string }) => {
    setStatuses(BOARD.deleteStatus(title))
    closeDeleteDialog()
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
      </Menu>
      <EditStatusDialog
        open={isEditDialogOpen}
        onClose={closeEditDialog}
        status={status}
        statuses={statuses}
        onSave={handleStatusEdit}
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
