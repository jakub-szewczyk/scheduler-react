import { initialValues } from '@/modules/project'

export interface Project {
  id: number
  createdAt: string
  name: string
  description?: string | null
}

// export type ProjectsEndomorphism = (projects: Project[]) => Project[]

export type InitialValues = ReturnType<typeof initialValues>
