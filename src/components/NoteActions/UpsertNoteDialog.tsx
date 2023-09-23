import { initialValues } from '@/modules/note'
import { InitialValues, Note } from '@/types/note'
import { LoadingButton } from '@mui/lab'
import { Button, Stack, Typography } from '@mui/material'
import { Field, Form, Formik, FormikHelpers } from 'formik'
import { TextField } from 'formik-mui'
import { MouseEventHandler } from 'react'
import DraggableDialog, {
  DraggableDialogProps,
} from '../../layout/DraggableDialog/DraggableDialog'
import validationSchema from './validation/validationSchema'

interface NoteDialogProps extends DraggableDialogProps {
  note: Note
  loading?: boolean
  onCancel?: MouseEventHandler<HTMLButtonElement> | undefined
}

interface CreateNoteDialogProps {
  mode: 'CREATE'
  onCreate: (
    values: InitialValues,
    formikHelpers: FormikHelpers<InitialValues>
  ) => void
}

interface EditNoteDialogProps {
  mode: 'EDIT'
  onEdit: (
    values: InitialValues,
    formikHelpers: FormikHelpers<InitialValues>
  ) => void
}

type UpsertNoteDialogProps = NoteDialogProps &
  (CreateNoteDialogProps | EditNoteDialogProps)

const UpsertNoteDialog = ({
  note,
  loading = false,
  onClose,
  onCancel = onClose as MouseEventHandler<HTMLButtonElement> | undefined,
  ...props
}: UpsertNoteDialogProps) => (
  <DraggableDialog
    {...props}
    onClose={onClose}
    dialogTitle={props.mode === 'CREATE' ? 'Create note' : 'Edit note'}
    dialogContent={
      <Stack spacing={3}>
        <Typography>Choose a name for your note</Typography>
        <Formik
          initialValues={initialValues(props.mode, note)}
          validationSchema={validationSchema}
          onSubmit={props.mode === 'CREATE' ? props.onCreate : props.onEdit}
        >
          {() => (
            <Form id='note'>
              <Field
                component={TextField}
                name='name'
                size='small'
                label='Name'
                helperText='Set note name'
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
          form='note'
          variant='outlined'
          loading={loading}
        >
          Save
        </LoadingButton>
      </>
    }
  />
)

export default UpsertNoteDialog
