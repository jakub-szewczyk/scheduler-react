import { PaginableResponse } from '@/types/common'
import { Project } from '@/types/project'
import { faker } from '@faker-js/faker'

export const EMPTY_PAGINABLE_RESPONSE: PaginableResponse<Project> = {
  content: [],
  page: 0,
  size: 10,
  total: 0,
}

faker.seed(0)

export const PAGINABLE_RESPONSE = ({
  page = 0,
  size = 10,
  total = 100,
  createdAt = 'DESC',
}: Partial<{
  page: number
  size: number
  total: number
  createdAt: 'ASC' | 'DESC'
}>): PaginableResponse<Project> => {
  const content = Array(total)
    .fill(null)
    .map((_, index) => ({
      id: faker.string.uuid(),
      title: `Project #${total - index}`,
      description: faker.lorem.sentences(),
      createdAt: new Date(Date.now() - index * 1_000_000).toISOString(),
    }))
  if (createdAt === 'ASC') content.reverse()
  content.slice(page * size, page * size + size)
  return {
    content,
    page,
    size,
    total,
  }
}
