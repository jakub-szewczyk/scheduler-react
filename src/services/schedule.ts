import { PaginableResponse } from '@/types/api'
import { Schedule } from '@/types/schedule'
import { z } from 'zod'
import { api } from './api'

// GET /projects/:projectId/schedules
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

// GET /projects/:projectId/schedules/:scheduleId
type GetSchedulePathParams = { projectId: string; scheduleId: string }

export const getSchedule = ({ projectId, scheduleId }: GetSchedulePathParams) =>
  api<Schedule>(`/projects/${projectId}/schedules/${scheduleId}`).then(
    ({ data }) => data
  )

// POST /projects/:projectId/schedules
type CreateSchedulePathParams = { projectId: string }

type CreateScheduleRequestBody = Pick<Schedule, 'title' | 'description'>

export const createSchedule = ({
  projectId,
  ...data
}: CreateSchedulePathParams & CreateScheduleRequestBody) =>
  api
    .post<Schedule>(`projects/${projectId}/schedules`, data)
    .then(({ data }) => data)

// PUT /projects/:projectId/schedules/:scheduleId
type UpdateSchedulePathParams = { projectId: string; scheduleId: string }

type UpdateScheduleRequestBody = Pick<Schedule, 'id' | 'title' | 'description'>

export const updateSchedule = ({
  projectId,
  scheduleId,
  ...data
}: UpdateSchedulePathParams & UpdateScheduleRequestBody) =>
  api
    .put<Schedule>(`/projects/${projectId}/schedules/${scheduleId}`, data)
    .then(({ data }) => data)

// DELETE /projects/:projectId/schedules/:scheduleId
type DeleteSchedulePathParams = { projectId: string; scheduleId: string }

const deleteSchedule = ({ projectId, scheduleId }: DeleteSchedulePathParams) =>
  api
    .delete<Schedule>(`/projects/${projectId}/schedules/${scheduleId}`)
    .then(({ data }) => data)

export const deleteSchedules = (params: DeleteSchedulePathParams[]) =>
  Promise.all(params.map(deleteSchedule))
