import EditIcon from '@mui/icons-material/Edit'
import DownloadIcon from '@mui/icons-material/Download'
import PrintIcon from '@mui/icons-material/Print'
import SaveIcon from '@mui/icons-material/Save'
import ViewListIcon from '@mui/icons-material/ViewList'
import {
  Button,
  SpeedDial,
  SpeedDialAction,
  Stack,
  Typography,
} from '@mui/material'
import SpeedDialIcon from '@mui/material/SpeedDialIcon'
import { Field, Form, Formik } from 'formik'
import { TextField } from 'formik-mui'
import { flow } from 'fp-ts/lib/function'
import {
  cond,
  either,
  equals,
  lensProp,
  map,
  path,
  prop,
  set,
  when,
} from 'ramda'
import { Dispatch, SetStateAction } from 'react'
import { useBoolean } from 'usehooks-ts'
import DraggableDialog from '../layout/DraggableDialog/DraggableDialog'
import { Schedule } from '../Schedule/types/Schedule.types'
import validationSchema from './constants/validationSchema'
import isUnsaved from './functions/isUnsaved'
import { SaveSchedule } from './types/ScheduleActions.types'

interface ScheduleActionsProps {
  schedule: Schedule
  setSchedules: Dispatch<SetStateAction<Schedule[]>>
}

const ScheduleActions = ({ schedule, setSchedules }: ScheduleActionsProps) => {
  const {
    value: isSaveDialogOpen,
    setFalse: closeSaveDialog,
    setTrue: openSaveDialog,
  } = useBoolean()

  const handleDownloadIconClick = () => console.log('Download clicked')

  const handlePrintIconClick = () => console.log('Print clicked')

  const handleSchedulesIconClick = () => console.log('Schedules clicked')

  const handleSpeedDialActionClick = flow(
    path(['currentTarget', 'ariaLabel']) as () => string,
    cond([
      [equals('Download'), handleDownloadIconClick],
      [equals('Print'), handlePrintIconClick],
      [either(equals('Save'), equals('Rename')), openSaveDialog],
      [equals('Schedules'), handleSchedulesIconClick],
    ])
  )

  const handleScheduleSave = ({ name }: SaveSchedule) => {
    setSchedules(map(when(prop('selected'), set(lensProp('name'), name))))
    closeSaveDialog()
  }

  const actions = [
    { name: 'Download', icon: <DownloadIcon /> },
    { name: 'Print', icon: <PrintIcon /> },
    {
      name: isUnsaved(schedule) ? 'Save' : 'Rename',
      icon: isUnsaved(schedule) ? <SaveIcon /> : <EditIcon />,
    },
    { name: 'Schedules', icon: <ViewListIcon /> },
  ]

  return (
    <>
      <SpeedDial
        ariaLabel='speed-dial'
        icon={<SpeedDialIcon />}
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
      >
        {map(
          ({ name, icon }) => (
            <SpeedDialAction
              key={name}
              icon={icon}
              tooltipTitle={name}
              onClick={handleSpeedDialActionClick}
            />
          ),
          actions
        )}
      </SpeedDial>
      <DraggableDialog
        open={isSaveDialogOpen}
        onClose={closeSaveDialog}
        dialogTitle={isUnsaved(schedule) ? 'Save schedule' : 'Rename schedule'}
        dialogContent={
          <Stack spacing={3}>
            <Typography>Choose a name for your schedule.</Typography>
            <Formik
              initialValues={{ name: isUnsaved(schedule) ? '' : schedule.name }}
              validationSchema={validationSchema}
              onSubmit={handleScheduleSave}
            >
              {() => (
                <Form id='schedule'>
                  <Field
                    component={TextField}
                    name='name'
                    size='small'
                    label='Name'
                    helperText='Set schedule name'
                    InputProps={{
                      sx: { width: 400 },
                    }}
                  />
                </Form>
              )}
            </Formik>
          </Stack>
        }
        dialogActions={
          <>
            <Button variant='outlined' onClick={closeSaveDialog}>
              Cancel
            </Button>
            <Button type='submit' form='schedule' variant='outlined'>
              Save
            </Button>
          </>
        }
      />
    </>
  )
}

export default ScheduleActions
