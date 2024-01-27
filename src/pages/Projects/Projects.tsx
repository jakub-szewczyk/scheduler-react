import ProjectItem from '@/components/Project/ProjectItem'
import { Container } from '@/components/Project/styles/Project.styles'
import { PROJECTS_PAGE_SIZE } from '@/modules/project'
import { getProjects } from '@/services/project'
import { Box, CircularProgress, Pagination, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { useQuery } from '@tanstack/react-query'
import { omit } from 'ramda'
import { useSearchParams } from 'react-router-dom'

const Projects = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const projectsParams = {
    page: +searchParams.get('page')!,
    size: PROJECTS_PAGE_SIZE,
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
        {isEachProjectFetchedSuccessfully &&
          projects.content.map((project, _, array) => (
            <Grid key={project.name} xs={12} sm={6} md={4} lg={3} xl={12 / 5}>
              <ProjectItem
                project={project}
                disableDelete={projects.total === 1}
                onAfterDelete={(project) => {
                  const isProjectSelected =
                    project.id === searchParams.get('projectId')
                  const isProjectLastOnPage = projects.content.length === 1
                  if (isProjectSelected && isProjectLastOnPage)
                    return setSearchParams((searchParams) => ({
                      page: (+searchParams.get('page')! - 1).toString(),
                      transitional: 'true',
                    }))
                  if (!isProjectSelected && isProjectLastOnPage)
                    return setSearchParams((searchParams) => ({
                      ...Object.fromEntries(searchParams),
                      page: (+searchParams.get('page')! - 1).toString(),
                    }))
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
