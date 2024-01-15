import * as STATUS from '@/modules/status'
import { updateBoardStatus, updateBoardStatuses } from '@/services/status'
import { Status, UpsertStatusDialogMode } from '@/types/status'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
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
import DeleteStatusDialog from './DeleteStatusDialog'
import UpsertStatusDialog from './UpsertStatusDialog'

type Params = {
  projectId: string
  boardId: string
}

interface StatusActionsMenuProps {
  status: Status
  statuses: Status[]
  disabled?: boolean
}

const StatusActionsMenu = ({
  status,
  statuses,
  disabled,
}: StatusActionsMenuProps) => {
  const [menu, setMenu] = useState<HTMLElement | null>(null)

  const [mode, setMode] =
    useState<Exclude<UpsertStatusDialogMode, 'CREATE'>>('EDIT')

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

  const {
    mutate: updateBoardStatusMutation,
    isLoading: isUpdatingBoardStatus,
  } = useMutation(updateBoardStatus, {
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

  const handleInsertBeforeMenuItemClick = () => {
    setMenu(null)
    setMode('INSERT_BEFORE')
    openUpsertDialog()
  }

  const handleInsertAfterMenuItemClick = () => {
    setMenu(null)
    setMode('INSERT_AFTER')
    openUpsertDialog()
  }

  const handleStatusEdit = ({ title }: Pick<Status, 'title'>) =>
    updateBoardStatusMutation({
      projectId: params.projectId!,
      boardId: params.boardId!,
      statusId: status.id,
      title,
    })

  const handleStatusDelete = async ({ id }: Status) =>
    updateBoardStatusesMutation({
      projectId: params.projectId!,
      boardId: params.boardId!,
      statuses: STATUS.remove(id)(statuses),
    })

  const handleStatusInsertBefore = ({ title }: Pick<Status, 'title'>) =>
    updateBoardStatusesMutation({
      projectId: params.projectId!,
      boardId: params.boardId!,
      statuses: STATUS.insertBefore(status.id, title)(statuses),
    })

  const handleStatusInsertAfter = ({ title }: Pick<Status, 'title'>) =>
    updateBoardStatusesMutation({
      projectId: params.projectId!,
      boardId: params.boardId!,
      statuses: STATUS.insertAfter(status.id, title)(statuses),
    })

  return (
    <>
      <IconButton
        size='small'
        disabled={disabled}
        onClick={(event) => setMenu(event.currentTarget)}
        sx={{
          position: 'absolute',
          top: '50%',
          right: 8,
          translate: '0 -50%',
          color: 'inherit',
          ':disabled': {
            color: 'rgba(0, 0, 0, 0.3)',
          },
        }}
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
        <MenuItem onClick={handleInsertBeforeMenuItemClick}>
          <ListItemIcon>
            <ArrowBackIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText>Insert before</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleInsertAfterMenuItemClick}>
          <ListItemIcon>
            <ArrowForwardIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText>Insert after</ListItemText>
        </MenuItem>
      </Menu>
      <UpsertStatusDialog
        mode={mode}
        open={isUpsertDialogOpen}
        onClose={closeUpsertDialog}
        status={status}
        statuses={statuses}
        loading={isUpdatingBoardStatuses || isUpdatingBoardStatus}
        onEdit={handleStatusEdit}
        onInsertBefore={handleStatusInsertBefore}
        onInsertAfter={handleStatusInsertAfter}
      />
      <DeleteStatusDialog
        open={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        status={status}
        loading={isUpdatingBoardStatuses}
        onDelete={handleStatusDelete}
      />
    </>
  )
}

export default StatusActionsMenu
