import { Board } from '@/types/board'
import api from './api'
import { PaginatedResponse } from '@/types/api'

interface GetBoardsParams {
  projectId: string
}

type GetBoardsResponse = PaginatedResponse<
  Pick<Board, 'id' | 'createdAt' | 'name'>[]
>

export const getBoards = ({ projectId }: GetBoardsParams) =>
  api<GetBoardsResponse>(`/projects/${projectId}/boards`).then(
    ({ data }) => data
  )

interface GetBoardParams {
  projectId: string
  boardId: string
}

export const getBoard = ({ projectId, boardId }: GetBoardParams) =>
  api<Board>(`/projects/${projectId}/boards/${boardId}`).then(
    ({ data }) => data
  )

interface CreateBoardPayload {
  projectId: string
  name: string
}

export const createBoard = ({ projectId, name }: CreateBoardPayload) =>
  api
    .post<Pick<Board, 'id' | 'createdAt' | 'name'>>(
      `/projects/${projectId}/boards`,
      { name }
    )
    .then(({ data }) => data)

interface UpdateBoardPayload {
  projectId: string
  boardId: string
  name: string
}

export const updateBoard = ({ projectId, boardId, name }: UpdateBoardPayload) =>
  api
    .put<Board>(`/projects/${projectId}/boards/${boardId}`, { name })
    .then(({ data }) => data)

interface DeleteBoardPayload {
  projectId: string
  boardId: string
}

export const deleteBoard = ({ projectId, boardId }: DeleteBoardPayload) =>
  api
    .delete<Board>(`/projects/${projectId}/boards/${boardId}`)
    .then(({ data }) => data)
