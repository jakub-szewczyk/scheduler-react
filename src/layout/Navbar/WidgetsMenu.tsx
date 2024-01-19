import AppsIcon from '@mui/icons-material/Apps'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import StickyNote2Icon from '@mui/icons-material/StickyNote2'
import {
  IconButton,
  IconButtonProps,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material'
import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { PostIconWhite } from '../PostIcon/PostIcon.styled'

type Params = {
  projectId: string
  scheduleId: string
  boardId: string
  noteId: string
}

interface WidgetsMenuProps {
  iconButtonProps?: IconButtonProps
}

const WidgetsMenu = ({ iconButtonProps }: WidgetsMenuProps) => {
  const [menu, setMenu] = useState<HTMLElement | null>(null)

  const [searchParams] = useSearchParams()

  const params = useParams<Params>()

  const navigate = useNavigate()

  const handleNotesMenuItemClick = () => {
    if (params.noteId) return setMenu(null)
    navigate({
      pathname: `/projects/${searchParams.get('projectId')}/notes`,
      search: new URLSearchParams({
        projectId: searchParams.get('projectId')!,
        projectName: searchParams.get('projectName')!,
      }).toString(),
    })
    setMenu(null)
  }

  const handleBoardsMenuItemClick = () => {
    if (params.boardId) return setMenu(null)
    navigate({
      pathname: `/projects/${searchParams.get('projectId')}/boards`,
      search: new URLSearchParams({
        projectId: searchParams.get('projectId')!,
        projectName: searchParams.get('projectName')!,
      }).toString(),
    })
    setMenu(null)
  }

  const handleSchedulesMenuItemClick = () => {
    if (params.scheduleId) return setMenu(null)
    navigate({
      pathname: `/projects/${searchParams.get('projectId')}/schedules`,
      search: new URLSearchParams({
        projectId: searchParams.get('projectId')!,
        projectName: searchParams.get('projectName')!,
      }).toString(),
    })
    setMenu(null)
  }

  return (
    <>
      <IconButton
        onClick={(event) => setMenu(event.currentTarget)}
        {...iconButtonProps}
      >
        <AppsIcon />
      </IconButton>
      <Menu
        open={!!menu}
        anchorEl={menu}
        onClose={() => setMenu(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem selected={!!params.noteId} onClick={handleNotesMenuItemClick}>
          <ListItemIcon>
            <StickyNote2Icon fontSize='small' />
          </ListItemIcon>
          <ListItemText>Notes</ListItemText>
        </MenuItem>
        <MenuItem
          selected={!!params.boardId}
          onClick={handleBoardsMenuItemClick}
        >
          <ListItemIcon>
            <PostIconWhite style={{ marginLeft: 2 }} />
          </ListItemIcon>
          <ListItemText>Boards</ListItemText>
        </MenuItem>
        <MenuItem
          selected={!!params.scheduleId}
          onClick={handleSchedulesMenuItemClick}
        >
          <ListItemIcon>
            <PendingActionsIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText>Schedules</ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}

export default WidgetsMenu
