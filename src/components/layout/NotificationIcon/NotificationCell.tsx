import { Box, IconButton, Stack, Tooltip } from '@mui/material'
import { GridRenderCellParams } from '@mui/x-data-grid'
import { pipe } from 'fp-ts/lib/function'
import { none } from 'fp-ts/lib/Option'
import { once, trim } from 'ramda'
import { Dispatch, MouseEventHandler, SetStateAction, useCallback } from 'react'
import { useBoolean, useInterval } from 'usehooks-ts'
import * as NOTIFICATION from '../../../modules/notification'
import * as ROW from '../../../modules/row'
import * as TIME from '../../../modules/time'
import NotificationDialog from '../../Schedule/NotificationDialog'
import NotificationIcon from '../../Schedule/NotificationIcon'
import {
  NotificationConfiguration,
  Row,
} from '../../Schedule/types/Schedule.types'

interface NotificationCellProps extends GridRenderCellParams<any, Row> {
  rows: Row[]
  setRows: Dispatch<SetStateAction<Row[]>>
}

const NotificationCell = ({
  id,
  field,
  row,
  rows,
  setRows,
}: NotificationCellProps) => {
  const {
    value: isNotificationDialogOpen,
    setFalse: closeNotificationDialog,
    setTrue: openNotificationDialog,
  } = useBoolean(false)

  const notifyOnce = useCallback(
    pipe(row.notification?.title!, NOTIFICATION.notify, once),
    [row.notification?.time]
  )

  useInterval(
    () =>
      row.notification?.active &&
      TIME.matches(row.notification?.time, Date.now())
        ? notifyOnce()
        : none,
    1000
  )

  const handleNotificationIconButtonClick:
    | MouseEventHandler<HTMLButtonElement>
    | undefined = () =>
    setRows(
      ROW.update(
        field,
        {
          time: row.notification?.time || row.starts,
          active: !row.notification?.active,
        },
        id,
        rows
      )
    )

  const handleNotificationIconButtonContextMenu:
    | MouseEventHandler<HTMLButtonElement>
    | undefined = (event) => {
    event.preventDefault()
    openNotificationDialog()
  }

  const handleNotificationConfigurationSave = (
    values: NotificationConfiguration
  ) => {
    setRows(
      ROW.update(
        'notification',
        {
          active: !!row.notification?.active,
          time: NOTIFICATION.calculateTime(row.starts!, values),
          title: trim(values.title) || 'Notification',
        },
        id,
        rows
      )
    )
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
        >
          <Box>
            <IconButton
              size='small'
              disabled={!row.starts}
              onClick={handleNotificationIconButtonClick}
              onContextMenu={handleNotificationIconButtonContextMenu}
            >
              <NotificationIcon active={row.notification?.active} />
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
