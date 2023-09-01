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
