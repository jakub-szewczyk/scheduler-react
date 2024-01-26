import { Issue } from '@/types/issue'
import api from './api'

interface UpdateBoardIssuePayload {
  projectId: string
  boardId: string
  statusId: string
  issueId: string
  title: Issue['title']
  content: Issue['content']
}

export const updateBoardIssue = ({
  projectId,
  boardId,
  statusId,
  issueId,
  title,
  content,
}: UpdateBoardIssuePayload) =>
  api
    .patch<Issue>(
      `/projects/${projectId}/boards/${boardId}/statuses/${statusId}/issues/${issueId}`,
      { title, content }
    )
    .then(({ data }) => data)
