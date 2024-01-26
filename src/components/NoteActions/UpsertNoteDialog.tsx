import { InitialValues, Note } from '@/types/note'
import { LoadingButton } from '@mui/lab'
import { Button, Stack, Typography } from '@mui/material'
import { Field, Form, Formik, FormikHelpers } from 'formik'
import { TextField } from 'formik-mui'
import { MouseEventHandler } from 'react'
import { match } from 'ts-pattern'
import DraggableDialog, {
  DraggableDialogProps,
} from '../../layout/DraggableDialog/DraggableDialog'
import validationSchema from './validation/validationSchema'

interface NoteDialogProps extends DraggableDialogProps {
  note: Note
  loading?: boolean
  onCancel?: MouseEventHandler<HTMLButtonElement> | undefined
}

interface InsertNoteDialogProps {
  mode: 'insert'
  onCreate: (
    values: InitialValues,
    formikHelpers: FormikHelpers<InitialValues>
  ) => void
}

interface UpdateNoteDialogProps {
  mode: 'update'
  onEdit: (
    values: InitialValues,
    formikHelpers: FormikHelpers<InitialValues>
  ) => void
}

type UpsertNoteDialogProps = NoteDialogProps &
  (InsertNoteDialogProps | UpdateNoteDialogProps)

const UpsertNoteDialog = ({
  loading = false,
  onClose,
  onCancel = onClose as MouseEventHandler<HTMLButtonElement> | undefined,
  ...props
}: UpsertNoteDialogProps) => (
  <DraggableDialog
    {...props}
    onClose={onClose}
    dialogTitle={props.mode === 'insert' ? 'Create note' : 'Edit note'}
    dialogContent={
      <Stack spacing={3}>
        <Typography>Choose a name for your note</Typography>
        <Formik
          initialValues={match(props)
            .with({ mode: 'insert' }, () => ({
              name: '',
            }))
            .with({ mode: 'update' }, (props) => ({
              name: props.note.name,
            }))
            .exhaustive()}
          validationSchema={validationSchema}
          onSubmit={props.mode === 'insert' ? props.onCreate : props.onEdit}
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
