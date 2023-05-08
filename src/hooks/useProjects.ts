import { useLocalStorage } from 'usehooks-ts'
import * as PROJECT from '@/modules/project'

const useProjects = () => {
  const [projects, setProjects] = useLocalStorage(
    'projects',
    PROJECT.initialValues()
  )

  const project = projects.find((project) => project.selected)!

  return { project, projects, setProjects }
}
export default useProjects
