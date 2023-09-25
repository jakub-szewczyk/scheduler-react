import ProjectItem from '@/components/Project/ProjectItem'
import { ProjectContainer } from '@/components/Project/styles/Project.styles'
import { getAllProjects } from '@/services/project'
import { useAuth } from '@clerk/clerk-react'
import { Box, CircularProgress, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { useQuery } from '@tanstack/react-query'

const Projects = () => {
  const { getToken } = useAuth()

  const {
    data: projects,
    isLoading,
    isSuccess,
    isError,
  } = useQuery(['projects'], async () => getAllProjects(await getToken()))

  return (
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
        projects.map((project) => (
          <Grid key={project.name} xs={12} sm={6} md={4} lg={3} xl={12 / 5}>
            <ProjectItem project={project} projects={projects} />
          </Grid>
        ))}
      {isError && (
        <Typography color='error'>
          Something went wrong: fetching projects failed. Please try again.
        </Typography>
      )}
    </ProjectContainer>
  )
}

export default Projects
