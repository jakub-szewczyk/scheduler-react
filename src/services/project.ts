/* eslint-disable @tanstack/query/exhaustive-deps */
import { GetToken } from '@clerk/types'
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

export const getProjects = async (
  getToken: GetToken,
  params?: Partial<GetProjectsSearchParams>
) =>
  api('/projects', {
    params,
    headers: { Authorization: `Bearer ${await getToken()}` },
  }).then(({ data }) => data)

export const getProjectsQueryOptions = (
  getToken: GetToken,
  params?: Partial<GetProjectsSearchParams>
) =>
  queryOptions({
    queryKey: ['projects', params],
    queryFn: () => getProjects(getToken, params),
  })
