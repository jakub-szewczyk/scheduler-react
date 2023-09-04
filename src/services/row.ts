import { Row } from '@/types/row'
import api from './api'

interface UpdateScheduleRowsPayload {
  projectId: string
  scheduleId: string
  rows: Pick<
    Row,
    'index' | 'starts' | 'ends' | 'room' | 'subject' | 'notification'
  >[]
  token: string | null
}

export const updateScheduleRows = ({
  projectId,
  scheduleId,
  rows,
  token,
}: UpdateScheduleRowsPayload) =>
  api
    .put<Row[]>(`/projects/${projectId}/schedules/${scheduleId}/rows`, rows, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(({ data }) => data)
