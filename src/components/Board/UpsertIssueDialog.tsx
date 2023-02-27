import { Button, Stack, Typography } from '@mui/material'
import { Field, Form, Formik, FormikHelpers } from 'formik'
import { TextField } from 'formik-mui'
import { constant } from 'fp-ts/lib/function'
import { cond, equals } from 'ramda'
import { MouseEventHandler } from 'react'
import { Issue, Status, UpsertIssueDialogMode } from '../../types/board'
import DraggableDialog, {
  DraggableDialogProps,
} from '../layout/DraggableDialog/DraggableDialog'
import { upsertIssueValidationSchema } from './validation/validationSchema'

type SubmitHandler = (
  values: Issue,
  formikHelpers: FormikHelpers<Issue>
) => void

interface EditIssueDialogProps extends DraggableDialogProps {
  mode: UpsertIssueDialogMode
  issue: Issue
  issues: Issue[]
  statuses: Status[]
  onEdit: SubmitHandler
  onInsertAbove: SubmitHandler
  onInsertBelow: SubmitHandler
  onCancel?: MouseEventHandler<HTMLButtonElement> | undefined
}

const UpsertIssueDialog = ({
  mode,
  issue,
  issues,
  statuses,
  onEdit,
  onInsertAbove,
  onInsertBelow,
  onClose,
  onCancel = onClose as MouseEventHandler<HTMLButtonElement> | undefined,
  ...props
}: EditIssueDialogProps) => {
  const onSubmit = cond([
    [equals('EDIT'), constant(onEdit)],
    [equals('INSERT_ABOVE'), constant(onInsertAbove)],
    [equals('INSERT_BELOW'), constant(onInsertBelow)],
  ])

  return (
    <DraggableDialog
      {...props}
      onClose={onClose}
      dialogTitle={mode === 'EDIT' ? 'Edit issue' : 'Create issue'}
      dialogContent={
        <Stack spacing={3}>
          <Typography>Set issue title and description</Typography>
          <Formik
            initialValues={{
              title: mode === 'EDIT' ? issue.title : '',
              content: mode === 'EDIT' ? issue.content : '',
            }}
            validationSchema={upsertIssueValidationSchema(
              mode,
              issue,
              statuses
            )}
            onSubmit={onSubmit(mode)}
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
}

export default UpsertIssueDialog
