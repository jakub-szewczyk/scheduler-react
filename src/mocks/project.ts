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
  title = '',
  createdAt = 'DESC',
}: Partial<{
  page: number
  size: number
  total: number
  title: string
  createdAt: 'ASC' | 'DESC'
}>): PaginableResponse<Project> => {
  const content = Array(total)
    .fill(null)
    .slice(page * size, page * size + size)
    .map((_, index) => ({
      id: faker.string.uuid(),
      title: `Project #${createdAt === 'ASC' ? index + page * size + 1 : total - index - page * size}`,
      description: faker.lorem.sentences(),
      createdAt: new Date(Date.now() - index * 1_000_000).toISOString(),
    }))
    .filter((project) =>
      title ? project.title.toLowerCase().includes(title.toLowerCase()) : true
    )
  return {
    content,
    page,
    size,
    total,
  }
}
