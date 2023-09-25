import { initialValues } from '@/modules/project'

export interface Project {
  id: string
  createdAt: string
  name: string
  description?: string | null
}

export type InitialValues = ReturnType<typeof initialValues>
