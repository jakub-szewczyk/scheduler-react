import ProjectItem from '@/components/Project/ProjectItem'
import { ProjectContainer } from '@/components/Project/styles/Project.styles'
import { PROJECTS_PAGE_SIZE } from '@/modules/project'
import { getAllProjects } from '@/services/project'
import { Box, CircularProgress, Pagination, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

const Projects = () => {
  const [page, setPage] = useState(0)

  const params = { page, size: PROJECTS_PAGE_SIZE }

  const { data, isLoading, isSuccess, isError } = useQuery(
    ['projects', params],
    () => getAllProjects(params)
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
      <ProjectContainer>
        {isLoading && (
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
        {isSuccess &&
          data.content.map((project) => (
            <Grid key={project.name} xs={12} sm={6} md={4} lg={3} xl={12 / 5}>
              <ProjectItem
                project={project}
                disableDelete={data.total === 1}
                onAfterCreate={() => setPage(0)}
                onAfterDelete={() =>
                  data.content.length === 1 && setPage((page) => page - 1)
                }
              />
            </Grid>
          ))}
        {isError && (
          <Typography color='error'>
            Something went wrong: fetching projects failed. Please try again.
          </Typography>
        )}
      </ProjectContainer>
      {isSuccess && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Pagination
            page={page + 1}
            count={Math.ceil(data.total / PROJECTS_PAGE_SIZE)}
            onChange={(_, page) => setPage(page - 1)}
          />
        </Box>
      )}
    </Box>
  )
}

export default Projects
