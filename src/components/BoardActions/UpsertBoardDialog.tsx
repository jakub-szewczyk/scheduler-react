import { initialValues } from '@/modules/board'
import { LoadingButton } from '@mui/lab'
import { Button, Stack, Typography } from '@mui/material'
import { Field, Form, Formik, FormikHelpers } from 'formik'
import { TextField } from 'formik-mui'
import { MouseEventHandler } from 'react'
import DraggableDialog, {
  DraggableDialogProps,
} from '../../layout/DraggableDialog/DraggableDialog'
import { Board, InitialValues } from '../../types/board'
import validationSchema from './validation/validationSchema'

interface BoardDialogProps extends DraggableDialogProps {
  board: Board
  loading?: boolean
  onCancel?: MouseEventHandler<HTMLButtonElement> | undefined
}

interface CreateBoardDialogProps {
  mode: 'CREATE'
  onCreate: (
    values: InitialValues,
    formikHelpers: FormikHelpers<InitialValues>
  ) => void
}

interface EditBoardDialogProps {
  mode: 'EDIT'
  onEdit: (
    values: InitialValues,
    formikHelpers: FormikHelpers<InitialValues>
  ) => void
}

type UpsertBoardDialogProps = BoardDialogProps &
  (CreateBoardDialogProps | EditBoardDialogProps)

const UpsertBoardDialog = ({
  board,
  loading = false,
  onClose,
  onCancel = onClose as MouseEventHandler<HTMLButtonElement> | undefined,
  ...props
}: UpsertBoardDialogProps) => (
  <DraggableDialog
    {...props}
    onClose={onClose}
    dialogTitle={props.mode === 'CREATE' ? 'Create board' : 'Edit board'}
    dialogContent={
      <Stack spacing={3}>
        <Typography>Choose a name for your board</Typography>
        <Formik
          initialValues={initialValues(props.mode, board)}
          validationSchema={validationSchema}
          onSubmit={props.mode === 'CREATE' ? props.onCreate : props.onEdit}
        >
          {() => (
            <Form id='board'>
              <Field
                component={TextField}
                name='name'
                size='small'
                label='Name'
                helperText='Set board name'
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
          form='board'
          variant='outlined'
          loading={loading}
        >
          Save
        </LoadingButton>
      </>
    }
  />
)

export default UpsertBoardDialog
