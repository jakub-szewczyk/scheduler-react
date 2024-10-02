import { PaginableResponse } from '@/types/api'
import { Project } from '@/types/project'
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

type GetSchedulesPathParams = { projectId: Project['id'] }

type GetSchedulesResponseBody = PaginableResponse<Schedule>

export const getSchedules = ({
  projectId,
  ...params
}: GetSchedulesPathParams & Partial<GetSchedulesSearchParams>) =>
  api<GetSchedulesResponseBody>(`/projects/${projectId}/schedules`, {
    params,
  }).then(({ data }) => data)

// GET /projects/:projectId/schedules/:scheduleId
type GetSchedulePathParams = {
  projectId: Project['id']
  scheduleId: Schedule['id']
}

export const getSchedule = ({ projectId, scheduleId }: GetSchedulePathParams) =>
  api<Schedule>(`/projects/${projectId}/schedules/${scheduleId}`).then(
    ({ data }) => data
  )

// POST /projects/:projectId/schedules
type CreateSchedulePathParams = { projectId: Project['id'] }

type CreateScheduleRequestBody = Pick<Schedule, 'title' | 'description'>

export const createSchedule = ({
  projectId,
  ...data
}: CreateSchedulePathParams & CreateScheduleRequestBody) =>
  api
    .post<Schedule>(`projects/${projectId}/schedules`, data)
    .then(({ data }) => data)

// PUT /projects/:projectId/schedules/:scheduleId
type UpdateSchedulePathParams = {
  projectId: Project['id']
  scheduleId: Schedule['id']
}

type UpdateScheduleRequestBody = Pick<Schedule, 'title' | 'description'>

export const updateSchedule = ({
  projectId,
  scheduleId,
  ...data
}: UpdateSchedulePathParams & UpdateScheduleRequestBody) =>
  api
    .put<Schedule>(`/projects/${projectId}/schedules/${scheduleId}`, data)
    .then(({ data }) => data)

// DELETE /projects/:projectId/schedules/:scheduleId
type DeleteSchedulePathParams = {
  projectId: Project['id']
  scheduleId: Schedule['id']
}

const deleteSchedule = ({ projectId, scheduleId }: DeleteSchedulePathParams) =>
  api
    .delete<Schedule>(`/projects/${projectId}/schedules/${scheduleId}`)
    .then(({ data }) => data)

export const deleteSchedules =
  (projectId: Project['id']) => (scheduleIds: Schedule['id'][]) =>
    Promise.all(
      scheduleIds.map((scheduleId) => deleteSchedule({ projectId, scheduleId }))
    )
