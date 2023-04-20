import StickyNote2Icon from '@mui/icons-material/StickyNote2'
import ViewKanbanIcon from '@mui/icons-material/ViewKanban'
import ViewListIcon from '@mui/icons-material/ViewList'
import WidgetsIcon from '@mui/icons-material/Widgets'
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const WidgetsMenu = () => {
  const [menu, setMenu] = useState<HTMLElement | null>(null)

  const navigate = useNavigate()
  const { pathname } = useLocation()

  const handleNotesMenuItemClick = () => {
    navigate('/notes')
    setMenu(null)
  }

  const handleBoardsMenuItemClick = () => {
    navigate('/boards')
    setMenu(null)
  }

  const handleSchedulesMenuItemClick = () => {
    navigate('/schedules')
    setMenu(null)
  }

  return (
    <>
      <IconButton onClick={(event) => setMenu(event.currentTarget)}>
        <WidgetsIcon />
      </IconButton>
      <Menu open={!!menu} anchorEl={menu} onClose={() => setMenu(null)}>
        <MenuItem
          selected={pathname === '/notes'}
          onClick={handleNotesMenuItemClick}
        >
          <ListItemIcon>
            <StickyNote2Icon fontSize='small' />
          </ListItemIcon>
          <ListItemText>Notes</ListItemText>
        </MenuItem>
        <MenuItem
          selected={pathname === '/boards'}
          onClick={handleBoardsMenuItemClick}
        >
          <ListItemIcon>
            <ViewKanbanIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText>Boards</ListItemText>
        </MenuItem>
        <MenuItem
          selected={pathname === '/schedules'}
          onClick={handleSchedulesMenuItemClick}
        >
          <ListItemIcon>
            <ViewListIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText>Schedules</ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}

export default WidgetsMenu
