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

interface UpdateBoardStatusPayload {
  projectId: string
  boardId: string
  statusId: string
  title: Status['title']
  token: string | null
}

export const updateBoardStatus = ({
  projectId,
  boardId,
  statusId,
  title,
  token,
}: UpdateBoardStatusPayload) =>
  api
    .patch<Status>(
      `/projects/${projectId}/boards/${boardId}/statuses/${statusId}`,
      { title },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then(({ data }) => data)
