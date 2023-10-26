import useSnackbarStore from '@/hooks/useSnackbarStore'
import { useAuth } from '@clerk/clerk-react'
import NotificationsIcon from '@mui/icons-material/Notifications'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import { Box, IconButton, Stack, Tooltip } from '@mui/material'
import { GridRenderCellParams } from '@mui/x-data-grid'
import { trim } from 'ramda'
import { MouseEventHandler } from 'react'
import { Updater } from 'use-immer'
import { useBoolean } from 'usehooks-ts'
import * as NOTIFICATION from '../../modules/notification'
import { NotificationConfiguration } from '../../types/notification'
import { Row } from '../../types/row'
import NotificationDialog from './NotificationDialog'

interface NotificationCellProps extends GridRenderCellParams<any, Row> {
  setRows: Updater<Row[]>
}

const NotificationCell = ({ id, row, setRows }: NotificationCellProps) => {
  const {
    value: isNotificationDialogOpen,
    setFalse: closeNotificationDialog,
    setTrue: openNotificationDialog,
  } = useBoolean(false)

  const openSnackbar = useSnackbarStore((state) => state.open)

  const { getToken } = useAuth()

  const handleNotificationIconButtonClick:
    | MouseEventHandler<HTMLButtonElement>
    | undefined = async () => {
    try {
      await NOTIFICATION.subscribe(await getToken())
      setRows((rows) => {
        const row = rows.find((row) => row.id === id)!
        row.notification = {
          time:
            row.notification?.time ||
            new Date(row.starts as string).toISOString(),
          active: !row.notification?.active,
          title: row.notification?.title || '',
        }
      })
    } catch (error) {
      openSnackbar({ message: (error as Error).message, severity: 'warning' })
    }
  }

  const handleNotificationIconButtonContextMenu:
    | MouseEventHandler<HTMLButtonElement>
    | undefined = async (event) => {
    event.preventDefault()
    openNotificationDialog()
    try {
      await NOTIFICATION.subscribe(await getToken())
    } catch (error) {
      openSnackbar({ message: (error as Error).message, severity: 'warning' })
    }
  }

  const handleNotificationConfigurationSave = (
    values: NotificationConfiguration
  ) => {
    setRows((rows) => {
      const row = rows.find((row) => row.id === id)!
      row.notification = {
        time: NOTIFICATION.calculateTime(row.starts!, values)!,
        active: !!row.notification?.active,
        title: trim(values.title),
      }
    })
    closeNotificationDialog()
  }

  return (
    <>
      <Stack
        direction='row'
        justifyContent='center'
        alignItems='center'
        width='100%'
      >
        <Tooltip
          title={
            row.starts
              ? 'Right-click to configure'
              : 'Set start time to enable notification'
          }
          placement='left'
          disableTouchListener
        >
          <Box>
            <IconButton
              size='small'
              disabled={!row.starts}
              onClick={handleNotificationIconButtonClick}
              onContextMenu={handleNotificationIconButtonContextMenu}
            >
              {row.notification?.active ? (
                <NotificationsIcon fontSize='small' />
              ) : (
                <NotificationsNoneIcon fontSize='small' />
              )}
            </IconButton>
          </Box>
        </Tooltip>
      </Stack>
      <NotificationDialog
        open={isNotificationDialogOpen}
        onClose={closeNotificationDialog}
        row={row as Row & { starts: string }}
        onSave={handleNotificationConfigurationSave}
      />
    </>
  )
}

export default NotificationCell
