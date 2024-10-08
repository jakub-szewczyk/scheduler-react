import { PaginableResponse } from '@/types/api'
import { Project } from '@/types/project'
import { faker } from '@faker-js/faker'
import { format } from 'date-fns'

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

const refDate = `2024-${format(new Date(), 'MM')}-27T12:49:17.572Z`

export const PAGINABLE_EVENTS_RESPONSE = {
  content: Array(total)
    .fill(null)
    .slice(page, size)
    .map(() => ({
      id: faker.string.uuid(),
      title: faker.lorem.slug(),
      description: faker.lorem.sentences(),
      createdAt: faker.date.past().toISOString(),
      startsAt: faker.date.recent({ refDate }).toISOString(),
      endsAt: faker.date.soon({ refDate }).toISOString(),
      color: 'BLUE',
    })),
  page,
  size,
  total,
}
