import { Project } from '@/types/project'

export const PROJECTS_PAGE_SIZE = 10

export const initialValues = (mode: 'insert' | 'update', project: Project) => ({
  name: mode === 'update' ? project.name : '',
  description: mode === 'update' ? project.description || '' : '',
})
