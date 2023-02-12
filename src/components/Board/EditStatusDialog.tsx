import { Button, Stack, Typography } from '@mui/material'
import { Field, Form, Formik, FormikHelpers } from 'formik'
import { TextField } from 'formik-mui'
import { MouseEventHandler } from 'react'
import { Status } from '../../types/board'
import DraggableDialog, {
  DraggableDialogProps,
} from '../layout/DraggableDialog/DraggableDialog'
import { editStatusValidationSchema } from './validation/validationSchema'

interface EditStatusDialogProps extends DraggableDialogProps {
  status: Status
  statuses: Status[]
  onSave: (
    values: { title: string },
    formikHelpers: FormikHelpers<{ title: string }>
  ) => void
  onCancel?: MouseEventHandler<HTMLButtonElement> | undefined
}

const EditStatusDialog = ({
  status,
  statuses,
  onSave,
  onClose,
  onCancel = onClose as MouseEventHandler<HTMLButtonElement> | undefined,
  ...props
}: EditStatusDialogProps) => (
  <DraggableDialog
    {...props}
    onClose={onClose}
    dialogTitle='Rename status'
    dialogContent={
      <Stack spacing={3}>
        <Typography>Choose a title for your status</Typography>
        <Formik
          initialValues={{
            title: status.title,
          }}
          validationSchema={editStatusValidationSchema(statuses)}
          onSubmit={onSave}
        >
          {() => (
            <Form id='status'>
              <Field
                component={TextField}
                name='title'
                size='small'
                label='Title'
                helperText='Set status title'
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
        <Button type='submit' form='status' variant='outlined'>
          Save
        </Button>
      </>
    }
  />
)

export default EditStatusDialog
