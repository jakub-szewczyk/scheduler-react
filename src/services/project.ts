import { PaginableResponse } from '@/types/common'
import { Project } from '@/types/project'
import { z } from 'zod'
import { api } from './api'

export const getProjectsSearchParamsSchema = z.object({
  page: z.number().int().nonnegative().catch(0),
  size: z.number().int().nonnegative().catch(10),
  title: z.string().catch(''),
  createdAt: z.enum(['ASC', 'DESC']).catch('DESC'),
})

export type GetProjectsSearchParams = z.infer<
  typeof getProjectsSearchParamsSchema
>

type GetProjectsResponseBody = PaginableResponse<Project>

export const getProjects = (params?: Partial<GetProjectsSearchParams>) =>
  api<GetProjectsResponseBody>('/projects', { params }).then(({ data }) => data)

type CreateProjectRequestBody = Pick<Project, 'title' | 'description'>

export const createProject = (data: CreateProjectRequestBody) =>
  api.post<Project>('/projects', data).then(({ data }) => data)

export const deleteProject = (projectId: string) =>
  api.delete<Project>(`/projects/${projectId}`).then(({ data }) => data)

export const deleteProjects = (projectIds: string[]) =>
  Promise.all(projectIds.map(deleteProject))
