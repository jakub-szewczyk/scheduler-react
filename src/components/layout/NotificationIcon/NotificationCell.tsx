import { Box, IconButton, Stack, Tooltip } from '@mui/material'
import { GridRenderCellParams } from '@mui/x-data-grid'
import { none } from 'fp-ts/lib/Option'
import { once } from 'ramda'
import { Dispatch, MouseEventHandler, SetStateAction, useCallback } from 'react'
import { useBoolean, useInterval } from 'usehooks-ts'
import matchesTime from '../../Table/functions/matchesTime'
import notify from '../../Table/functions/notify'
import updateRowField from '../../Table/functions/updateRowField'
import NotificationDialog from '../../Table/NotificationDialog'
import NotificationIcon from '../../Table/NotificationIcon'
import { Row } from '../../Table/types/Table.types'

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

  const notifyOnce = useCallback(once(notify), [
    row.starts,
    row.notification?.time,
  ])

  useInterval(
    () =>
      row.notification?.active &&
      matchesTime(row.notification?.time, Date.now())
        ? notifyOnce('NOTIFICATION_TITLE_PLACEHOLDER')()
        : none,
    1000
  )

  const handleNotificationIconButtonClick:
    | MouseEventHandler<HTMLButtonElement>
    | undefined = () =>
    setRows(
      updateRowField(
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

  return (
    <>
      <Stack
        direction='row'
        justifyContent='center'
        alignItems='center'
        width='100%'
      >
        <Tooltip
          title={!row.starts && 'Set start time to enable notification'}
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
        row={row}
        open={isNotificationDialogOpen}
        onClose={closeNotificationDialog}
      />
    </>
  )
}

export default NotificationCell
