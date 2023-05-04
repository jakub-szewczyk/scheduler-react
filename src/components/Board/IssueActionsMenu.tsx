import { Issue, UpsertIssueDialogMode } from '@/types/issue'
import { Status } from '@/types/status'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
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
import * as ISSUE from '../../modules/issue'
import DeleteIssueDialog from './DeleteIssueDialog'
import UpsertIssueDialog from './UpsertIssueDialog'

interface IssueActionsMenuProps {
  issue: Issue
  statuses: Status[]
  setStatuses: Dispatch<SetStateAction<Status[]>>
}

const IssueActionsMenu = ({
  issue,
  statuses,
  setStatuses,
}: IssueActionsMenuProps) => {
  const [menu, setMenu] = useState<HTMLElement | null>(null)
  const [mode, setMode] =
    useState<Exclude<UpsertIssueDialogMode, 'CREATE'>>('EDIT')
  const {
    value: isUpsertDialogOpen,
    setFalse: closeUpsertDialog,
    setTrue: openUpsertDialog,
  } = useBoolean(false)
  const {
    value: isDeleteDialogOpen,
    setFalse: closeDeleteDialog,
    setTrue: openDeleteDialog,
  } = useBoolean(false)

  const handleEditMenuItemClick = () => {
    setMenu(null)
    setMode('EDIT')
    openUpsertDialog()
  }

  const handleDeleteMenuItemClick = () => {
    setMenu(null)
    openDeleteDialog()
  }

  const handleInsertAboveMenuItemClick = () => {
    setMenu(null)
    setMode('INSERT_ABOVE')
    openUpsertDialog()
  }

  const handleInsertBelowMenuItemClick = () => {
    setMenu(null)
    setMode('INSERT_BELOW')
    openUpsertDialog()
  }

  const handleIssueEdit = (values: Issue) => {
    setStatuses(ISSUE.edit(issue.title, values))
    closeUpsertDialog()
  }

  const handleIssueDelete = ({ title }: Issue) => {
    setStatuses(ISSUE.remove(title))
    closeDeleteDialog()
  }

  const handleIssueInsertAbove = (values: Issue) => {
    setStatuses(ISSUE.insertAbove(issue.title, values))
    closeUpsertDialog()
  }

  const handleIssueInsertBelow = (values: Issue) => {
    setStatuses(ISSUE.insertBelow(issue.title, values))
    closeUpsertDialog()
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
        <MenuItem onClick={handleInsertAboveMenuItemClick}>
          <ListItemIcon>
            <ArrowUpwardIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText>Insert above</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleInsertBelowMenuItemClick}>
          <ListItemIcon>
            <ArrowDownwardIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText>Insert below</ListItemText>
        </MenuItem>
      </Menu>
      <UpsertIssueDialog
        open={isUpsertDialogOpen}
        onClose={closeUpsertDialog}
        mode={mode}
        issue={issue}
        statuses={statuses}
        onEdit={handleIssueEdit}
        onInsertAbove={handleIssueInsertAbove}
        onInsertBelow={handleIssueInsertBelow}
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
