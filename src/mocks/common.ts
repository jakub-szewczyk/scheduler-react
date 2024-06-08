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
}): PaginableResponse<Project> => ({
  content: Array(total)
    .fill(null)
    .slice(page * size, page * size + size)
    .map((_, index) => ({
      id: faker.string.uuid(),
      title: `Project #${total - index}`,
      description: faker.lorem.sentences(),
      createdAt: faker.date.recent().toISOString(),
    })),
  page,
  size,
  total,
})
