import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import NotificationsIcon from '@mui/icons-material/Notifications'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  IconButton,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material'
import { GridRenderCellParams } from '@mui/x-data-grid'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { Field, Form, Formik } from 'formik'
import { Select } from 'formik-mui'
import { TimePicker } from 'formik-mui-x-date-pickers'
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
import matchesTime from './functions/matchesTime'
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

  const { starts, ends, room, subject, notification } = findRowById(id, rows)!

  const notifyOnce = useCallback(once(notify), [starts])

  useInterval(
    () =>
      notification && matchesTime(starts, Date.now())
        ? notifyOnce(notificationTitle(starts, subject))()
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
          <Stack spacing={3}>
            <Typography>
              Change notification settings. Set time and subject details.
            </Typography>
            <Formik
              /**
               * TODO:
               * Refactor.
               * Improve dialog content.
               */
              initialValues={{
                notification: 0,
                time: null,
              }}
              onSubmit={() => {}}
            >
              {({ values }) => (
                <Form>
                  <Stack direction='row' columnGap={1.5}>
                    <Field
                      component={Select}
                      name='notification'
                      label='Notification'
                      formHelperText={{ children: 'Set notification time' }}
                      formControl={{ size: 'small', sx: { width: '50%' } }}
                    >
                      <MenuItem value={0}>Current time</MenuItem>
                      <MenuItem value={5}>5 minutes before</MenuItem>
                      <MenuItem value={10}>10 minutes before</MenuItem>
                      <MenuItem value={15}>15 minutes before</MenuItem>
                      <MenuItem value='custom'>Custom time</MenuItem>
                    </Field>
                    {values.notification === 'custom' && (
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Field
                          component={TimePicker}
                          name='time'
                          label='Time'
                          TextFieldProps={{
                            size: 'small',
                            sx: { width: '50%' },
                          }}
                        />
                      </LocalizationProvider>
                    )}
                  </Stack>
                  <Accordion
                    disableGutters
                    sx={{
                      bgcolor: 'transparent',
                      boxShadow: 'none',
                      borderRadius: 1,
                      mt: 1.5,

                      '&::before': {
                        display: 'none',
                      },
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>Summary</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {subject && <Typography>Subject: {subject}</Typography>}
                      {room && <Typography>Room: {room}</Typography>}
                      {starts && <Typography>Starts: {starts}</Typography>}
                      {ends && <Typography>Ends: {ends}</Typography>}
                      {/* <Typography>
                        Notification:{' '}
                        {values.notification === 'custom'
                          ? values.time
                          : ` ${values.notification} minutes before`}
                      </Typography> */}
                    </AccordionDetails>
                  </Accordion>
                </Form>
              )}
            </Formik>
          </Stack>
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

/**
 * TODO:
 * Improve notification title.
 */
const notificationTitle = (starts: Row['starts'], subject: Row['subject']) =>
  starts && subject ? `${subject} starts at ${starts}` : 'Notification'

export default NotificationCell
