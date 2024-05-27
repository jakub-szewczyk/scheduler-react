import { queryOptions } from '@tanstack/react-query'
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

export const getProjects = async (params?: Partial<GetProjectsSearchParams>) =>
  api('/projects', { params }).then(({ data }) => data)

export const getProjectsQueryOptions = (
  params?: Partial<GetProjectsSearchParams>
) =>
  queryOptions({
    queryKey: ['projects', params],
    queryFn: () => getProjects(params),
  })
