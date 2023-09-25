import CloseIcon from '@mui/icons-material/Close'
import ViewListIcon from '@mui/icons-material/ViewList'
import { Box, IconButton, ListItemButton, Stack, Tooltip } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import { formatDistanceToNow } from 'date-fns'
import { useBoolean, useReadLocalStorage } from 'usehooks-ts'
import { Schedule } from '../../types/schedule'
import DeleteScheduleDialog from './DeleteScheduleDialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { deleteSchedule } from '@/services/schedule'

interface SchedulesDrawerItemProps {
  schedule: Pick<Schedule, 'id' | 'createdAt' | 'name'>
  schedules: Pick<Schedule, 'id' | 'createdAt' | 'name'>[]
  onSelect: (scheduleId: string) => void
}

const SchedulesDrawerItem = ({
  schedule,
  schedules,
  onSelect,
}: SchedulesDrawerItemProps) => {
  const selectedProjectId = useReadLocalStorage<string | null>(
    'selectedProjectId'
  )

  const selectedScheduleId = useReadLocalStorage<string | null>(
    'selectedScheduleId'
  )

  const {
    value: isDeleteScheduleDialogOpen,
    setFalse: closeDeleteScheduleDialog,
    setTrue: openDeleteScheduleDialog,
  } = useBoolean(false)

  const { getToken } = useAuth()

  const queryClient = useQueryClient()

  const { mutate: deleteScheduleMutation, isLoading: isScheduleDeleting } =
    useMutation(deleteSchedule, {
      onSuccess: () => {
        queryClient.invalidateQueries(
          ['projects', selectedProjectId, 'schedules'],
          { exact: true }
        )
        closeDeleteScheduleDialog()
      },
    })

  const handleScheduleDelete = async (scheduleId: string) =>
    deleteScheduleMutation({
      projectId: selectedProjectId!,
      scheduleId,
      token: await getToken(),
    })

  return (
    <>
      <Stack direction='row' alignItems='start'>
        <ListItemButton onClick={() => onSelect(schedule.id)}>
          <ListItemAvatar>
            <Avatar
              sx={{
                ...(schedule.id === selectedScheduleId && {
                  bgcolor: (theme) => theme.palette.primary.main,
                }),
              }}
            >
              <ViewListIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={schedule.name}
            secondary={formatDistanceToNow(new Date(schedule.createdAt), {
              addSuffix: true,
            })}
            sx={{
              '.MuiTypography-root': {
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              },
            }}
          />
        </ListItemButton>
        <Tooltip
          placement='left'
          title={schedules.length === 1 && 'At least one schedule is required'}
        >
          <Box>
            <IconButton
              size='small'
              disabled={schedules.length === 1}
              onClick={openDeleteScheduleDialog}
            >
              <CloseIcon fontSize='small' />
            </IconButton>
          </Box>
        </Tooltip>
      </Stack>
      <DeleteScheduleDialog
        open={isDeleteScheduleDialogOpen}
        onClose={closeDeleteScheduleDialog}
        schedule={schedule}
        loading={isScheduleDeleting}
        onDelete={handleScheduleDelete}
      />
    </>
  )
}

export default SchedulesDrawerItem
