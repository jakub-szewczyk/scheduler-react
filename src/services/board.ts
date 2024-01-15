import { Board } from '@/types/board'
import api from './api'

interface GetAllBoardsPayload {
  projectId: string
}

export const getBoards = ({ projectId }: GetAllBoardsPayload) =>
  api<Pick<Board, 'id' | 'createdAt' | 'name'>[]>(
    `/projects/${projectId}/boards`
  ).then(({ data }) => data)

interface GetBoardPayload {
  projectId: string
  boardId: string
}

export const getBoard = ({ projectId, boardId }: GetBoardPayload) =>
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
