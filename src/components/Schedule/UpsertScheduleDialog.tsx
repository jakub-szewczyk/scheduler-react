import { initialValues } from '@/modules/schedule'
import { InitialValues, Schedule } from '@/types/schedule'
import { LoadingButton } from '@mui/lab'
import { Button, Stack, Typography } from '@mui/material'
import { Field, Form, Formik, FormikHelpers } from 'formik'
import { TextField } from 'formik-mui'
import { MouseEventHandler } from 'react'
import DraggableDialog, {
  DraggableDialogProps,
} from '../../layout/DraggableDialog/DraggableDialog'
import { scheduleValidationSchema } from './validation/validationSchema'

interface ScheduleDialogProps extends DraggableDialogProps {
  schedule: Schedule
  loading?: boolean
  onCancel?: MouseEventHandler<HTMLButtonElement> | undefined
}

interface CreateScheduleDialogProps {
  mode: 'CREATE'
  onCreate: (
    values: InitialValues,
    formikHelpers: FormikHelpers<InitialValues>
  ) => void
}

interface EditScheduleDialogProps {
  mode: 'EDIT'
  onEdit: (
    values: InitialValues,
    formikHelpers: FormikHelpers<InitialValues>
  ) => void
}

type UpsertScheduleDialogProps = ScheduleDialogProps &
  (CreateScheduleDialogProps | EditScheduleDialogProps)

const UpsertScheduleDialog = ({
  schedule,
  loading = false,
  onClose,
  onCancel = onClose as MouseEventHandler<HTMLButtonElement> | undefined,
  ...props
}: UpsertScheduleDialogProps) => (
  <DraggableDialog
    {...props}
    onClose={onClose}
    dialogTitle={props.mode === 'CREATE' ? 'Create schedule' : 'Edit schedule'}
    dialogContent={
      <Stack spacing={3}>
        <Typography>Choose a name for your schedule</Typography>
        <Formik
          initialValues={initialValues(props.mode, schedule)}
          validationSchema={scheduleValidationSchema}
          onSubmit={props.mode === 'CREATE' ? props.onCreate : props.onEdit}
        >
          {() => (
            <Form id='schedule'>
              <Field
                component={TextField}
                name='name'
                size='small'
                label='Name'
                helperText='Set schedule name'
                fullWidth
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
        <LoadingButton
          type='submit'
          form='schedule'
          variant='outlined'
          loading={loading}
        >
          Save
        </LoadingButton>
      </>
    }
  />
)

export default UpsertScheduleDialog
