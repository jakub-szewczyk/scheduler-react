import { Status } from '@/types/status'
import { LoadingButton } from '@mui/lab'
import { Button, Stack, Typography } from '@mui/material'
import { Field, Form, Formik, FormikHelpers } from 'formik'
import { TextField } from 'formik-mui'
import { MouseEventHandler } from 'react'
import { match } from 'ts-pattern'
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
  loading?: boolean
  onCreate?: SubmitHandler
  onEdit?: SubmitHandler
  onInsertBefore?: SubmitHandler
  onInsertAfter?: SubmitHandler
  onCancel?: MouseEventHandler<HTMLButtonElement> | undefined
}

interface InsertStatusDialogProps extends StatusDialogProps {
  mode: 'insert'
  statuses: Status[]
  onCreate: SubmitHandler
}

interface UpdateStatusDialogProps extends StatusDialogProps {
  mode: 'update'
  status: Status
  statuses: Status[]
  onEdit: SubmitHandler
}

interface InsertBeforeStatusDialogProps extends StatusDialogProps {
  mode: 'insert_before'
  statuses: Status[]
  onInsertBefore: SubmitHandler
}

interface InsertAfterStatusDialogProps extends StatusDialogProps {
  mode: 'insert_after'
  statuses: Status[]
  onInsertAfter: SubmitHandler
}

type UpsertStatusDialogProps =
  | InsertStatusDialogProps
  | UpdateStatusDialogProps
  | InsertBeforeStatusDialogProps
  | InsertAfterStatusDialogProps

const UpsertStatusDialog = ({
  loading = false,
  onClose,
  onCancel = onClose as MouseEventHandler<HTMLButtonElement> | undefined,
  ...props
}: UpsertStatusDialogProps) => (
  <DraggableDialog
    {...props}
    onClose={onClose}
    dialogTitle={props.mode === 'update' ? 'Edit status' : 'Create status'}
    dialogContent={
      <Stack spacing={3}>
        <Typography>Choose a title for your status</Typography>
        <Formik
          initialValues={{
            title: props.mode === 'update' ? props.status.title : '',
          }}
          validationSchema={upsertStatusValidationSchema(
            props.mode,
            props.status,
            props.statuses
          )}
          onSubmit={match(props)
            .with({ mode: 'insert' }, (props) => props.onCreate)
            .with({ mode: 'update' }, (props) => props.onEdit)
            .with({ mode: 'insert_before' }, (props) => props.onInsertBefore)
            .with({ mode: 'insert_after' }, (props) => props.onInsertAfter)
            .exhaustive()}
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
        <LoadingButton
          type='submit'
          form='status'
          variant='outlined'
          loading={loading}
        >
          Save
        </LoadingButton>
      </>
    }
  />
)

export default UpsertStatusDialog
