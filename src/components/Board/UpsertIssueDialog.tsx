import { Issue, UpsertedIssue } from '@/types/issue'
import { Status } from '@/types/status'
import { LoadingButton } from '@mui/lab'
import { Button, Stack, Theme, Typography } from '@mui/material'
import { Field, Form, Formik, FormikHelpers } from 'formik'
import { TextField } from 'formik-mui'
import { MouseEventHandler } from 'react'
import { match } from 'ts-pattern'
import DraggableDialog, {
  DraggableDialogProps,
} from '../../layout/DraggableDialog/DraggableDialog'
import { upsertIssueValidationSchema } from './validation/validationSchema'

type SubmitHandler = (
  values: UpsertedIssue,
  formikHelpers: FormikHelpers<UpsertedIssue>
) => void

interface IssueDialogProps extends DraggableDialogProps {
  issue?: Issue
  statuses?: Status[]
  loading?: boolean
  onCreate?: SubmitHandler
  onEdit?: SubmitHandler
  onInsertAbove?: SubmitHandler
  onInsertBelow?: SubmitHandler
  onCancel?: MouseEventHandler<HTMLButtonElement> | undefined
}

interface InsertIssueDialogProps extends IssueDialogProps {
  mode: 'insert'
  statuses: Status[]
  onCreate: SubmitHandler
}

interface UpdateIssueDialogProps extends IssueDialogProps {
  mode: 'update'
  issue: Issue
  statuses: Status[]
  onEdit: SubmitHandler
}

interface InsertAboveIssueDialogProps extends IssueDialogProps {
  mode: 'insert_above'
  statuses: Status[]
  onInsertAbove: SubmitHandler
}

interface InsertBelowIssueDialogProps extends IssueDialogProps {
  mode: 'insert_below'
  statuses: Status[]
  onInsertBelow: SubmitHandler
}

type UpsertIssueDialogProps =
  | InsertIssueDialogProps
  | UpdateIssueDialogProps
  | InsertAboveIssueDialogProps
  | InsertBelowIssueDialogProps

const UpsertIssueDialog = ({
  loading = false,
  onClose,
  onCancel = onClose as MouseEventHandler<HTMLButtonElement> | undefined,
  ...props
}: UpsertIssueDialogProps) => (
  <DraggableDialog
    {...props}
    onClose={onClose}
    dialogTitle={props.mode === 'update' ? 'Edit issue' : 'Create issue'}
    dialogContent={
      <Stack spacing={3}>
        <Typography>Set issue title and description</Typography>
        <Formik
          initialValues={{
            title: props.mode === 'update' ? props.issue.title : '',
            content: props.mode === 'update' ? props.issue.content : '',
          }}
          validationSchema={upsertIssueValidationSchema}
          onSubmit={match(props)
            .with({ mode: 'insert' }, (props) => props.onCreate)
            .with({ mode: 'update' }, (props) => props.onEdit)
            .with({ mode: 'insert_above' }, (props) => props.onInsertAbove)
            .with({ mode: 'insert_below' }, (props) => props.onInsertBelow)
            .exhaustive()}
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
                          bgcolor: (theme: Theme) => theme.palette.primary.dark,
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
        <LoadingButton
          type='submit'
          form='issue'
          variant='outlined'
          loading={loading}
        >
          Save
        </LoadingButton>
      </>
    }
  />
)

export default UpsertIssueDialog
