import NotificationsIcon from '@mui/icons-material/Notifications'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import { Button, IconButton, Stack, Typography } from '@mui/material'
import { GridRenderCellParams } from '@mui/x-data-grid'
import { none } from 'fp-ts/lib/Option'
import { once } from 'ramda'
import {
  Dispatch,
  MouseEventHandler,
  SetStateAction,
  useCallback,
  useState,
} from 'react'
import { useInterval } from 'usehooks-ts'
import DraggableDialog from '../layout/DraggableDialog/DraggableDialog'
import findRowById from './functions/findRowById'
import matchesHour from './functions/matchesHour'
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
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] =
    useState(false)

  const { starts, subject, notification } = findRowById(id, rows)!

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
    setIsNotificationDialogOpen(true)
  }

  return (
    <>
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
      <DraggableDialog
        open={isNotificationDialogOpen}
        onClose={() => setIsNotificationDialogOpen(false)}
        dialogTitle='Configure notification'
        dialogContentText={
          <Typography>
            Change notification settings. Set time and subject details.
          </Typography>
        }
        dialogActions={
          <>
            <Button
              variant='outlined'
              onClick={() => setIsNotificationDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant='outlined'
              onClick={() => setIsNotificationDialogOpen(false)}
            >
              Save
            </Button>
          </>
        }
      />
    </>
  )
}

const title = (starts: Row['starts'], subject: Row['subject']) =>
  starts && subject ? `${subject} starts at ${starts}` : 'Notification'

const triggerCondition = (
  starts: Row['starts'],
  notification: Row['notification']
) => notification && matchesHour(starts)

export default NotificationCell
