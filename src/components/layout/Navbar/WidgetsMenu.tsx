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
  MenuList,
} from '@mui/material'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

/**
 * TODO:
 * Rename to `WidgetMenu`
 */
const WidgetsMenu = () => {
  const [menu, setMenu] = useState<HTMLElement | null>(null)

  const navigate = useNavigate()
  const { pathname } = useLocation()

  const handleNotesMenuItemClick = () => {
    navigate('/notes')
    setMenu(null)
  }

  const handleKanbanMenuItemClick = () => {
    navigate('/kanban')
    setMenu(null)
  }

  const handleSchedulesMenuItemClick = () => {
    navigate('/')
    setMenu(null)
  }

  return (
    <>
      <IconButton onClick={(event) => setMenu(event.currentTarget)}>
        <WidgetsIcon />
      </IconButton>
      <Menu open={!!menu} anchorEl={menu} onClose={() => setMenu(null)}>
        <MenuList>
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
            selected={pathname === '/kanban'}
            onClick={handleKanbanMenuItemClick}
          >
            <ListItemIcon>
              <ViewKanbanIcon fontSize='small' />
            </ListItemIcon>
            <ListItemText>Kanban</ListItemText>
          </MenuItem>
          <MenuItem
            selected={pathname === '/'}
            onClick={handleSchedulesMenuItemClick}
          >
            <ListItemIcon>
              <ViewListIcon fontSize='small' />
            </ListItemIcon>
            <ListItemText>Schedules</ListItemText>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  )
}

export default WidgetsMenu
