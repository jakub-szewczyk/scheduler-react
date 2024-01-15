import * as ISSUE from '@/modules/issue'
import { updateBoardIssue } from '@/services/issue'
import { updateBoardStatuses } from '@/services/status'
import { Issue, UpsertIssueDialogMode, UpsertedIssue } from '@/types/issue'
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
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useBoolean } from 'usehooks-ts'
import DeleteIssueDialog from './DeleteIssueDialog'
import UpsertIssueDialog from './UpsertIssueDialog'

type Params = {
  projectId: string
  boardId: string
}

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

  const params = useParams<Params>()

  const queryClient = useQueryClient()

  const {
    mutate: updateBoardStatusesMutation,
    isLoading: isUpdatingBoardStatuses,
  } = useMutation(updateBoardStatuses, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(
        ['projects', params.projectId, 'boards', params.boardId],
        { exact: true }
      )
      closeUpsertDialog()
      closeDeleteDialog()
    },
  })

  const { mutate: updateBoardIssueMutation, isLoading: isUpdatingBoardIssue } =
    useMutation(updateBoardIssue, {
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          ['projects', params.projectId, 'boards', params.boardId],
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

  const handleIssueEdit = ({ title, content }: UpsertedIssue) =>
    updateBoardIssueMutation({
      projectId: params.projectId!,
      boardId: params.boardId!,
      statusId: statuses.find((status) =>
        status.issues.map((issue) => issue.id).includes(issue.id)
      )!.id,
      issueId: issue.id,
      title,
      content,
    })

  const handleIssueDelete = ({ id }: Issue) =>
    updateBoardStatusesMutation({
      projectId: params.projectId!,
      boardId: params.boardId!,
      statuses: ISSUE.remove(id)(statuses),
    })

  const handleIssueInsertAbove = (values: UpsertedIssue) =>
    updateBoardStatusesMutation({
      projectId: params.projectId!,
      boardId: params.boardId!,
      statuses: ISSUE.insertAbove(issue.id, values)(statuses),
    })

  const handleIssueInsertBelow = (values: UpsertedIssue) =>
    updateBoardStatusesMutation({
      projectId: params.projectId!,
      boardId: params.boardId!,
      statuses: ISSUE.insertBelow(issue.id, values)(statuses),
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
