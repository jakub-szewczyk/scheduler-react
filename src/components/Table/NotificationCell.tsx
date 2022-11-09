import NotificationsIcon from '@mui/icons-material/Notifications'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import { IconButton, Stack } from '@mui/material'
import { GridRenderCellParams } from '@mui/x-data-grid'
import { Dispatch, MouseEventHandler, SetStateAction } from 'react'
import findRowIndexById from './functions/findRowIndexById'
import updateRowField from './functions/updateRowField'
import { Row } from './types/Table.types'

// const notify = (title: string, options?: NotificationOptions) => {
//   if (Notification.permission === 'granted')
//     return new Notification(title, options)

//   if (Notification.permission !== 'denied')
//     return Notification.requestPermission().then((permission) =>
//       permission === 'granted' ? new Notification(title, options) : null
//     )
// }

interface NotificationCellProps extends GridRenderCellParams {
  rows: Row[]
  setRows: Dispatch<SetStateAction<Row[]>>
}

const NotificationCell = ({
  id,
  field,
  rows,
  setRows,
}: NotificationCellProps) => {
  const { notification } = rows[findRowIndexById(id, rows)]

  const handleNotificationIconButtonClick:
    | MouseEventHandler<HTMLButtonElement>
    | undefined = () => setRows(updateRowField(field, !notification, id, rows))

  return (
    <Stack
      direction='row'
      justifyContent='center'
      alignItems='center'
      width='100%'
    >
      <IconButton size='small' onClick={handleNotificationIconButtonClick}>
        {notification ? (
          <NotificationsIcon fontSize='small' />
        ) : (
          <NotificationsNoneIcon fontSize='small' />
        )}
      </IconButton>
    </Stack>
  )
}

export default NotificationCell
