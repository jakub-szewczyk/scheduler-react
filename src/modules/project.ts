import { Project } from '@/types/project'

export const initialValues = (mode: 'CREATE' | 'EDIT', project: Project) => ({
  name: mode === 'EDIT' ? project.name || '' : '',
  description: mode === 'EDIT' ? project.description || '' : '',
})
