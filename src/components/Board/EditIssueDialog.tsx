import { Button, Stack, Typography } from '@mui/material'
import { Field, Form, Formik, FormikHelpers } from 'formik'
import { TextField } from 'formik-mui'
import { MouseEventHandler } from 'react'
import { Issue } from '../../types/board'
import DraggableDialog, {
  DraggableDialogProps,
} from '../layout/DraggableDialog/DraggableDialog'
import { editIssueValidationSchema } from './validation/validationSchema'

interface EditIssueDialogProps extends DraggableDialogProps {
  issue: Issue
  issues: Issue[]
  onSave: (values: Issue, formikHelpers: FormikHelpers<Issue>) => void
  onCancel?: MouseEventHandler<HTMLButtonElement> | undefined
}

const EditIssueDialog = ({
  issue,
  issues,
  onSave,
  onClose,
  onCancel = onClose as MouseEventHandler<HTMLButtonElement> | undefined,
  ...props
}: EditIssueDialogProps) => (
  <DraggableDialog
    {...props}
    onClose={onClose}
    dialogTitle='Edit issue'
    dialogContent={
      <Stack spacing={3}>
        <Typography>Set issue title and description</Typography>
        <Formik
          initialValues={{
            title: issue.title,
            content: issue.content,
          }}
          validationSchema={editIssueValidationSchema(issues)}
          onSubmit={onSave}
        >
          {() => (
            <Form id='issue'>
              <Stack spacing={2}>
                <Field
                  component={TextField}
                  name='title'
                  size='small'
                  label='Title'
                  helperText='Set issue title'
                  sx={{ width: 400 }}
                />
                <Field
                  component={TextField}
                  name='content'
                  size='small'
                  label='Description'
                  helperText='Set issue description'
                  minRows={4}
                  maxRows={4}
                  multiline
                  sx={{ width: 400 }}
                />
              </Stack>
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
        <Button type='submit' form='issue' variant='outlined'>
          Save
        </Button>
      </>
    }
  />
)

export default EditIssueDialog
