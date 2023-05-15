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
            sx={{ minWidth: 80, width: 120, maxWidth: 120 }}
            MenuProps={{
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
              transformOrigin: {
                vertical: 'top',
                horizontal: 'left',
              },
              sx: {
                maxHeight: 320,
                '.MuiPaper-root': {
                  '::-webkit-scrollbar': {
                    width: {
                      xs: 4,
                      sm: 8,
                    },
                  },
                  '::-webkit-scrollbar-track': {
                    bgcolor: (theme) => theme.palette.secondary.light,
                    borderRadius: (theme) => theme.shape.borderRadius,
                  },
                  '::-webkit-scrollbar-thumb': {
                    bgcolor: (theme) => theme.palette.primary.main,
                    borderRadius: (theme) => theme.shape.borderRadius,
                    '&:hover': {
                      bgcolor: (theme) => theme.palette.primary.dark,
                    },
                  },
                },
              },
            }}
          >
            {projects.map((project) => (
              <MenuItem
                key={project.name}
                value={project.name}
                sx={{
                  maxWidth: 240,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'clip',
                }}
              >
                <Typography variant='inherit' noWrap>
                  {asteriskSuffix(project.name)}
                </Typography>
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
