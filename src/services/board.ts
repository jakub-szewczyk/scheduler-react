import { PaginableResponse } from '@/types/api'
import { Board } from '@/types/board'
import { z } from 'zod'
import { api } from './api'

export const getBoardsSearchParamsSchema = z.object({
  page: z.number().int().nonnegative().catch(0),
  size: z.number().int().nonnegative().catch(10),
  title: z.string().catch(''),
  createdAt: z.enum(['ASC', 'DESC']).catch('DESC'),
})

export type GetBoardsSearchParams = z.infer<typeof getBoardsSearchParamsSchema>

type GetBoardsPathParams = { projectId: string }

type GetBoardsResponseBody = PaginableResponse<Board>

export const getBoards = ({
  projectId,
  ...params
}: GetBoardsPathParams & Partial<GetBoardsSearchParams>) =>
  api<GetBoardsResponseBody>(`/projects/${projectId}/boards`, {
    params,
  }).then(({ data }) => data)
