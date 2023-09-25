import { Issue } from '@/types/issue'
import api from './api'

interface UpdateBoardIssuePayload {
  projectId: string
  boardId: string
  statusId: string
  issueId: string
  title: Issue['title']
  content: Issue['content']
  token: string | null
}

export const updateBoardIssue = ({
  projectId,
  boardId,
  statusId,
  issueId,
  title,
  content,
  token,
}: UpdateBoardIssuePayload) =>
  api
    .patch<Issue>(
      `/projects/${projectId}/boards/${boardId}/statuses/${statusId}/issues/${issueId}`,
      { title, content },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then(({ data }) => data)
