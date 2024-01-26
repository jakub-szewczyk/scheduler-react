import useInterceptors from '@/hooks/useInterceptors'
import { PROJECTS_PAGE_SIZE } from '@/modules/project'
import { getProjects } from '@/services/project'
import { useAuth } from '@clerk/clerk-react'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import {
  AppBar,
  Box,
  CircularProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import { useInfiniteQuery } from '@tanstack/react-query'
import { ChangeEvent, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useEventListener } from 'usehooks-ts'
import ProfileMenu from './ProfileMenu'
import WidgetsMenu from './WidgetsMenu'

type Params = {
  projectId: string
  scheduleId: string
  boardId: string
  noteId: string
}

const Navbar = () => {
  const [isScrollYOffset, setIsScrollYOffset] = useState(false)

  const [searchParams, setSearchParams] = useSearchParams()

  const params = useParams<Params>()

  const navigate = useNavigate()

  const { isSignedIn, getToken } = useAuth()

  useEventListener('scroll', () => setIsScrollYOffset(window.scrollY > 20))

  useInterceptors({
    request: {
      onFulfilled: async (config) => {
        config.headers.Authorization = `Bearer ${await getToken()}`
        return config
      },
    },
  })

  const {
    data: projects,
    isLoading: isEachProjectLoading,
    isFetching: isEachProjectFetching,
    isError: isEachProjectFetchedUnsuccessfully,
    fetchNextPage: fetchNextProjectsPage,
  } = useInfiniteQuery(
    ['infinite', 'projects', { page: 0, size: PROJECTS_PAGE_SIZE }],
    ({ pageParam = 0 }) =>
      getProjects({ page: pageParam, size: PROJECTS_PAGE_SIZE }),
    {
      enabled: !!isSignedIn,
      getNextPageParam: (lastPage) =>
        lastPage.page < Math.ceil(lastPage.total / PROJECTS_PAGE_SIZE) - 1
          ? lastPage.page + 1
          : undefined,
    }
  )

  const handleProjectChange = (event: SelectChangeEvent<string>) => {
    const project = projects?.pages
      .flatMap((page) => page.content)
      .find((project) => project.id === event.target.value)!
    setSearchParams(
      (searchParams) => ({
        ...Object.fromEntries(searchParams),
        projectId: project.id,
        projectName: project.name,
      }),
      { replace: true }
    )
    if (params.scheduleId)
      return navigate(
        {
          pathname: `/projects/${project.id}/schedules`,
          search: new URLSearchParams({
            ...Object.fromEntries(searchParams),
            projectId: project.id,
            projectName: project.name,
          }).toString(),
        },
        { replace: true }
      )
    if (params.boardId)
      return navigate(
        {
          pathname: `/projects/${project.id}/boards`,
          search: new URLSearchParams({
            ...Object.fromEntries(searchParams),
            projectId: project.id,
            projectName: project.name,
          }).toString(),
        },
        { replace: true }
      )
    if (params.noteId)
      return navigate(
        {
          pathname: `/projects/${project.id}/notes`,
          search: new URLSearchParams({
            ...Object.fromEntries(searchParams),
            projectId: project.id,
            projectName: project.name,
          }).toString(),
        },
        { replace: true }
      )
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        elevation={0}
        sx={{
          bgcolor: 'rgba(0, 0, 0, 0.35)',
          transition: 'background 0.25s',
          ...(isScrollYOffset && {
            bgcolor: 'rgba(0, 0, 0, 0.25)',
            backdropFilter: 'blur(3px)',
          }),
        }}
      >
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
            onClick={() => navigate(`/projects?${searchParams.toString()}`)}
            sx={{ cursor: 'pointer' }}
          >
            <PendingActionsIcon />
            <Typography component='div' variant='h6' sx={{ flexGrow: 1 }}>
              Scheduler
            </Typography>
          </Stack>
          {isSignedIn && (
            <>
              <Select
                size='small'
                variant='standard'
                value={searchParams.get('projectId') || ''} // NOTE: https://tinyurl.com/yem9vdhy
                disabled={
                  !searchParams.get('projectId') ||
                  isEachProjectLoading ||
                  isEachProjectFetchedUnsuccessfully
                }
                onChange={handleProjectChange}
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
                  PaperProps: {
                    onScroll: (event: ChangeEvent<HTMLDivElement>) =>
                      event.target.scrollHeight ===
                      event.target.scrollTop + event.target.clientHeight &&
                      fetchNextProjectsPage(),
                  },
                }}
              >
                {searchParams.get('projectId') &&
                  !projects?.pages
                    .flatMap((page) => page.content)
                    .map((project) => project.id)
                    .includes(searchParams.get('projectId')!) && (
                    <MenuItem
                      key={searchParams.get('projectId')}
                      value={searchParams.get('projectId')!}
                      sx={{
                        maxWidth: 240,
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'clip',
                      }}
                    >
                      <Typography variant='inherit' noWrap>
                        {searchParams.get('projectName')}
                      </Typography>
                    </MenuItem>
                  )}
                {projects?.pages
                  .flatMap((page) => page.content)
                  .map((project) => (
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
                {isEachProjectFetching && (
                  <MenuItem
                    disabled
                    sx={{
                      maxWidth: 240,
                      opacity: '1 !important',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'clip',
                    }}
                  >
                    <CircularProgress size={16} sx={{ mx: 'auto' }} />
                  </MenuItem>
                )}
              </Select>
              <Stack
                direction='row'
                alignItems='center'
                columnGap={1}
                marginLeft='auto'
              >
                <WidgetsMenu
                  iconButtonProps={{
                    disabled:
                      isEachProjectLoading ||
                      isEachProjectFetchedUnsuccessfully,
                  }}
                />
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
