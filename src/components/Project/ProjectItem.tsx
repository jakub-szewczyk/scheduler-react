import { asteriskSuffix } from '@/modules/common'
import * as PROJECT from '@/modules/project'
import { Project } from '@/types/project'
import { Card, CardContent, CardHeader, Typography } from '@mui/material'
import { formatDistanceToNow } from 'date-fns'
import { Dispatch, SetStateAction } from 'react'
import ProjectActionsMenu from './ProjectActionsMenu'

interface ProjectItemProps {
  project: Project
  projects: Project[]
  setProjects: Dispatch<SetStateAction<Project[]>>
}

const ProjectItem = ({ project, projects, setProjects }: ProjectItemProps) => (
  <Card
    // TODO: Event propagation selects the project when dragging or closing a dialog.
    onClick={() => setProjects(PROJECT.select(project.name))}
    sx={{
      width: {
        xs: '100%',
        sm: 280,
      },
      height: 140,
      ...(project.selected && {
        color: (theme) => theme.palette.common.black,
      }),
      ...(project.selected && {
        bgcolor: (theme) => theme.palette.primary.main,
      }),
      cursor: 'pointer',
      '&:hover': {
        bgcolor: (theme) =>
          project.selected
            ? theme.palette.primary.dark
            : theme.palette.secondary.main,
      },
    }}
  >
    <CardHeader
      title={asteriskSuffix(project.name)}
      subheader={formatDistanceToNow(new Date(project.createdAt), {
        addSuffix: true,
      })}
      action={
        <ProjectActionsMenu
          project={project}
          projects={projects}
          setProjects={setProjects}
        />
      }
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
  </Card>
)

export default ProjectItem
