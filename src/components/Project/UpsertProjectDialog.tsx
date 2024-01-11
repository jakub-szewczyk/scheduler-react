import { InitialValues, Project } from '@/types/project'
import { LoadingButton } from '@mui/lab'
import { Button, Stack, Theme, Typography } from '@mui/material'
import { Field, Form, Formik, FormikHelpers } from 'formik'
import { TextField } from 'formik-mui'
import { MouseEventHandler } from 'react'
import { match } from 'ts-pattern'
import DraggableDialog, {
  DraggableDialogProps,
} from '../../layout/DraggableDialog/DraggableDialog'
import validationSchema from './validation/validationSchema'

interface ProjectDialogProps extends DraggableDialogProps {
  loading?: boolean
  onCancel?: MouseEventHandler<HTMLButtonElement> | undefined
}

interface InsertProjectDialogProps {
  mode: 'insert'
  onInsert: (
    values: InitialValues,
    formikHelpers: FormikHelpers<InitialValues>
  ) => void
}

interface UpdateProjectDialogProps {
  mode: 'update'
  project: Project
  onUpdate: (
    values: InitialValues,
    formikHelpers: FormikHelpers<InitialValues>
  ) => void
}

type UpsertProjectDialogProps = ProjectDialogProps &
  (InsertProjectDialogProps | UpdateProjectDialogProps)

const UpsertProjectDialog = ({
  loading = false,
  onClose,
  onCancel = onClose as MouseEventHandler<HTMLButtonElement> | undefined,
  ...props
}: UpsertProjectDialogProps) => (
  <DraggableDialog
    {...props}
    onClose={onClose}
    dialogTitle={props.mode === 'insert' ? 'Create project' : 'Edit project'}
    dialogContent={
      <Stack spacing={3}>
        <Typography>
          Choose a name and description that best fit your project needs
        </Typography>
        <Formik
          initialValues={match(props)
            .with({ mode: 'insert' }, () => ({ name: '', description: '' }))
            .with({ mode: 'update' }, (props) => ({
              name: props.project.name,
              description: props.project.description || '',
            }))
            .exhaustive()}
          validationSchema={validationSchema}
          onSubmit={props.mode === 'insert' ? props.onInsert : props.onUpdate}
        >
          {() => (
            <Form id='project'>
              <Stack spacing={2}>
                <Field
                  component={TextField}
                  name='name'
                  size='small'
                  label='Name'
                  helperText='Set project name'
                  fullWidth
                />
                <Field
                  component={TextField}
                  name='description'
                  size='small'
                  label='Description'
                  helperText='Set project description'
                  minRows={4}
                  maxRows={4}
                  multiline
                  fullWidth
                  inputProps={{
                    sx: {
                      pr: 0.75,
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
          form='project'
          variant='outlined'
          loading={loading}
        >
          Save
        </LoadingButton>
      </>
    }
  />
)

export default UpsertProjectDialog
