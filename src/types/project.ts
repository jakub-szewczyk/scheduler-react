export interface Project {
  name: string
  description: string
  selected: boolean
  createdAt: string
}

export type ProjectsEndomorphism = (projects: Project[]) => Project[]
