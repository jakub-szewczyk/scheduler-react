import { PaginableResponse } from '@/types/api'
import { Board } from '@/types/board'
import { Project } from '@/types/project'
import { z } from 'zod'
import { api } from './api'

// GET /projects/:projectId/boards
export const getBoardsSearchParamsSchema = z.object({
  page: z.number().int().nonnegative().catch(0),
  size: z.number().int().nonnegative().catch(10),
  title: z.string().catch(''),
  createdAt: z.enum(['ASC', 'DESC']).catch('DESC'),
})

export type GetBoardsSearchParams = z.infer<typeof getBoardsSearchParamsSchema>

type GetBoardsPathParams = { projectId: Board['id'] }

type GetBoardsResponseBody = PaginableResponse<Board>

export const getBoards = ({
  projectId,
  ...params
}: GetBoardsPathParams & Partial<GetBoardsSearchParams>) =>
  api<GetBoardsResponseBody>(`/projects/${projectId}/boards`, {
    params,
  }).then(({ data }) => data)

// GET /projects/:projectId/boards/:boardId
type GetBoardPathParams = { projectId: Project['id']; boardId: Board['id'] }

export const getBoard = ({ projectId, boardId }: GetBoardPathParams) =>
  api<Board>(`/projects/${projectId}/boards/${boardId}`).then(
    ({ data }) => data
  )

// POST /projects/:projectId/boards
type CreateBoardPathParams = { projectId: Project['id'] }

type CreateBoardRequestBody = Pick<Board, 'title' | 'description'>

export const createBoard = ({
  projectId,
  ...data
}: CreateBoardPathParams & CreateBoardRequestBody) =>
  api.post<Board>(`projects/${projectId}/boards`, data).then(({ data }) => data)

// PUT /projects/:projectId/boards/:boardId
type UpdateBoardPathParams = { projectId: Project['id']; boardId: Board['id'] }

type UpdateBoardRequestBody = Pick<Board, 'id' | 'title' | 'description'>

export const updateBoard = ({
  projectId,
  boardId,
  ...data
}: UpdateBoardPathParams & UpdateBoardRequestBody) =>
  api
    .put<Board>(`/projects/${projectId}/boards/${boardId}`, data)
    .then(({ data }) => data)

// DELETE /projects/:projectId/boards/:boardId
type DeleteBoardPathParams = { projectId: Project['id']; boardId: Board['id'] }

const deleteBoard = ({ projectId, boardId }: DeleteBoardPathParams) =>
  api
    .delete<Board>(`/projects/${projectId}/boards/${boardId}`)
    .then(({ data }) => data)

export const deleteBoards =
  (projectId: Project['id']) => (boardIds: Board['id'][]) =>
    Promise.all(boardIds.map((boardId) => deleteBoard({ projectId, boardId })))
