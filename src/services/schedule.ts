import { Schedule } from '@/types/schedule'
import api from './api'

interface GetAllSchedulesPayload {
  projectId: string
  token: string | null
}

export const getAllSchedules = ({ projectId, token }: GetAllSchedulesPayload) =>
  api<Pick<Schedule, 'id' | 'createdAt' | 'name'>[]>(
    `/projects/${projectId}/schedules`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  ).then(({ data }) => data)

interface GetSchedulePayload {
  projectId: string
  scheduleId: string
  token: string | null
}

export const getSchedule = ({
  projectId,
  scheduleId,
  token,
}: GetSchedulePayload) =>
  api<Schedule>(`/projects/${projectId}/schedules/${scheduleId}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(({ data }) => data)

interface CreateSchedulePayload {
  projectId: string
  name: string
  token: string | null
}

export const createSchedule = ({
  projectId,
  name,
  token,
}: CreateSchedulePayload) =>
  api
    .post<Pick<Schedule, 'id' | 'createdAt' | 'name'>>(
      `/projects/${projectId}/schedules`,
      { name },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(({ data }) => data)

interface UpdateSchedulePayload {
  projectId: string
  scheduleId: string
  name: string
  token: string | null
}

export const updateSchedule = ({
  projectId,
  scheduleId,
  name,
  token,
}: UpdateSchedulePayload) =>
  api
    .put<Schedule>(
      `/projects/${projectId}/schedules/${scheduleId}`,
      { name },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then(({ data }) => data)

interface DeleteSchedulePayload {
  projectId: string
  scheduleId: string
  token: string | null
}

export const deleteSchedule = ({
  projectId,
  scheduleId,
  token,
}: DeleteSchedulePayload) =>
  api
    .delete<Schedule>(`/projects/${projectId}/schedules/${scheduleId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(({ data }) => data)
