import ProjectItem from '@/components/Project/ProjectItem'
import { ProjectContainer } from '@/components/Project/styles/Project.styles'
import { getAllProjects } from '@/services/project'
import { useAuth } from '@clerk/clerk-react'
import { Typography } from '@mui/material'
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
      {isLoading && <Typography>Loading...</Typography>}
      {isSuccess &&
        projects.map((project) => (
          <Grid key={project.name} xs={12} sm={6} md={4} lg={3} xl={12 / 5}>
            <ProjectItem project={project} />
          </Grid>
        ))}
      {isError && (
        <Typography color='error'>Failed to fetch projects</Typography>
      )}
    </ProjectContainer>
  )
}

export default Projects
