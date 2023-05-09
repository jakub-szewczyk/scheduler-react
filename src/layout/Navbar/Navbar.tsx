import useProjects from '@/hooks/useProjects'
import { asteriskSuffix } from '@/modules/common'
import * as PROJECT from '@/modules/project'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import {
  AppBar,
  Box,
  MenuItem,
  Select,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import WidgetsMenu from './WidgetsMenu'

const Navbar = () => {
  const navigate = useNavigate()

  const { project, projects, setProjects } = useProjects()

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar elevation={0}>
        <Toolbar
          sx={{
            columnGap: {
              xs: 2,
              sm: 3,
            },
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
          <Select
            size='small'
            variant='standard'
            value={project.name}
            onChange={(event) =>
              setProjects(PROJECT.select(event.target.value))
            }
            sx={{ width: 120 }}
          >
            {projects.map((project) => (
              <MenuItem key={project.name} value={project.name}>
                {asteriskSuffix(project.name)}
              </MenuItem>
            ))}
          </Select>
          <Stack marginLeft='auto'>
            <WidgetsMenu />
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Navbar
