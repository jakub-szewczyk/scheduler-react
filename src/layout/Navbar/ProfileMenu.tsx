import { useClerk, useUser } from '@clerk/clerk-react'
import LogoutIcon from '@mui/icons-material/Logout'
import {
  Avatar,
  CircularProgress,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
} from '@mui/material'
import { useState } from 'react'

const ProfileMenu = () => {
  const [menu, setMenu] = useState<HTMLElement | null>(null)
  const [isSigningOut, setIsSigningOut] = useState(false)

  const { user } = useUser()

  const { signOut } = useClerk()

  const handleSignOutMenuItemClick = async () => {
    setIsSigningOut(true)
    await signOut()
    setIsSigningOut(false)
    setMenu(null)
  }

  return (
    <>
      <IconButton
        onClick={(event) => setMenu(event.currentTarget)}
        sx={{ p: 0 }}
      >
        <Avatar
          src={user?.imageUrl}
          sx={{ width: 40, height: 40, fontSize: 'medium' }}
        />
      </IconButton>
      <Menu
        open={!!menu}
        anchorEl={menu}
        onClose={() => setMenu(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleSignOutMenuItemClick} disabled={isSigningOut}>
          <ListItemIcon>
            {isSigningOut ? (
              <CircularProgress size={16} />
            ) : (
              <LogoutIcon fontSize='small' />
            )}
          </ListItemIcon>
          Sign out
        </MenuItem>
      </Menu>
    </>
  )
}

export default ProfileMenu
