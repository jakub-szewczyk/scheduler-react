import { Schedule } from '@/types/schedule'
import api from './api'

interface GetAllSchedulesParams {
  projectId: string
}

export const getSchedules = ({ projectId }: GetAllSchedulesParams) =>
  api<Pick<Schedule, 'id' | 'createdAt' | 'name'>[]>(
    `/projects/${projectId}/schedules`
  ).then(({ data }) => data)

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
