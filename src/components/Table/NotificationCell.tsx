import NotificationsIcon from '@mui/icons-material/Notifications'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import { IconButton, Stack } from '@mui/material'
import { GridRenderCellParams } from '@mui/x-data-grid'
import { format } from 'date-fns'
import { none } from 'fp-ts/lib/Option'
import { once } from 'ramda'
import { Dispatch, MouseEventHandler, SetStateAction, useCallback } from 'react'
import { useInterval } from 'usehooks-ts'
import findRowIndexById from './functions/findRowIndexById'
import notify from './functions/notify'
import updateRowField from './functions/updateRowField'
import { Row } from './types/Table.types'

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
  // TODO: Create find `findRowIndexById` and replace `findRowIndexById` where it suits better.
  const { starts, subject, notification } = rows[findRowIndexById(id, rows)]

  const notifyOnce = useCallback(once(notify), [starts])

  useInterval(
    () =>
      triggerCondition(starts, notification)
        ? notifyOnce(title(starts, subject))()
        : none,
    1000
  )

  const handleNotificationIconButtonClick:
    | MouseEventHandler<HTMLButtonElement>
    | undefined = () => setRows(updateRowField(field, !notification, id, rows))

  const handleNotificationIconButtonContextMenu:
    | MouseEventHandler<HTMLButtonElement>
    | undefined = (event) => {
    event.preventDefault()
  }

  return (
    <Stack
      direction='row'
      justifyContent='center'
      alignItems='center'
      width='100%'
    >
      <IconButton
        size='small'
        onClick={handleNotificationIconButtonClick}
        onContextMenu={handleNotificationIconButtonContextMenu}
      >
        {notification ? (
          <NotificationsIcon fontSize='small' />
        ) : (
          <NotificationsNoneIcon fontSize='small' />
        )}
      </IconButton>
    </Stack>
  )
}

const title = (starts: Row['starts'], subject: Row['subject']) =>
  starts && subject ? `${subject} starts at ${starts}` : 'Notification'

const matchesHour = (starts: string | undefined) =>
  starts === format(Date.now(), 'HH:mm')

const triggerCondition = (
  starts: Row['starts'],
  notification: Row['notification']
) => notification && matchesHour(starts)

export default NotificationCell
