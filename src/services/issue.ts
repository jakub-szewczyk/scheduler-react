import { PaginableResponse } from '@/types/api'
import { Board } from '@/types/board'
import { Issue } from '@/types/issue'
import { Project } from '@/types/project'
import { Status } from '@/types/status'
import { z } from 'zod'
import { api } from './api'

// GET /projects/:projectId/boards/:boardId/statuses/:statusId/issues
const getIssuesSearchParamsSchema = z.object({
  page: z.number().int().nonnegative().catch(0),
  size: z.number().int().nonnegative().catch(10),
  title: z.string().catch(''),
})

type GetIssuesSearchParams = z.infer<typeof getIssuesSearchParamsSchema>

type GetIssuesPathParams = {
  projectId: Project['id']
  boardId: Board['id']
  statusId: Status['id']
}

export type GetIssuesResponseBody = PaginableResponse<Issue>

export const getIssues = ({
  projectId,
  boardId,
  statusId,
  ...params
}: GetIssuesPathParams & Partial<GetIssuesSearchParams>) =>
  api<GetIssuesResponseBody>(
    `/projects/${projectId}/boards/${boardId}/statuses/${statusId}/issues`,
    {
      params,
    }
  ).then(({ data }) => data)

// PUT /projects/:projectId/boards/:boardId/statuses/:statusId/issues/:issueId
type GetUpdateIssuePathParams = {
  projectId: Project['id']
  boardId: Board['id']
  statusId: Status['id']
  issueId: Issue['id']
}

type GetUpdateIssueRequestBody = Pick<
  Issue,
  'title' | 'description' | 'priority'
> &
  Partial<{
    prevIssueUd: Issue['id']
    nextIssueUd: Issue['id']
    newStatusId: Status['id']
  }>

export const updateIssue = ({
  projectId,
  boardId,
  statusId,
  issueId,
  ...data
}: GetUpdateIssuePathParams & GetUpdateIssueRequestBody) =>
  api
    .put<Issue>(
      `/projects/${projectId}/boards/${boardId}/statuses/${statusId}/issues/${issueId}`,
      { ...data, statusId: data.newStatusId }
    )
    .then(({ data }) => data)
