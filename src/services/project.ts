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

type GetProjectsResponse = PaginableResponse<Project>

export const getProjects = async (params?: Partial<GetProjectsSearchParams>) =>
  api<GetProjectsResponse>('/projects', { params }).then(({ data }) => data)
