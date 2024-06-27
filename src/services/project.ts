import { PaginableResponse } from '@/types/api'
import { Project } from '@/types/project'
import { z } from 'zod'
import { api } from './api'

// GET /projects
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

// GET /projects/:projectId
export const getProject = (id: Project['id']) =>
  api<Project>(`/projects/${id}`).then(({ data }) => data)

type CreateProjectRequestBody = Pick<Project, 'title' | 'description'>

// POST /projects
export const createProject = (data: CreateProjectRequestBody) =>
  api.post<Project>('/projects', data).then(({ data }) => data)

// PUT /projects/:projectId
type UpdateProjectRequestBody = Pick<Project, 'id' | 'title' | 'description'>

export const updateProject = ({ id, ...data }: UpdateProjectRequestBody) =>
  api.put<Project>(`/projects/${id}`, data).then(({ data }) => data)

// DELETE /projects/:projectId
const deleteProject = (projectId: Project['id']) =>
  api.delete<Project>(`/projects/${projectId}`).then(({ data }) => data)

export const deleteProjects = () => (projectIds: Project['id'][]) =>
  Promise.all(projectIds.map(deleteProject))
