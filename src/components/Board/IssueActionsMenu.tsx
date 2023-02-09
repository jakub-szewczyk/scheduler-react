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
import { useState } from 'react'

const IssueActionsMenu = () => {
  const [menu, setMenu] = useState<HTMLElement | null>(null)

  const handleEditMenuItemClick = () => {
    setMenu(null)
  }

  const handleDeleteMenuItemClick = () => {
    setMenu(null)
  }

  return (
    <>
      <IconButton
        size='small'
        onClick={(event) => setMenu(event.currentTarget)}
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
    </>
  )
}
export default IssueActionsMenu
