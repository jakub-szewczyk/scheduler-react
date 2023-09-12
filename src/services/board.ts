import { Board } from '@/types/board'
import api from './api'

interface GetAllBoardsPayload {
  projectId: string
  token: string | null
}

export const getAllBoards = ({ projectId, token }: GetAllBoardsPayload) =>
  api<Pick<Board, 'id' | 'createdAt' | 'name'>[]>(
    `/projects/${projectId}/boards`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  ).then(({ data }) => data)

interface GetBoardPayload {
  projectId: string
  boardId: string
  token: string | null
}

export const getBoard = ({ projectId, boardId, token }: GetBoardPayload) =>
  api<Board>(`/projects/${projectId}/boards/${boardId}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(({ data }) => data)

interface CreateBoardPayload {
  projectId: string
  name: string
  token: string | null
}

export const createBoard = ({ projectId, name, token }: CreateBoardPayload) =>
  api
    .post<Pick<Board, 'id' | 'createdAt' | 'name'>>(
      `/projects/${projectId}/boards`,
      { name },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(({ data }) => data)

interface UpdateBoardPayload {
  projectId: string
  boardId: string
  name: string
  token: string | null
}

export const updateBoard = ({
  projectId,
  boardId,
  name,
  token,
}: UpdateBoardPayload) =>
  api
    .put<Board>(
      `/projects/${projectId}/boards/${boardId}`,
      { name },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then(({ data }) => data)
