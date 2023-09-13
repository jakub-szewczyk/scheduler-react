import { Issue } from '@/types/issue'
import { Status } from '@/types/status'
import api from './api'

interface UpdateBoardStatusesPayload {
  projectId: string
  boardId: string
  statuses: (Pick<Status, 'id'> & { issues: Pick<Issue, 'id'>[] })[]
  token: string | null
}

export const updateBoardStatuses = ({
  projectId,
  boardId,
  statuses,
  token,
}: UpdateBoardStatusesPayload) =>
  api
    .put(`/projects/${projectId}/boards/${boardId}/statuses`, statuses, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(({ data }) => data)
