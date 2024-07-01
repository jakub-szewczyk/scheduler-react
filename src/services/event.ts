import { PaginableResponse } from '@/types/api'
import { Event } from '@/types/event'
import { Project } from '@/types/project'
import { Schedule } from '@/types/schedule'
import { z } from 'zod'
import { api } from './api'

// GET /projects/:projectId/schedules/:scheduleId/events
export const getEventsSearchParamsSchema = z.object({
  page: z.number().int().nonnegative().catch(0),
  size: z.number().int().nonnegative().catch(10),
  title: z.string().catch(''),
  createdAt: z.enum(['ASC', 'DESC']).catch('DESC'),
  startAt: z.string().datetime().optional(),
  endAt: z.string().datetime().optional(),
})

export type GetEventsSearchParams = z.infer<typeof getEventsSearchParamsSchema>

type GetEventsPathParams = {
  projectId: Project['id']
  scheduleId: Schedule['id']
}

type GetEventsResponseBody = PaginableResponse<Event>

export const getEvents = ({
  projectId,
  scheduleId,
  ...params
}: GetEventsPathParams & Partial<GetEventsSearchParams>) =>
  api<GetEventsResponseBody>(
    `/projects/${projectId}/schedules/${scheduleId}/events`,
    {
      params,
    }
  ).then(({ data }) => data)
