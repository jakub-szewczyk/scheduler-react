import * as STATUS from '@/modules/status'
import { renameBoardStatus, updateBoardStatuses } from '@/services/status'
import { Status, UpsertStatusDialogMode } from '@/types/status'
import { useAuth } from '@clerk/clerk-react'
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
import { useBoolean, useReadLocalStorage } from 'usehooks-ts'
import DeleteStatusDialog from './DeleteStatusDialog'
import UpsertStatusDialog from './UpsertStatusDialog'

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

  const {
    mutate: renameBoardStatusMutation,
    isLoading: isRenamingBoardStatus,
  } = useMutation(renameBoardStatus, {
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

  const handleStatusEdit = async ({ title }: Pick<Status, 'title'>) =>
    renameBoardStatusMutation({
      projectId: selectedProjectId!,
      boardId: selectedBoardId!,
      statusId: status.id,
      title,
      token: await getToken(),
    })

  const handleStatusDelete = async ({ id }: Status) =>
    updateBoardStatusesMutation({
      projectId: selectedProjectId!,
      boardId: selectedBoardId!,
      statuses: STATUS.remove(id)(statuses),
      token: await getToken(),
    })

  const handleStatusInsertBefore = async ({ title }: Pick<Status, 'title'>) =>
    updateBoardStatusesMutation({
      projectId: selectedProjectId!,
      boardId: selectedBoardId!,
      statuses: STATUS.insertBefore(status.id, title)(statuses),
      token: await getToken(),
    })

  const handleStatusInsertAfter = async ({ title }: Pick<Status, 'title'>) =>
    updateBoardStatusesMutation({
      projectId: selectedProjectId!,
      boardId: selectedBoardId!,
      statuses: STATUS.insertAfter(status.id, title)(statuses),
      token: await getToken(),
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
        loading={isUpdatingBoardStatuses || isRenamingBoardStatus}
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
