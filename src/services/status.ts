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
}

export const updateBoardStatuses = ({
  projectId,
  boardId,
  statuses,
}: UpdateBoardStatusesPayload) =>
  api
    .put(`/projects/${projectId}/boards/${boardId}/statuses`, statuses)
    .then(({ data }) => data)

interface UpdateBoardStatusPayload {
  projectId: string
  boardId: string
  statusId: string
  title: Status['title']
}

export const updateBoardStatus = ({
  projectId,
  boardId,
  statusId,
  title,
}: UpdateBoardStatusPayload) =>
  api
    .patch<Status>(
      `/projects/${projectId}/boards/${boardId}/statuses/${statusId}`,
      { title }
    )
    .then(({ data }) => data)
