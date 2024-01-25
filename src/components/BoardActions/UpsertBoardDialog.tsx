import { LoadingButton } from '@mui/lab'
import { Button, Stack, Typography } from '@mui/material'
import { Field, Form, Formik, FormikHelpers } from 'formik'
import { TextField } from 'formik-mui'
import { MouseEventHandler } from 'react'
import { match } from 'ts-pattern'
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

interface InsertBoardDialogProps {
  mode: 'insert'
  onCreate: (
    values: InitialValues,
    formikHelpers: FormikHelpers<InitialValues>
  ) => void
}

interface UpdateBoardDialogProps {
  mode: 'update'
  onEdit: (
    values: InitialValues,
    formikHelpers: FormikHelpers<InitialValues>
  ) => void
}

type UpsertBoardDialogProps = BoardDialogProps &
  (InsertBoardDialogProps | UpdateBoardDialogProps)

const UpsertBoardDialog = ({
  loading = false,
  onClose,
  onCancel = onClose as MouseEventHandler<HTMLButtonElement> | undefined,
  ...props
}: UpsertBoardDialogProps) => (
  <DraggableDialog
    {...props}
    onClose={onClose}
    dialogTitle={props.mode === 'insert' ? 'Create board' : 'Edit board'}
    dialogContent={
      <Stack spacing={3}>
        <Typography>Choose a name for your board</Typography>
        <Formik
          initialValues={match(props)
            .with({ mode: 'insert' }, () => ({ name: '' }))
            .with({ mode: 'update' }, (props) => ({ name: props.board.name }))
            .exhaustive()}
          validationSchema={validationSchema}
          onSubmit={props.mode === 'insert' ? props.onCreate : props.onEdit}
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
