import { Project } from '@/types/project'
import { Button, Stack, Typography } from '@mui/material'
import { Field, Form, Formik, FormikHelpers } from 'formik'
import { TextField } from 'formik-mui'
import { MouseEventHandler } from 'react'
import DraggableDialog, {
  DraggableDialogProps,
} from '../../layout/DraggableDialog/DraggableDialog'
import { isUnsaved } from '../../modules/common'
import validationSchema from './validation/validationSchema'

interface SaveProjectDialogProps extends DraggableDialogProps {
  project: Project
  projects: Project[]
  onSave: (
    values: { name: string },
    formikHelpers: FormikHelpers<{ name: string }>
  ) => void
  onCancel?: MouseEventHandler<HTMLButtonElement> | undefined
}

const SaveProjectDialog = ({
  project,
  projects,
  onSave,
  onClose,
  onCancel = onClose as MouseEventHandler<HTMLButtonElement> | undefined,
  ...props
}: SaveProjectDialogProps) => (
  <DraggableDialog
    {...props}
    onClose={onClose}
    dialogTitle={isUnsaved(project) ? 'Save project' : 'Rename project'}
    dialogContent={
      <Stack spacing={3}>
        <Typography>Choose a name for your project</Typography>
        <Formik
          initialValues={{
            name: isUnsaved(project) ? '' : project.name,
          }}
          validationSchema={validationSchema(project, projects)}
          onSubmit={onSave}
        >
          {() => (
            <Form id='project'>
              <Field
                component={TextField}
                name='name'
                size='small'
                label='Name'
                helperText='Set project name'
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
        <Button type='submit' form='project' variant='outlined'>
          Save
        </Button>
      </>
    }
  />
)

export default SaveProjectDialog
