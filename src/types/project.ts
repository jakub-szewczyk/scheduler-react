export interface Project {
  id: string
  createdAt: string
  name: string
  description?: string | null
}

export type InitialValues = { name: string; description: string }
