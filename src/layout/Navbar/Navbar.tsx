import { getAllProjects } from '@/services/project'
import { useAuth } from '@clerk/clerk-react'
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
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import ProfileMenu from './ProfileMenu'
import WidgetsMenu from './WidgetsMenu'
import { useLocalStorage } from 'usehooks-ts'

const Navbar = () => {
  const [selectedProjectId, setSelectedProjectId] = useLocalStorage<
    string | null
  >('selectedProjectId', null)

  const navigate = useNavigate()

  const { isSignedIn, getToken } = useAuth()

  const { data: projects, isSuccess } = useQuery(
    ['projects'],
    async () => getAllProjects(await getToken()),
    {
      enabled: !!isSignedIn,
      onSuccess: (projects) => {
        if (
          selectedProjectId &&
          projects.map((project) => project.id).includes(selectedProjectId)
        )
          return
        setSelectedProjectId(projects[0].id)
      },
    }
  )

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
          {isSignedIn && isSuccess && (
            <>
              <Select
                size='small'
                variant='standard'
                value={selectedProjectId || ''} // NOTE: https://tinyurl.com/yem9vdhy
                onChange={(event) => setSelectedProjectId(event.target.value)}
                disabled={projects.length === 0} // TODO: Might be a temporary condition.
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
                    key={project.id}
                    value={project.id}
                    sx={{
                      maxWidth: 240,
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'clip',
                    }}
                  >
                    <Typography variant='inherit' noWrap>
                      {project.name}
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
              <Stack
                direction='row'
                alignItems='center'
                columnGap={1}
                marginLeft='auto'
              >
                <WidgetsMenu />
                <ProfileMenu />
              </Stack>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Navbar
