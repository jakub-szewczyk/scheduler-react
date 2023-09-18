import { Issue } from '@/types/issue'
import { Status } from '@/types/status'
import api from './api'

interface UpdateBoardStatusesPayload {
  projectId: string
  boardId: string
  statuses: (Pick<Status, 'title'> & {
    id?: string
    issues: (Pick<Issue, 'title' | 'content'> & { id?: string })[]
  })[]
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
