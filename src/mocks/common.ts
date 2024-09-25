import { PaginableResponse } from '@/types/api'
import { Project } from '@/types/project'
import { faker } from '@faker-js/faker'

export const EMPTY_PAGINABLE_RESPONSE: PaginableResponse<Project> = {
  content: [],
  page: 0,
  size: 10,
  total: 0,
}

faker.seed(0)

const page = 0
const size = 10
const total = 100

export const PAGINABLE_RESPONSE = {
  content: Array(total)
    .fill(null)
    .slice(page, size)
    .map(() => ({
      id: faker.string.uuid(),
      title: faker.lorem.slug(),
      description: faker.lorem.sentences(),
      createdAt: faker.date.past().toISOString(),
    })),
  page,
  size,
  total,
}

export const SUBJECT = {
  id: faker.string.uuid(),
  title: faker.lorem.slug(),
  description: faker.lorem.sentences(),
  createdAt: faker.date
    .past({ refDate: new Date(1719550869571) })
    .toISOString(),
}

export const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

export const PAGINABLE_EVENTS_RESPONSE = {
  content: Array(total)
    .fill(null)
    .slice(page, size)
    .map(() => ({
      id: faker.string.uuid(),
      title: faker.lorem.slug(),
      description: faker.lorem.sentences(),
      createdAt: faker.date.past().toISOString(),
      startsAt: faker.date.recent().toISOString(),
      endsAt: faker.date.soon().toISOString(),
      color: 'BLUE',
    })),
  page,
  size,
  total,
}
