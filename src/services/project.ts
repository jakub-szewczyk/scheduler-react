import { PaginableResponse } from '@/types/api'
import { Project } from '@/types/project'
import api from './api'

type GetAllProjectsParams = Partial<{
  page: number
  size: number
}>

export const getProjects = (params?: GetAllProjectsParams) =>
  api<PaginableResponse<Project[]>>('/projects', { params }).then(
    ({ data }) => data
  )

export const getProject = (projectId: string) =>
  api<Project>(`/projects/${projectId}`).then(({ data }) => data)

export const createProject = (data: Pick<Project, 'name' | 'description'>) =>
  api.post<Project>('/projects', data).then(({ data }) => data)

export const updateProject = ({
  id,
  ...data
}: Pick<Project, 'id' | 'name' | 'description'>) =>
  api.put<Project>(`/projects/${id}`, data).then(({ data }) => data)

export const deleteProject = ({ id }: Pick<Project, 'id'>) =>
  api.delete<Project>(`/projects/${id}`).then(({ data }) => data)
