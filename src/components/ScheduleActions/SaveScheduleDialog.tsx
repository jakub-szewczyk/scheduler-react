import { Button, Stack, Typography } from '@mui/material'
import { Field, Form, Formik, FormikHelpers } from 'formik'
import { TextField } from 'formik-mui'
import { MouseEventHandler } from 'react'
import DraggableDialog, {
  DraggableDialogProps,
} from '../layout/DraggableDialog/DraggableDialog'
import validationSchema from './validation/validationSchema'
import * as SCHEDULE from '../../modules/schedule'
import { Schedule } from '../../types/schedule'

interface SaveScheduleDialogProps extends DraggableDialogProps {
  schedule: Schedule
  schedules: Schedule[]
  onSave: (
    values: { name: string },
    formikHelpers: FormikHelpers<{ name: string }>
  ) => void
  onCancel?: MouseEventHandler<HTMLButtonElement> | undefined
}

const SaveScheduleDialog = ({
  schedule,
  schedules,
  onSave,
  onClose,
  onCancel = onClose as MouseEventHandler<HTMLButtonElement> | undefined,
  ...props
}: SaveScheduleDialogProps) => (
  <DraggableDialog
    {...props}
    onClose={onClose}
    dialogTitle={
      SCHEDULE.isUnsaved(schedule) ? 'Save schedule' : 'Rename schedule'
    }
    dialogContent={
      <Stack spacing={3}>
        <Typography>Choose a name for your schedule</Typography>
        <Formik
          initialValues={{
            name: SCHEDULE.isUnsaved(schedule) ? '' : schedule.name,
          }}
          validationSchema={validationSchema(schedule, schedules)}
          onSubmit={onSave}
        >
          {() => (
            <Form id='schedule'>
              <Field
                component={TextField}
                name='name'
                size='small'
                label='Name'
                helperText='Set schedule name'
                sx={{ width: 400 }}
              />
            </Form>
          )}
        </Formik>
      </Stack>
    }
    dialogActions={
      <>
        <Button variant='outlined' onClick={onCancel}>
          Cancel
        </Button>
        <Button type='submit' form='schedule' variant='outlined'>
          Save
        </Button>
      </>
    }
  />
)

export default SaveScheduleDialog
