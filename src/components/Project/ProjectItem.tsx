import useBoards from '@/hooks/useBoards'
import useNotes from '@/hooks/useNotes'
import useSchedules from '@/hooks/useSchedules'
import * as BOARD from '@/modules/board'
import { asteriskSuffix, isUnsaved } from '@/modules/common'
import * as NOTE from '@/modules/note'
import * as PROJECT from '@/modules/project'
import * as SCHEDULE from '@/modules/schedule'
import { Project } from '@/types/project'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
} from '@mui/material'
import { formatDistanceToNow } from 'date-fns'
import { __, concat, trim } from 'ramda'
import { Dispatch, MouseEventHandler, SetStateAction } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBoolean } from 'usehooks-ts'
import SaveProjectDialog from './SaveProjectDialog'
import { pipe } from 'fp-ts/lib/function'

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

  const handleCreateIconButtonClick:
    | MouseEventHandler<HTMLButtonElement>
    | undefined = (event) => {
    event.stopPropagation()
    setProjects(PROJECT.add)
    setNotes(concat(__, NOTE.INITIAL_VALUES))
    setBoards(concat(__, BOARD.INITIAL_VALUES))
    setSchedules(concat(__, SCHEDULE.INITIAL_VALUES))
  }

  const handleSaveIconButtonClick:
    | MouseEventHandler<HTMLButtonElement>
    | undefined = (event) => {
    event.stopPropagation()
    openSaveProjectDialog()
  }

  const handleProjectSave = ({ name }: { name: string }) => {
    setProjects(pipe(name, trim, PROJECT.save(project.name)))
    // TODO: Use one polymorphic function instead.
    setNotes(pipe(name, trim, PROJECT.updateNoteForeignKey(project)))
    setBoards(pipe(name, trim, PROJECT.updateBoardForeignKey(project)))
    setSchedules(pipe(name, trim, PROJECT.updateScheduleForeignKey(project)))
    closeSaveProjectDialog()
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
          {/* TODO: Add a tooltip explaining why the button is disabled*/}
          <IconButton
            disabled={projects.some(isUnsaved)}
            onClick={handleCreateIconButtonClick}
            sx={{
              '.MuiSvgIcon-root': {
                ...(project.selected &&
                  projects.some(isUnsaved) && { fill: 'rgba(0, 0, 0, 0.3)' }),
              },
            }}
          >
            <AddIcon fontSize='small' />
          </IconButton>
          <IconButton onClick={handleSaveIconButtonClick}>
            {isUnsaved(project) ? (
              <SaveIcon fontSize='small' />
            ) : (
              <EditIcon fontSize='small' />
            )}
          </IconButton>
          <IconButton onClick={(event) => event.stopPropagation()}>
            <DeleteIcon fontSize='small' />
          </IconButton>
        </CardActions>
      </Card>
      <SaveProjectDialog
        open={isSaveProjectDialogOpen}
        onClose={closeSaveProjectDialog}
        project={project}
        projects={projects}
        onSave={handleProjectSave}
      />
      {/* TODO: Edit and delete confirmation dialogs */}
    </>
  )
}

export default ProjectItem
