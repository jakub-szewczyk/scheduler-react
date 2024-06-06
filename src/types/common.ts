export interface PaginableResponse<Content> {
  content: Content[]
  page: number
  size: number
  total: number
}

export type Subject = 'project' | 'schedule' | 'board' | 'note'
