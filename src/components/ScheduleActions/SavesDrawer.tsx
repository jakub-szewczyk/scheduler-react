import AddIcon from '@mui/icons-material/Add'
import ViewListIcon from '@mui/icons-material/ViewList'
import {
  Button,
  Drawer,
  DrawerProps,
  ListItemButton,
  Stack,
  Typography,
} from '@mui/material'
import Avatar from '@mui/material/Avatar'
import List from '@mui/material/List'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import { formatDistanceToNow } from 'date-fns'
import { map } from 'ramda'
import { Schedule } from '../Schedule/types/Schedule.types'
import unsavedScheduleAsteriskSuffix from './functions/unsavedScheduleAsteriskSuffix'

interface SavesDrawerProps extends DrawerProps {
  schedules: Schedule[]
}

const SavesDrawer = ({ schedules, ...props }: SavesDrawerProps) => (
  <Drawer
    {...props}
    anchor='right'
    PaperProps={{
      sx: { width: 320 },
    }}
  >
    <Stack padding={2} justifyContent='space-between' height='100%'>
      <Stack spacing={2}>
        <Typography variant='h6' align='center'>
          Create or load schedules
        </Typography>
        <List
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 1,
          }}
        >
          {map(
            (schedule) => (
              <ListItemButton key={schedule.name}>
                <ListItemAvatar>
                  <Avatar>
                    <ViewListIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={unsavedScheduleAsteriskSuffix(schedule.name)}
                  secondary={formatDistanceToNow(new Date(schedule.createdAt), {
                    addSuffix: true,
                  })}
                />
              </ListItemButton>
            ),
            schedules
          )}
        </List>
      </Stack>
      <Button variant='outlined' endIcon={<AddIcon />} fullWidth>
        New schedule
      </Button>
    </Stack>
  </Drawer>
)

export default SavesDrawer
