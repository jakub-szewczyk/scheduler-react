import { Issue } from '@/types/issue'
import { Status } from '@/types/status'
import { Button, Stack, Theme, Typography } from '@mui/material'
import { Field, Form, Formik, FormikHelpers } from 'formik'
import { TextField } from 'formik-mui'
import { constant } from 'fp-ts/lib/function'
import { cond, equals } from 'ramda'
import { MouseEventHandler } from 'react'
import DraggableDialog, {
  DraggableDialogProps,
} from '../../layout/DraggableDialog/DraggableDialog'
import { upsertIssueValidationSchema } from './validation/validationSchema'

type SubmitHandler = (
  values: Issue,
  formikHelpers: FormikHelpers<Issue>
) => void

interface IssueDialogProps extends DraggableDialogProps {
  issue?: Issue
  issues?: Issue[]
  statuses?: Status[]
  onCreate?: SubmitHandler
  onEdit?: SubmitHandler
  onInsertAbove?: SubmitHandler
  onInsertBelow?: SubmitHandler
  onCancel?: MouseEventHandler<HTMLButtonElement> | undefined
}

interface CreateIssueDialogProps extends IssueDialogProps {
  mode: 'CREATE'
  statuses: Status[]
  onCreate: SubmitHandler
}

interface EditIssueDialogProps extends IssueDialogProps {
  mode: 'EDIT'
  issue: Issue
  issues: Issue[]
  statuses: Status[]
  onEdit: SubmitHandler
}

interface InsertAboveIssueDialogProps extends IssueDialogProps {
  mode: 'INSERT_ABOVE'
  statuses: Status[]
  onInsertAbove: SubmitHandler
}

interface InsertBelowIssueDialogProps extends IssueDialogProps {
  mode: 'INSERT_BELOW'
  statuses: Status[]
  onInsertBelow: SubmitHandler
}

type UpsertIssueDialogProps =
  | CreateIssueDialogProps
  | EditIssueDialogProps
  | InsertAboveIssueDialogProps
  | InsertBelowIssueDialogProps

const UpsertIssueDialog = ({
  mode,
  issue,
  issues,
  statuses,
  onCreate,
  onEdit,
  onInsertAbove,
  onInsertBelow,
  onClose,
  onCancel = onClose as MouseEventHandler<HTMLButtonElement> | undefined,
  ...props
}: UpsertIssueDialogProps) => {
  const onSubmit = cond([
    [equals('CREATE'), constant(onCreate!)],
    [equals('EDIT'), constant(onEdit!)],
    [equals('INSERT_ABOVE'), constant(onInsertAbove!)],
    [equals('INSERT_BELOW'), constant(onInsertBelow!)],
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
                    fullWidth
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
                    fullWidth
                    inputProps={{
                      sx: {
                        cursor: 'auto',
                        '::-webkit-scrollbar': {
                          width: {
                            xs: 4,
                            sm: 8,
                          },
                        },
                        '::-webkit-scrollbar-track': {
                          bgcolor: (theme: Theme) =>
                            theme.palette.secondary.light,
                          borderRadius: (theme: Theme) =>
                            theme.shape.borderRadius,
                        },
                        '::-webkit-scrollbar-thumb': {
                          bgcolor: (theme: Theme) => theme.palette.primary.main,
                          borderRadius: (theme: Theme) =>
                            theme.shape.borderRadius,
                          '&:hover': {
                            bgcolor: (theme: Theme) =>
                              theme.palette.primary.dark,
                          },
                        },
                      },
                    }}
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
