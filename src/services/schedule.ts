import { PaginableResponse } from '@/types/api'
import { Schedule } from '@/types/schedule'
import { z } from 'zod'
import { api } from './api'

export const getSchedulesSearchParamsSchema = z.object({
  page: z.number().int().nonnegative().catch(0),
  size: z.number().int().nonnegative().catch(10),
  title: z.string().catch(''),
  createdAt: z.enum(['ASC', 'DESC']).catch('DESC'),
})

export type GetSchedulesSearchParams = z.infer<
  typeof getSchedulesSearchParamsSchema
>

type GetSchedulesPathParams = { projectId: string }

type GetSchedulesResponseBody = PaginableResponse<Schedule>

export const getSchedules = ({
  projectId,
  ...params
}: GetSchedulesPathParams & Partial<GetSchedulesSearchParams>) =>
  api<GetSchedulesResponseBody>(`/projects/${projectId}/schedules`, {
    params,
  }).then(({ data }) => data)
