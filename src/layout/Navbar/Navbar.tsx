import PendingActionsIcon from '@mui/icons-material/PendingActions'
import { AppBar, Box, Stack, Toolbar, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import WidgetsMenu from './WidgetsMenu'

const Navbar = () => {
  const navigate = useNavigate()

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar elevation={0}>
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            height: {
              xs: '56px',
              sm: '64px',
            },
          }}
        >
          <Stack
            direction='row'
            alignItems='center'
            columnGap={1.5}
            height='100%'
            onClick={() => navigate('/')}
            sx={{ cursor: 'pointer' }}
          >
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
}

export default Navbar
