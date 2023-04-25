import CloseIcon from '@mui/icons-material/Close'
import ViewListIcon from '@mui/icons-material/ViewList'
import { Box, IconButton, ListItemButton, Stack, Tooltip } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import { formatDistanceToNow } from 'date-fns'
import { useBoolean } from 'usehooks-ts'
import { asteriskSuffix } from '../../modules/common'
import { Schedule } from '../../types/schedule'
import DeleteScheduleDialog from './DeleteScheduleDialog'

interface SchedulesDrawerItemProps {
  schedule: Schedule
  schedules: Schedule[]
  onDelete: (name: string) => void
  onSelect: (name: string) => void
}

const SchedulesDrawerItem = ({
  schedule,
  schedules,
  onDelete,
  onSelect,
}: SchedulesDrawerItemProps) => {
  const {
    value: isDeleteDialogOpen,
    setFalse: closeDeleteDialog,
    setTrue: openDeleteDialog,
  } = useBoolean(false)

  return (
    <>
      <Stack direction='row' alignItems='start'>
        <ListItemButton onClick={() => onSelect(schedule.name)}>
          <ListItemAvatar>
            <Avatar
              sx={{
                ...(schedule.selected && {
                  bgcolor: (theme) => theme.palette.primary.main,
                }),
              }}
            >
              <ViewListIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={asteriskSuffix(schedule.name)}
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
              onClick={openDeleteDialog}
            >
              <CloseIcon fontSize='small' />
            </IconButton>
          </Box>
        </Tooltip>
      </Stack>
      <DeleteScheduleDialog
        open={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        schedule={schedule}
        onDelete={onDelete}
      />
    </>
  )
}

export default SchedulesDrawerItem
