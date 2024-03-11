import { createProject, deleteProject, updateProject } from '@/services/project'
import { InitialValues, Project } from '@/types/project'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import {
  Box,
  Card,
  CardActionArea,
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
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useBoolean } from 'usehooks-ts'
import DeleteProjectDialog from './DeleteProjectDialog'
import UpsertProjectDialog from './UpsertProjectDialog'
import { omit } from 'ramda'

interface ProjectItemProps {
  project: Project
  disableDelete?: boolean
  onAfterCreate?: () => void
  onAfterUpdate?: () => void
  onAfterDelete?: (project: Project) => void
}

const ProjectItem = ({
  project,
  disableDelete,
  onAfterCreate,
  onAfterUpdate,
  onAfterDelete,
}: ProjectItemProps) => {
  const [searchParams, setSearchParams] = useSearchParams()

  const navigate = useNavigate()

  const isProjectSelected = project.id === searchParams.get('projectId')

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

  const queryClient = useQueryClient()

  const { mutate: createProjectMutation, isLoading: isCreatingProject } =
    useMutation(createProject, {
      onSuccess: async (project) => {
        await Promise.all([
          queryClient.invalidateQueries(['infinite']),
          queryClient.invalidateQueries(['projects']),
        ])
        closeCreateProjectDialog()
        setSearchParams(
          (searchParams) => ({
            ...omit(['search'], Object.fromEntries(searchParams)),
            projectId: project.id,
            projectName: project.name,
            page: '0',
          }),
          { replace: +searchParams.get('page')! === 0 }
        )
        onAfterCreate?.()
      },
    })

  const { mutate: updateProjectMutation, isLoading: isUpdatingProject } =
    useMutation(updateProject, {
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries(['infinite']),
          queryClient.invalidateQueries(['projects']),
        ])
        closeEditProjectDialog()
        setSearchParams(
          (searchParams) => ({
            ...Object.fromEntries(searchParams),
            projectName: project.name,
          }),
          { replace: true }
        )
        onAfterUpdate?.()
      },
    })

  const { mutate: deleteProjectMutation, isLoading: isDeletingProject } =
    useMutation(deleteProject, {
      onSuccess: async (project) => {
        await Promise.all([
          queryClient.invalidateQueries(['infinite']),
          queryClient.invalidateQueries(['projects']),
        ])
        closeDeleteProjectDialog()
        onAfterDelete?.(project)
      },
    })

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
    setSearchParams(
      (searchParams) => ({
        ...Object.fromEntries(searchParams),
        projectId: project.id,
        projectName: project.name,
      }),
      { replace: true }
    )
    navigate(
      `/projects/${project.id}/schedules?${new URLSearchParams({
        ...Object.fromEntries(searchParams),
        projectId: project.id,
        projectName: project.name,
      })}`
    )
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
        <CardActionArea>
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
              title={disableDelete && 'At least one project is required'}
            >
              <Box
                onClick={(event) =>
                  isCreatingProject && event.stopPropagation()
                }
              >
                <IconButton
                  size='small'
                  disabled={disableDelete}
                  onClick={handleDeleteIconButtonClick}
                  sx={{
                    '.MuiSvgIcon-root': {
                      ...(isProjectSelected &&
                        disableDelete && {
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
        </CardActionArea>
      </Card>
      <UpsertProjectDialog
        mode='insert'
        open={isCreateProjectDialogOpen}
        onClose={closeCreateProjectDialog}
        loading={isCreatingProject}
        onInsert={handleProjectCreate}
      />
      <UpsertProjectDialog
        mode='update'
        open={isEditProjectDialogOpen}
        onClose={closeEditProjectDialog}
        project={project}
        loading={isUpdatingProject}
        onUpdate={handleProjectEdit}
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
