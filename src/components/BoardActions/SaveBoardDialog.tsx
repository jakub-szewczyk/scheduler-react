import { Button, Stack, Typography } from '@mui/material'
import { Field, Form, Formik, FormikHelpers } from 'formik'
import { TextField } from 'formik-mui'
import { MouseEventHandler } from 'react'
import { isUnsaved } from '../../modules/common'
import { Board } from '../../types/board'
import DraggableDialog, {
  DraggableDialogProps,
} from '../../layout/DraggableDialog/DraggableDialog'
import validationSchema from './validation/validationSchema'

interface SaveBoardDialogProps extends DraggableDialogProps {
  board: Board
  boards: Board[]
  onSave: (
    values: { name: string },
    formikHelpers: FormikHelpers<{ name: string }>
  ) => void
  onCancel?: MouseEventHandler<HTMLButtonElement> | undefined
}

const SaveBoardDialog = ({
  board,
  boards,
  onSave,
  onClose,
  onCancel = onClose as MouseEventHandler<HTMLButtonElement> | undefined,
  ...props
}: SaveBoardDialogProps) => (
  <DraggableDialog
    {...props}
    onClose={onClose}
    dialogTitle={isUnsaved(board) ? 'Save board' : 'Rename board'}
    dialogContent={
      <Stack spacing={3}>
        <Typography>Choose a name for your board</Typography>
        <Formik
          initialValues={{
            name: isUnsaved(board) ? '' : board.name,
          }}
          validationSchema={validationSchema(board, boards)}
          onSubmit={onSave}
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
        <Button type='submit' form='board' variant='outlined'>
          Save
        </Button>
      </>
    }
  />
)

export default SaveBoardDialog
