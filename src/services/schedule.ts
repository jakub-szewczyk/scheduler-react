import { Schedule } from '@/types/schedule'
import api from './api'
import { PaginatedResponse } from '@/types/api'

interface GetSchedulesParams {
  projectId: string
  page?: number
  size?: number
  name?: string
}

type GetSchedulesResponse = PaginatedResponse<
  Pick<Schedule, 'id' | 'createdAt' | 'name'>[]
>

export const getSchedules = ({ projectId, ...params }: GetSchedulesParams) =>
  api<GetSchedulesResponse>(`/projects/${projectId}/schedules`, {
    params,
  }).then(({ data }) => data)

interface GetScheduleParams {
  projectId: string
  scheduleId: string
}

export const getSchedule = ({ projectId, scheduleId }: GetScheduleParams) =>
  api<Schedule>(`/projects/${projectId}/schedules/${scheduleId}`).then(
    ({ data }) => data
  )

interface CreateSchedulePayload {
  projectId: string
  name: string
}

export const createSchedule = ({ projectId, name }: CreateSchedulePayload) =>
  api
    .post<Pick<Schedule, 'id' | 'createdAt' | 'name'>>(
      `/projects/${projectId}/schedules`,
      { name }
    )
    .then(({ data }) => data)

interface UpdateSchedulePayload {
  projectId: string
  scheduleId: string
  name: string
}

export const updateSchedule = ({
  projectId,
  scheduleId,
  name,
}: UpdateSchedulePayload) =>
  api
    .put<Schedule>(`/projects/${projectId}/schedules/${scheduleId}`, { name })
    .then(({ data }) => data)

interface DeleteSchedulePayload {
  projectId: string
  scheduleId: string
}

export const deleteSchedule = ({
  projectId,
  scheduleId,
}: DeleteSchedulePayload) =>
  api
    .delete<Schedule>(`/projects/${projectId}/schedules/${scheduleId}`)
    .then(({ data }) => data)
