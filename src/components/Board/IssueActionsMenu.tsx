import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material'
import { Dispatch, SetStateAction, useState } from 'react'
import { useBoolean } from 'usehooks-ts'
import { Issue, Status } from '../../types/board'
import EditIssueDialog from './EditIssueDialog'
import * as BOARD from '../../modules/board'
import DeleteIssueDialog from './DeleteIssueDialog'

interface IssueActionsMenuProps {
  issue: Issue
  issues: Issue[]
  setStatuses: Dispatch<SetStateAction<Status[]>>
}

const IssueActionsMenu = ({
  issue,
  issues,
  setStatuses,
}: IssueActionsMenuProps) => {
  const [menu, setMenu] = useState<HTMLElement | null>(null)
  const {
    value: isEditDialogOpen,
    setFalse: closeEditDialog,
    setTrue: openEditDialog,
  } = useBoolean(false)
  const {
    value: isDeleteDialogOpen,
    setFalse: closeDeleteDialog,
    setTrue: openDeleteDialog,
  } = useBoolean(false)

  const handleEditMenuItemClick = () => {
    setMenu(null)
    openEditDialog()
  }

  const handleDeleteMenuItemClick = () => {
    setMenu(null)
    openDeleteDialog()
  }

  const handleIssueEdit = (values: Issue) => {
    setStatuses(BOARD.editIssue(issue.title, values))
    closeEditDialog()
  }

  const handleIssueDelete = ({ title }: Issue) => {
    setStatuses(BOARD.deleteIssue(title))
    closeDeleteDialog()
  }

  return (
    <>
      <IconButton
        size='small'
        onClick={(event) => setMenu(event.currentTarget)}
      >
        <MoreVertIcon fontSize='small' />
      </IconButton>
      <Menu open={!!menu} anchorEl={menu} onClose={() => setMenu(null)}>
        <MenuItem onClick={handleEditMenuItemClick}>
          <ListItemIcon>
            <EditIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteMenuItemClick}>
          <ListItemIcon>
            <DeleteIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
      <EditIssueDialog
        open={isEditDialogOpen}
        onClose={closeEditDialog}
        issue={issue}
        issues={issues}
        onSave={handleIssueEdit}
      />
      <DeleteIssueDialog
        open={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        issue={issue}
        onDelete={handleIssueDelete}
      />
    </>
  )
}
export default IssueActionsMenu
