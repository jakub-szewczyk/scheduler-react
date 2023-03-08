import PendingActionsIcon from '@mui/icons-material/PendingActions'
import { AppBar, Box, Stack, Toolbar, Typography } from '@mui/material'
import WidgetsMenu from './WidgetsMenu'

const Navbar = () => (
  <Box sx={{ flexGrow: 1 }}>
    <AppBar position='static' elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Stack direction='row' alignItems='center' columnGap={1.5}>
          <PendingActionsIcon />
          <Typography component='div' variant='h6' sx={{ flexGrow: 1 }}>
            Scheduler
          </Typography>
        </Stack>
        <Stack>
          <WidgetsMenu />
        </Stack>
      </Toolbar>
    </AppBar>
  </Box>
)

export default Navbar
