import { createProject, deleteProject, updateProject } from '@/services/project'
import { InitialValues, Project } from '@/types/project'
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
import { FormikHelpers } from 'formik'
import { MouseEventHandler } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBoolean, useLocalStorage } from 'usehooks-ts'
import DeleteProjectDialog from './DeleteProjectDialog'
import UpsertProjectDialog from './UpsertProjectDialog'

interface ProjectItemProps {
  project: Project
  projects: Project[]
}

const ProjectItem = ({ project, projects }: ProjectItemProps) => {
  const [selectedProjectId, setSelectedProjectId] = useLocalStorage<
    string | null
  >('selectedProjectId', null)

  const isProjectSelected = project.id === selectedProjectId

  const {
    value: isCreateProjectDialogOpen,
    setFalse: closeCreateProjectDialog,
    setTrue: openCreateProjectDialog,
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

  const navigate = useNavigate()

  const { getToken } = useAuth()

  const queryClient = useQueryClient()

  const { mutate: createProjectMutation, isLoading: isCreatingProject } =
    useMutation(
      async (data: Pick<Project, 'name' | 'description'>) =>
        createProject(await getToken(), data),
      {
        onSuccess: () => {
          queryClient.invalidateQueries(['projects'], { exact: true })
          closeCreateProjectDialog()
        },
      }
    )

  const { mutate: updateProjectMutation, isLoading: isUpdatingProject } =
    useMutation(
      async (data: Pick<Project, 'id' | 'name' | 'description'>) =>
        updateProject(await getToken(), data),
      {
        onSuccess: () => {
          queryClient.invalidateQueries(['projects'], { exact: true })
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
          queryClient.invalidateQueries(['projects'], { exact: true })
          closeDeleteProjectDialog()
        },
      }
    )

  const handleCreateIconButtonClick:
    | MouseEventHandler<HTMLButtonElement>
    | undefined = (event) => {
    event.stopPropagation()
    openCreateProjectDialog()
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
    setSelectedProjectId(project.id)
    navigate('/schedules')
  }

  const handleProjectCreate = (
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
          bgcolor: 'rgba(0, 0, 0, 0.35)',
          ...(isProjectSelected && {
            color: (theme) => theme.palette.common.black,
            bgcolor: (theme) => theme.palette.primary.main,
          }),
          '&:hover': {
            bgcolor: (theme) =>
              isProjectSelected
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
            ...(isProjectSelected && {
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
            variant='body2'
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
              ...(isProjectSelected && {
                fill: (theme) => theme.palette.common.black,
              }),
            },
          }}
        >
          <Box
            onClick={(event) => isCreatingProject && event.stopPropagation()}
          >
            <IconButton size='small' onClick={handleCreateIconButtonClick}>
              <AddIcon fontSize='small' />
            </IconButton>
          </Box>
          <Box
            onClick={(event) => isCreatingProject && event.stopPropagation()}
          >
            <IconButton size='small' onClick={handleEditIconButtonClick}>
              <EditIcon fontSize='small' />
            </IconButton>
          </Box>
          <Tooltip
            placement='left'
            title={projects.length === 1 && 'At least one project is required'}
          >
            <Box
              onClick={(event) => isCreatingProject && event.stopPropagation()}
            >
              <IconButton
                size='small'
                disabled={projects.length === 1}
                onClick={handleDeleteIconButtonClick}
                sx={{
                  '.MuiSvgIcon-root': {
                    ...(isProjectSelected &&
                      projects.length === 1 && {
                        fill: 'rgba(0, 0, 0, 0.3)',
                      }),
                  },
                }}
              >
                <DeleteIcon fontSize='small' />
              </IconButton>
            </Box>
          </Tooltip>
        </CardActions>
      </Card>
      <UpsertProjectDialog
        mode='CREATE'
        open={isCreateProjectDialogOpen}
        onClose={closeCreateProjectDialog}
        project={project}
        loading={isCreatingProject}
        onCreate={handleProjectCreate}
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
