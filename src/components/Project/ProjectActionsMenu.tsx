import useSchedules from '@/hooks/useSchedules'
import { isUnsaved } from '@/modules/common'
import * as PROJECT from '@/modules/project'
import * as SCHEDULE from '@/modules/schedule'
import { Project } from '@/types/project'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import SaveIcon from '@mui/icons-material/Save'
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material'
import { pipe } from 'fp-ts/lib/function'
import { __, concat, trim } from 'ramda'
import { Dispatch, SetStateAction, useState } from 'react'
import { useBoolean } from 'usehooks-ts'
import SaveProjectDialog from './SaveProjectDialog'

interface ProjectActionsMenuProps {
  project: Project
  projects: Project[]
  setProjects: Dispatch<SetStateAction<Project[]>>
}

const ProjectActionsMenu = ({
  project,
  projects,
  setProjects,
}: ProjectActionsMenuProps) => {
  const { setSchedules } = useSchedules()

  const [menu, setMenu] = useState<HTMLElement | null>(null)

  const {
    value: isSaveProjectDialogOpen,
    setFalse: closeSaveProjectDialog,
    setTrue: openSaveProjectDialog,
  } = useBoolean()

  const handleCreateMenuItemClick = () => {
    setMenu(null)
    setProjects(PROJECT.add)
    setSchedules(
      concat(
        __,
        SCHEDULE.INITIAL_VALUES.map((schedule) => ({
          ...schedule,
          project: 'unsaved',
        }))
      )
    )
    // TODO: Go through all notes, boards and schedule and update their initial values.
  }

  const handleSaveMenuItemClick = () => {
    setMenu(null)
    openSaveProjectDialog()
  }

  const handleDeleteMenuItemClick = () => {
    setMenu(null)
  }

  const handleProjectSave = ({ name }: { name: string }) => {
    setProjects(pipe(name, trim, PROJECT.save(project.name)))
    setSchedules(pipe(name, trim, PROJECT.updateScheduleForeignKey(project)))
    // TODO: Go through all notes, boards and schedule and update their foreign key.
    closeSaveProjectDialog()
  }

  return (
    <>
      <IconButton
        size='small'
        onClick={(event) => {
          event.stopPropagation()
          setMenu(event.currentTarget)
        }}
        sx={{ color: 'inherit' }}
      >
        <MoreVertIcon fontSize='small' />
      </IconButton>
      <Menu
        open={!!menu}
        anchorEl={menu}
        onClose={() => setMenu(null)}
        onClick={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <MenuItem
          onClick={handleCreateMenuItemClick}
          disabled={projects.some(isUnsaved)}
        >
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText>New</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleSaveMenuItemClick}>
          <ListItemIcon>
            {isUnsaved(project) ? <SaveIcon /> : <EditIcon />}
          </ListItemIcon>
          <ListItemText>{isUnsaved(project) ? 'Save' : 'Rename'}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteMenuItemClick}>
          <ListItemIcon>
            <DeleteIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
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

export default ProjectActionsMenu
