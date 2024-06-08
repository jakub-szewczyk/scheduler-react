import { setupClerkTestingToken } from '@clerk/testing/playwright'
import { expect, test } from '@playwright/test'
import {
  EMPTY_PAGINABLE_RESPONSE,
  PAGINABLE_RESPONSE,
} from '../src/mocks/common'
import { searchParam } from '../src/utils/common'

const BASE_APP_URL = process.env.BASE_APP_URL

const VITE_BASE_API_URL = process.env.VITE_BASE_API_URL

if (!BASE_APP_URL || !VITE_BASE_API_URL)
  throw new Error(
    'missing one of environment variables: [BASE_APP_URL, VITE_BASE_API_URL]'
  )

test('rendering title and description', async ({ page }) => {
  await setupClerkTestingToken({
    page,
    options: { frontendApiUrl: BASE_APP_URL },
  })
  await page.route(`${VITE_BASE_API_URL}/projects*`, (route) =>
    route.fulfill({ json: EMPTY_PAGINABLE_RESPONSE })
  )
  await page.goto('/projects')
  await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible()
  await expect(page.getByRole('main')).toContainText(
    'Welcome to your project management page. View and manage all your projects effortlessly. Create new projects, edit existing ones, and delete those you no longer need. Easily search by title and sort by creation date to keep everything organized. Click on any project to see its full details.'
  )
})

test('rendering empty table', async ({ page }) => {
  await setupClerkTestingToken({
    page,
    options: { frontendApiUrl: BASE_APP_URL },
  })
  await page.route(`${VITE_BASE_API_URL}/projects*`, (route) =>
    route.fulfill({ json: EMPTY_PAGINABLE_RESPONSE })
  )
  await page.goto(`${BASE_APP_URL}/projects`)
  await expect(page.getByRole('cell', { name: 'No results' })).toBeVisible()
})

test('navigating through pages', async ({ page }) => {
  await setupClerkTestingToken({
    page,
    options: { frontendApiUrl: BASE_APP_URL },
  })
  const total = 100
  await page.route(`${VITE_BASE_API_URL}/projects*`, (route) => {
    const page = +(searchParam('page', route.request().url()) || 0)
    const size = +(searchParam('size', route.request().url()) || 10)
    return route.fulfill({ json: PAGINABLE_RESPONSE({ page, size, total }) })
  })
  await page.goto(`${BASE_APP_URL}/projects`)
  const iterations = Array(total / +(searchParam('size', page.url()) || 10))
    .fill(null)
    .map((_, index) => index)
  for (const iteration of iterations) {
    await Promise.all(
      Array(+(searchParam('size', page.url()) || 10))
        .fill(null)
        .map((_, index) =>
          expect(
            page.getByRole('cell', {
              name: `Project #${total - +(searchParam('page', page.url()) || 0) * +(searchParam('size', page.url()) || 10) - index}`,
              exact: true,
            })
          ).toBeVisible()
        )
    )
    if (iteration < iterations.length - 1)
      await page.getByTestId('next-page').click()
  }
})
