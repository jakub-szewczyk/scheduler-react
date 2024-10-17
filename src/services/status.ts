import { PaginableResponse } from '@/types/api'
import { Board } from '@/types/board'
import { Project } from '@/types/project'
import { Status } from '@/types/status'
import { z } from 'zod'
import { api } from './api'

// GET /projects/:projectId/boards/:boardId/statuses
const getStatusesSearchParamsSchema = z.object({
  page: z.number().int().nonnegative().catch(0),
  size: z.number().int().nonnegative().catch(10),
  title: z.string().catch(''),
})

type GetStatusesSearchParams = z.infer<typeof getStatusesSearchParamsSchema>

type GetStatusesPathParams = { projectId: Project['id']; boardId: Board['id'] }

export type GetStatusesResponseBody = PaginableResponse<Status>

export const getStatuses = ({
  projectId,
  boardId,
  ...params
}: GetStatusesPathParams & Partial<GetStatusesSearchParams>) =>
  api<GetStatusesResponseBody>(
    `/projects/${projectId}/boards/${boardId}/statuses`,
    { params }
  ).then(({ data }) => data)

// POST /projects/:projectId/boards/:boardId/statuses
type GetCreateStatusPathParams = {
  projectId: Project['id']
  boardId: Board['id']
}

type GetCreateStatusRequestBody = Pick<Status, 'title' | 'description'> &
  Partial<{
    prevStatusId: Status['id']
    nextStatusId: Status['id']
  }>

export const createStatus = ({
  projectId,
  boardId,
  ...data
}: GetCreateStatusPathParams & GetCreateStatusRequestBody) =>
  api
    .post<Status>(`/projects/${projectId}/boards/${boardId}/statuses`, data)
    .then(({ data }) => data)

// PUT /projects/:projectId/boards/:boardId/statuses/:statusId
type GetUpdateStatusPathParams = {
  projectId: Project['id']
  boardId: Board['id']
  statusId: Status['id']
}

type GetUpdateStatusRequestBody = Pick<Status, 'title' | 'description'> &
  Partial<{
    prevStatusId: Status['id']
    nextStatusId: Status['id']
  }>

export const updateStatus = ({
  projectId,
  boardId,
  statusId,
  ...data
}: GetUpdateStatusPathParams & GetUpdateStatusRequestBody) =>
  api
    .put<Status>(
      `/projects/${projectId}/boards/${boardId}/statuses/${statusId}`,
      data
    )
    .then(({ data }) => data)

// DELETE /projects/:projectId/boards/:boardId/statuses/:statusId
type GetDeleteStatusPathParams = {
  projectId: Project['id']
  boardId: Board['id']
  statusId: Status['id']
}

export const deleteStatus = ({
  projectId,
  boardId,
  statusId,
}: GetDeleteStatusPathParams) =>
  api
    .delete<Status>(
      `/projects/${projectId}/boards/${boardId}/statuses/${statusId}`
    )
    .then(({ data }) => data)
