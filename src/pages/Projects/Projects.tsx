import ProjectItem from '@/components/Project/ProjectItem'
import { ProjectContainer } from '@/components/Project/styles/Project.styles'
import useProjects from '@/hooks/useProjects'
import Grid from '@mui/material/Unstable_Grid2/Grid2'

const Projects = () => {
  const { projects, setProjects } = useProjects()

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
