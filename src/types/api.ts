import { AxiosError } from 'axios'

export type ApiError = AxiosError<
  {
    type: string
    value: string
    msg: string
    path: string
    location: string
  }[]
>

export interface PaginableResponse<Content> {
  content: Content[]
  page: number
  size: number
  total: number
}
