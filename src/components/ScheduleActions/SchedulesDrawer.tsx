import AddIcon from '@mui/icons-material/Add'
import {
  Box,
  Button,
  Stack,
  SwipeableDrawer,
  SwipeableDrawerProps,
  Tooltip,
  Typography,
} from '@mui/material'
import List from '@mui/material/List'
import { any } from 'ramda'
import { MouseEventHandler } from 'react'
import * as SCHEDULE from '../../modules/schedule'
import { Schedule } from '../../types/schedule'
import SchedulesDrawerItem from './SchedulesDrawerItem'

interface SchedulesDrawerProps extends Omit<SwipeableDrawerProps, 'onSelect'> {
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
  <SwipeableDrawer
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
          {schedules.map((schedule) => (
            <SchedulesDrawerItem
              key={schedule.name}
              schedule={schedule}
              schedules={schedules}
              onSelect={onSelect}
              onDelete={onDelete}
            />
          ))}
        </List>
      </Stack>
      <Tooltip
        title={
          any(SCHEDULE.isUnsaved, schedules) &&
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
  </SwipeableDrawer>
)

export default SchedulesDrawer
