import { Note } from '@/types/note'
import { Button, Stack, Typography } from '@mui/material'
import { Field, Form, Formik, FormikHelpers } from 'formik'
import { TextField } from 'formik-mui'
import { MouseEventHandler } from 'react'
import DraggableDialog, {
  DraggableDialogProps,
} from '../../layout/DraggableDialog/DraggableDialog'
import { isUnsaved } from '../../modules/common'
import validationSchema from './validation/validationSchema'

interface SaveNoteDialogProps extends DraggableDialogProps {
  note: Note
  notes: Note[]
  onSave: (
    values: { name: string },
    formikHelpers: FormikHelpers<{ name: string }>
  ) => void
  onCancel?: MouseEventHandler<HTMLButtonElement> | undefined
}

const SaveNoteDialog = ({
  note,
  notes,
  onSave,
  onClose,
  onCancel = onClose as MouseEventHandler<HTMLButtonElement> | undefined,
  ...props
}: SaveNoteDialogProps) => (
  <DraggableDialog
    {...props}
    onClose={onClose}
    dialogTitle={isUnsaved(note) ? 'Save note' : 'Rename note'}
    dialogContent={
      <Stack spacing={3}>
        <Typography>Choose a name for your note</Typography>
        <Formik
          initialValues={{
            name: isUnsaved(note) ? '' : note.name,
          }}
          validationSchema={validationSchema(note, notes)}
          onSubmit={onSave}
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
        <Button type='submit' form='note' variant='outlined'>
          Save
        </Button>
      </>
    }
  />
)

export default SaveNoteDialog
