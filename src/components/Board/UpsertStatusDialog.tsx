import { Button, Stack, Typography } from '@mui/material'
import { Field, Form, Formik, FormikHelpers } from 'formik'
import { TextField } from 'formik-mui'
import { constant } from 'fp-ts/lib/function'
import { cond, equals } from 'ramda'
import { MouseEventHandler } from 'react'
import { Status } from '../../types/board'
import DraggableDialog, {
  DraggableDialogProps,
} from '../../layout/DraggableDialog/DraggableDialog'
import { upsertStatusValidationSchema } from './validation/validationSchema'

type SubmitHandler = (
  values: Pick<Status, 'title'>,
  formikHelpers: FormikHelpers<Pick<Status, 'title'>>
) => void

interface StatusDialogProps extends DraggableDialogProps {
  status?: Status
  statuses?: Status[]
  onCreate?: SubmitHandler
  onEdit?: SubmitHandler
  onInsertBefore?: SubmitHandler
  onInsertAfter?: SubmitHandler
  onCancel?: MouseEventHandler<HTMLButtonElement> | undefined
}

interface CreateStatusDialogProps extends StatusDialogProps {
  mode: 'CREATE'
  statuses: Status[]
  onCreate: SubmitHandler
}

interface EditStatusDialogProps extends StatusDialogProps {
  mode: 'EDIT'
  status: Status
  statuses: Status[]
  onEdit: SubmitHandler
}

interface InsertBeforeStatusDialogProps extends StatusDialogProps {
  mode: 'INSERT_BEFORE'
  statuses: Status[]
  onInsertBefore: SubmitHandler
}

interface InsertAfterStatusDialogProps extends StatusDialogProps {
  mode: 'INSERT_AFTER'
  statuses: Status[]
  onInsertAfter: SubmitHandler
}

type UpsertStatusDialogProps =
  | CreateStatusDialogProps
  | EditStatusDialogProps
  | InsertBeforeStatusDialogProps
  | InsertAfterStatusDialogProps

const UpsertStatusDialog = ({
  mode,
  status,
  statuses,
  onCreate,
  onEdit,
  onInsertBefore,
  onInsertAfter,
  onClose,
  onCancel = onClose as MouseEventHandler<HTMLButtonElement> | undefined,
  ...props
}: UpsertStatusDialogProps) => {
  const onSubmit = cond([
    [equals('CREATE'), constant(onCreate!)],
    [equals('EDIT'), constant(onEdit!)],
    [equals('INSERT_BEFORE'), constant(onInsertBefore!)],
    [equals('INSERT_AFTER'), constant(onInsertAfter!)],
  ])

  return (
    <DraggableDialog
      {...props}
      onClose={onClose}
      dialogTitle={mode === 'EDIT' ? 'Edit status' : 'Create status'}
      dialogContent={
        <Stack spacing={3}>
          <Typography>Choose a title for your status</Typography>
          <Formik
            initialValues={{
              title: mode === 'EDIT' ? status.title : '',
            }}
            validationSchema={upsertStatusValidationSchema(
              mode,
              status,
              statuses
            )}
            onSubmit={onSubmit(mode)}
          >
            {() => (
              <Form id='status'>
                <Field
                  component={TextField}
                  name='title'
                  size='small'
                  label='Title'
                  helperText='Set status title'
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
          <Button type='submit' form='status' variant='outlined'>
            Save
          </Button>
        </>
      }
    />
  )
}

export default UpsertStatusDialog
