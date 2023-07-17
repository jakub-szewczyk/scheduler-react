import ProjectItem from '@/components/Project/ProjectItem'
import { ProjectContainer } from '@/components/Project/styles/Project.styles'
import useProjects from '@/hooks/useProjects'
import { getAllProjects } from '@/services/project'
import { useAuth } from '@clerk/clerk-react'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { useQuery } from '@tanstack/react-query'

const Projects = () => {
  const { projects, setProjects } = useProjects()

  const { getToken } = useAuth()

  const { data } = useQuery(['projects'], async () =>
    getAllProjects(await getToken())
  )

  return (
    <ProjectContainer>
      {projects.map((project) => (
        <Grid key={project.name} xs={12} sm={6} md={4} lg={3} xl={12 / 5}>
          <ProjectItem
            project={project}
            projects={projects}
            setProjects={setProjects}
          />
        </Grid>
      ))}
    </ProjectContainer>
  )
}

export default Projects
