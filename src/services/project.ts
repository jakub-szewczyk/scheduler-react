import api from './api'

interface GetAllProjectsResponse {
  id: number
  name: string
  createdAt: string
}

export const getAllProjects = (token: string | null) =>
  api<GetAllProjectsResponse[]>('/projects', {
    headers: { Authorization: `Bearer ${token}` },
  }).then(({ data }) => data)
