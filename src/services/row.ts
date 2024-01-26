import { Row } from '@/types/row'
import api from './api'

interface UpdateScheduleRowsPayload {
  projectId: string
  scheduleId: string
  rows: Pick<
    Row,
    'index' | 'starts' | 'ends' | 'room' | 'subject' | 'notification'
  >[]
}

export const updateScheduleRows = ({
  projectId,
  scheduleId,
  rows,
}: UpdateScheduleRowsPayload) =>
  api
    .put<Row[]>(`/projects/${projectId}/schedules/${scheduleId}/rows`, rows)
    .then(({ data }) => data)
