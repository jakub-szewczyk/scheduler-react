import { createProject, deleteProject, updateProject } from '@/services/project'
import { Project } from '@/types/project'
import { useAuth } from '@clerk/clerk-react'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { MouseEventHandler } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBoolean } from 'usehooks-ts'
import DeleteProjectDialog from './DeleteProjectDialog'
import UpsertProjectDialog, { InitialValues } from './UpsertProjectDialog'
import { FormikHelpers } from 'formik'

interface ProjectItemProps {
  project: Project
}

const ProjectItem = ({ project }: ProjectItemProps) => {
  const {
    value: isSaveProjectDialogOpen,
    setFalse: closeSaveProjectDialog,
    setTrue: openSaveProjectDialog,
  } = useBoolean()

  const {
    value: isEditProjectDialogOpen,
    setFalse: closeEditProjectDialog,
    setTrue: openEditProjectDialog,
  } = useBoolean()

  const {
    value: isDeleteProjectDialogOpen,
    setFalse: closeDeleteProjectDialog,
    setTrue: openDeleteProjectDialog,
  } = useBoolean()

  const { getToken } = useAuth()

  const navigate = useNavigate()

  const queryClient = useQueryClient()

  const { mutate: createProjectMutation, isLoading: isCreatingProject } =
    useMutation(
      async (data: Pick<Project, 'name' | 'description'>) =>
        createProject(await getToken(), data),
      {
        onSuccess: () => {
          queryClient.invalidateQueries(['projects'])
          closeSaveProjectDialog()
        },
      }
    )

  const { mutate: updateProjectMutation, isLoading: isUpdatingProject } =
    useMutation(
      async (data: Pick<Project, 'id' | 'name' | 'description'>) =>
        updateProject(await getToken(), data),
      {
        onSuccess: () => {
          queryClient.invalidateQueries(['projects'])
          closeEditProjectDialog()
        },
      }
    )

  const { mutate: deleteProjectMutation, isLoading: isDeletingProject } =
    useMutation(
      async (data: Pick<Project, 'id'>) =>
        deleteProject(await getToken(), data),
      {
        onSuccess: () => {
          queryClient.invalidateQueries(['projects'])
          closeDeleteProjectDialog()
        },
      }
    )

  const handleSaveIconButtonClick:
    | MouseEventHandler<HTMLButtonElement>
    | undefined = (event) => {
    event.stopPropagation()
    openSaveProjectDialog()
  }

  const handleEditIconButtonClick:
    | MouseEventHandler<HTMLButtonElement>
    | undefined = (event) => {
    event.stopPropagation()
    openEditProjectDialog()
  }

  const handleDeleteIconButtonClick:
    | MouseEventHandler<HTMLButtonElement>
    | undefined = (event) => {
    event.stopPropagation()
    openDeleteProjectDialog()
  }

  const handleProjectSelect = () => {
    // TODO: Handle project select
    navigate('/schedules')
  }

  const handleProjectSave = (
    { name, description }: InitialValues,
    { setSubmitting }: FormikHelpers<InitialValues>
  ) =>
    createProjectMutation(
      { name, ...(description && { description }) },
      { onError: () => setSubmitting(false) }
    )

  const handleProjectEdit = (
    { name, description }: InitialValues,
    { setSubmitting }: FormikHelpers<InitialValues>
  ) =>
    updateProjectMutation(
      { id: project.id, name, ...(description && { description }) },
      { onError: () => setSubmitting(false) }
    )

  const handleProjectDelete = () => deleteProjectMutation({ id: project.id })

  return (
    <>
      <Card
        elevation={0}
        onClick={handleProjectSelect}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          cursor: 'pointer',
          ...(project.selected && {
            color: (theme) => theme.palette.common.black,
          }),
          ...(project.selected && {
            bgcolor: (theme) => theme.palette.primary.main,
          }),
          '&:hover': {
            bgcolor: (theme) =>
              project.selected
                ? theme.palette.primary.dark
                : 'rgba(255, 255, 255, 0.08)',
          },
        }}
      >
        <CardHeader
          title={project.name}
          subheader={formatDistanceToNow(new Date(project.createdAt), {
            addSuffix: true,
          })}
          titleTypographyProps={{
            variant: 'body1',
            noWrap: true,
          }}
          subheaderTypographyProps={{
            variant: 'body2',
            noWrap: true,
          }}
          sx={{
            pb: 0,
            ...(project.selected && {
              '.MuiCardHeader-subheader': {
                color: (theme) => theme.palette.grey['900'],
              },
            }),
            '.MuiCardHeader-content': {
              width: 'calc(100% - 60px)',
            },
          }}
        />
        <CardContent sx={{ pb: '0.5rem !important' }}>
          <Typography
            sx={{
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: '1',
              WebkitBoxOrient: 'vertical',
            }}
          >
            {project.description}
          </Typography>
        </CardContent>
        <CardActions
          disableSpacing
          sx={{
            mt: 'auto',
            '.MuiSvgIcon-root': {
              ...(project.selected && {
                fill: (theme) => theme.palette.common.black,
              }),
            },
          }}
        >
          {/* <Tooltip
            placement='left'
            title={
              any(isUnsaved, projects) &&
              'All projects must be saved before creating a new one'
            }
          > */}
          <Box
            onClick={(event) => isCreatingProject && event.stopPropagation()}
          >
            <IconButton
              // disabled={any(isUnsaved, projects)}
              onClick={handleSaveIconButtonClick}
              // sx={{
              //   '.MuiSvgIcon-root': {
              //     ...(project.selected &&
              //       any(isUnsaved, projects) && {
              //         fill: 'rgba(0, 0, 0, 0.3)',
              //       }),
              //   },
              // }}
            >
              <AddIcon fontSize='small' />
            </IconButton>
          </Box>
          {/* </Tooltip> */}
          <Box
            onClick={(event) => isCreatingProject && event.stopPropagation()}
          >
            <IconButton onClick={handleEditIconButtonClick}>
              <EditIcon fontSize='small' />
            </IconButton>
          </Box>
          <Tooltip
            placement='left'
            title='Required'
            // title={projects.length === 1 && 'At least one project is required'}
          >
            <Box
              onClick={(event) => isCreatingProject && event.stopPropagation()}
            >
              <IconButton
                // disabled={projects.length === 1}
                onClick={handleDeleteIconButtonClick}
                // sx={{
                //   '.MuiSvgIcon-root': {
                //     ...(project.selected &&
                //       projects.length === 1 && {
                //         fill: 'rgba(0, 0, 0, 0.3)',
                //       }),
                //   },
                // }}
              >
                <DeleteIcon fontSize='small' />
              </IconButton>
            </Box>
          </Tooltip>
        </CardActions>
      </Card>
      <UpsertProjectDialog
        mode='CREATE'
        open={isSaveProjectDialogOpen}
        onClose={closeSaveProjectDialog}
        project={project}
        loading={isCreatingProject}
        onSave={handleProjectSave}
      />
      <UpsertProjectDialog
        mode='EDIT'
        open={isEditProjectDialogOpen}
        onClose={closeEditProjectDialog}
        project={project}
        loading={isUpdatingProject}
        onEdit={handleProjectEdit}
      />
      <DeleteProjectDialog
        open={isDeleteProjectDialogOpen}
        onClose={closeDeleteProjectDialog}
        project={project}
        loading={isDeletingProject}
        onDelete={handleProjectDelete}
      />
    </>
  )
}

export default ProjectItem
