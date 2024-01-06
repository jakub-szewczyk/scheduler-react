export interface PaginableResponse<T> {
  content: T
  page: number
  size: number
  total: number
}
