import { Issue, UpsertIssueDialogMode, UpsertedIssue } from '@/types/issue'
import * as ISSUE from '@/modules/issue'
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
import { useState } from 'react'
import { useBoolean, useReadLocalStorage } from 'usehooks-ts'
import DeleteIssueDialog from './DeleteIssueDialog'
import UpsertIssueDialog from './UpsertIssueDialog'
import { useAuth } from '@clerk/clerk-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateBoardStatuses } from '@/services/status'
import { updateBoardIssue } from '@/services/issue'

interface IssueActionsMenuProps {
  issue: Issue
  statuses: Status[]
  disabled?: boolean
}

const IssueActionsMenu = ({
  issue,
  statuses,
  disabled,
}: IssueActionsMenuProps) => {
  const [menu, setMenu] = useState<HTMLElement | null>(null)

  const [mode, setMode] =
    useState<Exclude<UpsertIssueDialogMode, 'CREATE'>>('EDIT')

  const selectedProjectId = useReadLocalStorage<string | null>(
    'selectedProjectId'
  )

  const selectedBoardId = useReadLocalStorage<string | null>('selectedBoardId')

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

  const { getToken } = useAuth()

  const queryClient = useQueryClient()

  const {
    mutate: updateBoardStatusesMutation,
    isLoading: isUpdatingBoardStatuses,
  } = useMutation(updateBoardStatuses, {
    onSuccess: () => {
      queryClient.invalidateQueries(
        ['projects', selectedProjectId, 'boards', selectedBoardId],
        { exact: true }
      )
      closeUpsertDialog()
      closeDeleteDialog()
    },
  })

  const { mutate: updateBoardIssueMutation, isLoading: isUpdatingBoardIssue } =
    useMutation(updateBoardIssue, {
      onSuccess: () => {
        queryClient.invalidateQueries(
          ['projects', selectedProjectId, 'boards', selectedBoardId],
          { exact: true }
        )
        closeUpsertDialog()
      },
    })

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

  const handleIssueEdit = async ({ title, content }: UpsertedIssue) =>
    updateBoardIssueMutation({
      projectId: selectedProjectId!,
      boardId: selectedBoardId!,
      statusId: statuses.find((status) =>
        status.issues.map((issue) => issue.id).includes(issue.id)
      )!.id,
      issueId: issue.id,
      title,
      content,
      token: await getToken(),
    })

  const handleIssueDelete = async ({ id }: Issue) =>
    updateBoardStatusesMutation({
      projectId: selectedProjectId!,
      boardId: selectedBoardId!,
      statuses: ISSUE.remove(id)(statuses),
      token: await getToken(),
    })

  const handleIssueInsertAbove = async (values: UpsertedIssue) =>
    updateBoardStatusesMutation({
      projectId: selectedProjectId!,
      boardId: selectedBoardId!,
      statuses: ISSUE.insertAbove(issue.id, values)(statuses),
      token: await getToken(),
    })

  const handleIssueInsertBelow = async (values: UpsertedIssue) =>
    updateBoardStatusesMutation({
      projectId: selectedProjectId!,
      boardId: selectedBoardId!,
      statuses: ISSUE.insertBelow(issue.id, values)(statuses),
      token: await getToken(),
    })

  return (
    <>
      <IconButton
        size='small'
        disabled={disabled}
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
        loading={isUpdatingBoardStatuses || isUpdatingBoardIssue}
        onEdit={handleIssueEdit}
        onInsertAbove={handleIssueInsertAbove}
        onInsertBelow={handleIssueInsertBelow}
      />
      <DeleteIssueDialog
        open={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        issue={issue}
        loading={isUpdatingBoardStatuses}
        onDelete={handleIssueDelete}
      />
    </>
  )
}

export default IssueActionsMenu
