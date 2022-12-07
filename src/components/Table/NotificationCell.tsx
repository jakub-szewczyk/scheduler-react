import { Box, IconButton, Stack, Tooltip } from '@mui/material'
import { GridRenderCellParams } from '@mui/x-data-grid'
import { none } from 'fp-ts/lib/Option'
import { once } from 'ramda'
import { Dispatch, MouseEventHandler, SetStateAction, useCallback } from 'react'
import { useBoolean, useInterval } from 'usehooks-ts'
import matchesTime from './functions/matchesTime'
import notify from './functions/notify'
import updateRowField from './functions/updateRowField'
import NotificationDialog from './NotificationDialog'
import NotificationIcon from './NotificationIcon'
import { Row } from './types/Table.types'

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

  const { starts, notification } = row

  const notifyOnce = useCallback(once(notify), [starts])

  useInterval(
    () =>
      notification && matchesTime(starts, Date.now())
        ? notifyOnce('NOTIFICATION_TITLE_PLACEHOLDER')()
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
          title={!starts && 'Set start time to enable notification'}
          placement='left'
        >
          <Box>
            <IconButton
              size='small'
              disabled={!starts}
              onClick={handleNotificationIconButtonClick}
              onContextMenu={handleNotificationIconButtonContextMenu}
            >
              <NotificationIcon active={notification} />
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
