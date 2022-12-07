import NotificationsIcon from '@mui/icons-material/Notifications'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'

interface NotificationIconProps {
  active: boolean | undefined
}

const NotificationIcon = ({ active }: NotificationIconProps) =>
  active ? (
    <NotificationsIcon fontSize='small' />
  ) : (
    <NotificationsNoneIcon fontSize='small' />
  )

export default NotificationIcon
