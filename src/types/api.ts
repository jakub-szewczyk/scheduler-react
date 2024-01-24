export interface PaginatedResponse<T> {
  content: T
  page: number
  size: number
  total: number
}
