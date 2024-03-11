import ProjectItem from '@/components/Project/ProjectItem'
import { Container } from '@/components/Project/styles/Project.styles'
import { PROJECTS_PAGE_SIZE } from '@/modules/project'
import { getProjects } from '@/services/project'
import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search'
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  Pagination,
  TextField,
  Select,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { useQuery } from '@tanstack/react-query'
import { omit } from 'ramda'
import { ChangeEvent, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDebounceCallback } from 'usehooks-ts'

const Projects = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search')

  const createdAt = searchParams.get('createdAt')

  const inputRef = useRef<HTMLInputElement>()

  const projectsParams = {
    page: +searchParams.get('page')!,
    size: PROJECTS_PAGE_SIZE,
    ...(search && { name: search }),
    ...(createdAt && { createdAt }),
  }

  const {
    data: projects,
    isLoading: isEachProjectLoading,
    isSuccess: isEachProjectFetchedSuccessfully,
    isError: isEachProjectFetchedUnsuccessfully,
  } = useQuery(
    ['projects', projectsParams],
    () => getProjects(projectsParams),
    {
      onSuccess: (projects) => {
        if (
          !searchParams.get('projectId') ||
          !searchParams.get('projectName')
        ) {
          const index = searchParams.get('transitional')
            ? projects.content.length - 1
            : 0
          setSearchParams(
            (searchParams) => ({
              ...omit(['transitional'], Object.fromEntries(searchParams)),
              projectId: projects.content[index].id,
              projectName: projects.content[index].name,
            }),
            { replace: true }
          )
        }
      },
    }
  )

  const handleProjectSearchChange = useDebounceCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setSearchParams(
        (searchParams) => {
          const newSearchParams = {
            ...Object.fromEntries(searchParams),
            page: '0',
            search: event.target.value,
          } as { search?: string }
          if (!event.target.value) delete newSearchParams.search
          return newSearchParams
        },
        { replace: true }
      ),
    500
  )

  const handleProjectSearchClear = () => {
    setSearchParams(
      (searchParams) => ({
        ...omit(['search'], Object.fromEntries(searchParams)),
        page: '0',
      }),
      { replace: true }
    )
    inputRef.current!.value = ''
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: { xs: 'calc(100vh - 72px)', sm: 'calc(100vh - 88px)' },
      }}
    >
      <Container>
        {isEachProjectLoading && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <CircularProgress />
          </Box>
        )}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            columnGap: 1,
            width: '100%',
            px: 1,
            mt: { xs: 1.25, sm: 0.25 },
            mb: 1,
          }}
        >
          <TextField
            size='small'
            label='Search by name'
            fullWidth
            defaultValue={search || ''}
            onChange={handleProjectSearchChange}
            sx={{
              width: '100%',
              maxWidth: {
                xs: '100%',
                sm: 'calc(50% - 8px)',
                md: `calc(${(4 / 12) * 100}% - 10.7px)`,
                lg: 'calc(25% - 12px)',
                xl: `calc(${(2.4 / 12) * 100}% - 12.8px)`,
              },
            }}
            InputProps={{
              inputRef,
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: search ? (
                <InputAdornment position='end'>
                  <IconButton size='small' onClick={handleProjectSearchClear}>
                    <ClearIcon fontSize='small' />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
          />
          <FormControl
            size='small'
            sx={{ width: '100%', maxWidth: { xs: 100, sm: 140 } }}
          >
            <InputLabel id='createdAt' size='small'>
              Sort by date
            </InputLabel>
            <Select
              size='small'
              labelId='createdAt'
              label='Sort by date'
              defaultValue={createdAt || 'DESC'}
              onChange={(event) =>
                setSearchParams((searchParams) => ({
                  ...Object.fromEntries(searchParams),
                  createdAt: event.target.value,
                }))
              }
            >
              <MenuItem value='DESC'>Latest first</MenuItem>
              <MenuItem value='ASC'>Oldest first</MenuItem>
            </Select>
          </FormControl>
        </Box>
        {isEachProjectFetchedSuccessfully &&
          projects.content.map((project, _, array) => (
            <Grid key={project.name} xs={12} sm={6} md={4} lg={3} xl={12 / 5}>
              <ProjectItem
                project={project}
                onAfterCreate={() => (inputRef.current!.value = '')}
                onAfterDelete={(project) => {
                  const isProjectSelected =
                    project.id === searchParams.get('projectId')
                  const isProjectLastOnPage = projects.content.length === 1
                  if (isProjectSelected && isProjectLastOnPage) {
                    inputRef.current!.value = ''
                    return setSearchParams((searchParams) => ({
                      page: Math.max(
                        0,
                        +searchParams.get('page')! - 1
                      ).toString(),
                      transitional: 'true',
                    }))
                  }
                  if (!isProjectSelected && isProjectLastOnPage) {
                    inputRef.current!.value = ''
                    return setSearchParams((searchParams) => ({
                      ...omit(['search'], Object.fromEntries(searchParams)),
                      page: Math.max(
                        0,
                        +searchParams.get('page')! - 1
                      ).toString(),
                    }))
                  }
                  if (isProjectSelected && !isProjectLastOnPage) {
                    const index = array.findIndex(({ id }) => id === project.id)
                    setSearchParams(
                      (searchParams) => ({
                        ...Object.fromEntries(searchParams),
                        projectId: array[Math.abs(index - 1)].id,
                        projectName: array[Math.abs(index - 1)].name,
                      }),
                      { replace: true }
                    )
                  }
                }}
              />
            </Grid>
          ))}
        {/* TODO:
         * Improve error display.
         */}
        {isEachProjectFetchedUnsuccessfully && (
          <Typography color='error'>
            Something went wrong: fetching projects failed. Please try again.
          </Typography>
        )}
      </Container>
      {isEachProjectFetchedSuccessfully && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Pagination
            page={+searchParams.get('page')! + 1}
            count={Math.ceil(projects.total / PROJECTS_PAGE_SIZE)}
            onChange={(_, page) =>
              setSearchParams((searchParams) => ({
                ...Object.fromEntries(searchParams),
                page: (page - 1).toString(),
              }))
            }
          />
        </Box>
      )}
    </Box>
  )
}

export default Projects
