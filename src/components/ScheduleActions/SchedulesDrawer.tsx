import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import ViewListIcon from '@mui/icons-material/ViewList'
import {
  Box,
  Button,
  Drawer,
  DrawerProps,
  IconButton,
  ListItemButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import Avatar from '@mui/material/Avatar'
import List from '@mui/material/List'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import { formatDistanceToNow } from 'date-fns'
import { any, map } from 'ramda'
import { MouseEventHandler } from 'react'
import * as SCHEDULE from '../../modules/schedule'
import { Schedule } from '../../types/schedule'

interface SchedulesDrawerProps extends Omit<DrawerProps, 'onSelect'> {
  schedule: Schedule
  schedules: Schedule[]
  onCreate: MouseEventHandler<HTMLButtonElement> | undefined
  onDelete: (name: string) => void
  onSelect: (name: string) => void
}

const SchedulesDrawer = ({
  schedule,
  schedules,
  onCreate,
  onDelete,
  onSelect,
  ...props
}: SchedulesDrawerProps) => (
  <Drawer
    {...props}
    anchor='right'
    PaperProps={{
      sx: { width: 320 },
    }}
  >
    <Stack padding={2} justifyContent='space-between' height='100%' rowGap={2}>
      <Stack spacing={2} overflow='auto'>
        <Typography variant='h6' align='center'>
          Create or load schedules
        </Typography>
        <List
          sx={{
            overflow: 'auto',
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 1,
          }}
        >
          {map(
            (schedule) => (
              <Stack key={schedule.name} direction='row' alignItems='start'>
                <ListItemButton onClick={() => onSelect(schedule.name)}>
                  <ListItemAvatar>
                    <Avatar>
                      <ViewListIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={SCHEDULE.asteriskSuffix(schedule.name)}
                    secondary={formatDistanceToNow(
                      new Date(schedule.createdAt),
                      {
                        addSuffix: true,
                      }
                    )}
                    sx={{
                      '.MuiTypography-root': {
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis', // TODO: Test app-wide against long strings
                      },
                    }}
                  />
                </ListItemButton>
                <Tooltip
                  placement='left'
                  title={
                    schedules.length === 1 &&
                    'At least one schedule is required'
                  }
                >
                  <Box>
                    <IconButton
                      size='small'
                      disabled={schedules.length === 1}
                      onClick={() => onDelete(schedule.name)}
                    >
                      <CloseIcon fontSize='small' />
                    </IconButton>
                  </Box>
                </Tooltip>
              </Stack>
            ),
            schedules
          )}
        </List>
      </Stack>
      <Tooltip
        title={
          SCHEDULE.isUnsaved(schedule) &&
          'All schedules must be saved before creating a new one'
        }
      >
        <Box>
          <Button
            variant='outlined'
            endIcon={<AddIcon />}
            disabled={any(SCHEDULE.isUnsaved, schedules)}
            onClick={onCreate}
            fullWidth
          >
            New schedule
          </Button>
        </Box>
      </Tooltip>
    </Stack>
  </Drawer>
)

export default SchedulesDrawer
