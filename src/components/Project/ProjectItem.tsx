import useBoards from '@/hooks/useBoards'
import useNotes from '@/hooks/useNotes'
import useSchedules from '@/hooks/useSchedules'
import * as BOARD from '@/modules/board'
import { asteriskSuffix, isUnsaved } from '@/modules/common'
import * as NOTE from '@/modules/note'
import * as PROJECT from '@/modules/project'
import * as SCHEDULE from '@/modules/schedule'
import { BoardsEndomorphism } from '@/types/board'
import { NotesEndomorphism } from '@/types/note'
import { Project } from '@/types/project'
import { SchedulesEndomorphism } from '@/types/schedule'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
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
import { formatDistanceToNow } from 'date-fns'
import { pipe } from 'fp-ts/lib/function'
import { __, any, concat, map, trim } from 'ramda'
import { Dispatch, MouseEventHandler, SetStateAction } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBoolean } from 'usehooks-ts'
import SaveProjectDialog from './SaveProjectDialog'
import DeleteProjectDialog from './DeleteProjectDialog'

interface ProjectItemProps {
  project: Project
  projects: Project[]
  setProjects: Dispatch<SetStateAction<Project[]>>
}

const ProjectItem = ({ project, projects, setProjects }: ProjectItemProps) => {
  const navigate = useNavigate()

  const { setNotes } = useNotes()
  const { setBoards } = useBoards()
  const { setSchedules } = useSchedules()

  const {
    value: isSaveProjectDialogOpen,
    setFalse: closeSaveProjectDialog,
    setTrue: openSaveProjectDialog,
  } = useBoolean()

  const {
    value: isDeleteProjectDialogOpen,
    setFalse: closeDeleteProjectDialog,
    setTrue: openDeleteProjectDialog,
  } = useBoolean()

  const handleCreateIconButtonClick:
    | MouseEventHandler<HTMLButtonElement>
    | undefined = (event) => {
    event.stopPropagation()
    setProjects(PROJECT.create)
    setNotes(concat(__, NOTE.initialValues()))
    setBoards(concat(__, BOARD.initialValues()))
    setSchedules(concat(__, SCHEDULE.initialValues()))
  }

  const handleSaveIconButtonClick:
    | MouseEventHandler<HTMLButtonElement>
    | undefined = (event) => {
    event.stopPropagation()
    openSaveProjectDialog()
  }

  const handleDeleteIconButtonClick:
    | MouseEventHandler<HTMLButtonElement>
    | undefined = (event) => {
    event.stopPropagation()
    openDeleteProjectDialog()
  }

  const handleProjectSave = ({ name }: { name: string }) => {
    setProjects(pipe(name, trim, PROJECT.save(project.name)))
    setNotes(
      map(
        pipe(name, trim, PROJECT.updateForeignKey(project))
      ) as NotesEndomorphism
    )
    setBoards(
      map(
        pipe(name, trim, PROJECT.updateForeignKey(project))
      ) as BoardsEndomorphism
    )
    setSchedules(
      map(
        pipe(name, trim, PROJECT.updateForeignKey(project))
      ) as SchedulesEndomorphism
    )
    closeSaveProjectDialog()
  }

  const handleProjectDelete = (name: string) => {
    setProjects(PROJECT.remove(name))
    setNotes(PROJECT.cascadeDelete(name) as NotesEndomorphism)
    setBoards(PROJECT.cascadeDelete(name) as BoardsEndomorphism)
    setSchedules(PROJECT.cascadeDelete(name) as SchedulesEndomorphism)
    closeDeleteProjectDialog()
  }

  return (
    <>
      <Card
        elevation={0}
        onClick={() => {
          setProjects(PROJECT.select(project.name))
          navigate('/schedules')
        }}
        sx={{
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
          title={asteriskSuffix(project.name)}
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
        <CardContent sx={{ pb: '1rem !important' }}>
          <Typography
            sx={{
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: '2',
              WebkitBoxOrient: 'vertical',
            }}
          >
            {project.description}
          </Typography>
        </CardContent>
        <CardActions
          disableSpacing
          sx={{
            '.MuiSvgIcon-root': {
              ...(project.selected && {
                fill: (theme) => theme.palette.common.black,
              }),
            },
          }}
        >
          <Tooltip
            placement='left'
            title={
              any(isUnsaved, projects) &&
              'All projects must be saved before creating a new one'
            }
          >
            <Box
              onClick={(event) =>
                any(isUnsaved, projects) && event.stopPropagation()
              }
            >
              <IconButton
                disabled={any(isUnsaved, projects)}
                onClick={handleCreateIconButtonClick}
                sx={{
                  '.MuiSvgIcon-root': {
                    ...(project.selected &&
                      any(isUnsaved, projects) && {
                        fill: 'rgba(0, 0, 0, 0.3)',
                      }),
                  },
                }}
              >
                <AddIcon fontSize='small' />
              </IconButton>
            </Box>
          </Tooltip>
          <IconButton onClick={handleSaveIconButtonClick}>
            {isUnsaved(project) ? (
              <SaveIcon fontSize='small' />
            ) : (
              <EditIcon fontSize='small' />
            )}
          </IconButton>
          <Tooltip
            placement='left'
            title={projects.length === 1 && 'At least one project is required'}
          >
            <Box
              onClick={(event) =>
                projects.length === 1 && event.stopPropagation()
              }
            >
              <IconButton
                disabled={projects.length === 1}
                onClick={handleDeleteIconButtonClick}
                sx={{
                  '.MuiSvgIcon-root': {
                    ...(project.selected &&
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
      <SaveProjectDialog
        open={isSaveProjectDialogOpen}
        onClose={closeSaveProjectDialog}
        project={project}
        projects={projects}
        onSave={handleProjectSave}
      />
      <DeleteProjectDialog
        open={isDeleteProjectDialogOpen}
        onClose={closeDeleteProjectDialog}
        project={project}
        onDelete={handleProjectDelete}
      />
    </>
  )
}

export default ProjectItem
