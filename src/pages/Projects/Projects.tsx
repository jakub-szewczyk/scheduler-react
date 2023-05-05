import ProjectItem from '@/components/Project/ProjectItem'
import { ProjectContainer } from '@/components/Project/styles/Project.styles'
import useProjects from '@/hooks/useProjects'

// TODO: Restyle to some kind of a list view
const Projects = () => {
  const { projects, setProjects } = useProjects()

  return (
    <ProjectContainer elevation={0}>
      {projects.map((project) => (
        <ProjectItem
          key={project.name}
          project={project}
          projects={projects}
          setProjects={setProjects}
        />
      ))}
    </ProjectContainer>
  )
}

export default Projects
