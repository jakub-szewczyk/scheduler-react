import PendingActionsIcon from '@mui/icons-material/PendingActions'
import ViewListIcon from '@mui/icons-material/ViewList'
import { AppBar, Box, Stack, Toolbar, Typography } from '@mui/material'
import { useLocation } from 'react-router-dom'
import * as SCHEDULE from '../../../modules/schedule'
import { Schedule } from '../../../types/schedule'
import WidgetsMenu from './WidgetsMenu'

interface NavbarProps {
  schedule: Schedule
}

const Navbar = ({ schedule }: NavbarProps) => {
  const { pathname } = useLocation()

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static' elevation={0}>
        <Toolbar>
          <Stack direction='row' alignItems='center' columnGap={1.5}>
            <PendingActionsIcon />
            <Typography component='div' variant='h6' sx={{ flexGrow: 1 }}>
              Scheduler
            </Typography>
          </Stack>
          <Stack
            direction='row'
            alignItems='center'
            columnGap={1.5}
            sx={{ mx: 'auto' }}
          >
            {pathname === '/' && (
              <>
                <ViewListIcon />
                <Typography
                  maxWidth={400}
                  fontStyle='italic'
                  overflow='hidden'
                  whiteSpace='nowrap'
                  textOverflow='ellipsis'
                >
                  {SCHEDULE.asteriskSuffix(schedule.name)}
                </Typography>
              </>
            )}
          </Stack>
          <Stack>
            <WidgetsMenu />
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Navbar
