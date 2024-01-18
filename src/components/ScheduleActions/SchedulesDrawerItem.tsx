import { deleteSchedule } from '@/services/schedule'
import CloseIcon from '@mui/icons-material/Close'
import ViewListIcon from '@mui/icons-material/ViewList'
import { Box, IconButton, ListItemButton, Stack, Tooltip } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useBoolean } from 'usehooks-ts'
import { Schedule } from '../../types/schedule'
import DeleteScheduleDialog from './DeleteScheduleDialog'

type Params = {
  projectId: string
  scheduleId: string
}

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
  const {
    value: isDeleteScheduleDialogOpen,
    setFalse: closeDeleteScheduleDialog,
    setTrue: openDeleteScheduleDialog,
  } = useBoolean(false)

  const [searchParams] = useSearchParams()

  const params = useParams<Params>()

  const navigate = useNavigate()

  const queryClient = useQueryClient()

  const { mutate: deleteScheduleMutation, isLoading: isScheduleDeleting } =
    useMutation(deleteSchedule, {
      onSuccess: async (schedule) => {
        await queryClient.invalidateQueries(
          ['projects', params.projectId, 'schedules'],
          { exact: true }
        )
        closeDeleteScheduleDialog()
        const isScheduleSelected = schedule.id === params.scheduleId
        const index = schedules.findIndex(({ id }) => id === schedule.id)
        if (isScheduleSelected && index === 0)
          return navigate(
            {
              pathname: `/projects/${params.projectId}/schedules/${schedules[index + 1].id
                }`,
              search: searchParams.toString(),
            },
            { replace: true }
          )
        if (isScheduleSelected && index > 0)
          return navigate(
            {
              pathname: `/projects/${params.projectId}/schedules/${schedules[index - 1].id
                }`,
              search: searchParams.toString(),
            },
            { replace: true }
          )
      },
    })

  const handleScheduleDelete = (scheduleId: string) =>
    deleteScheduleMutation({
      projectId: params.projectId!,
      scheduleId,
    })

  return (
    <>
      <Stack direction='row' alignItems='start'>
        <ListItemButton onClick={() => onSelect(schedule.id)}>
          <ListItemAvatar>
            <Avatar
              sx={{
                ...(schedule.id === params.scheduleId && {
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
