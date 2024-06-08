import { setupClerkTestingToken } from '@clerk/testing/playwright'
import { expect, test } from '@playwright/test'
import {
  EMPTY_PAGINABLE_RESPONSE,
  PAGINABLE_RESPONSE,
} from '../src/mocks/common'

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
  await page.route(`${VITE_BASE_API_URL}/projects*`, (route) => {
    const urlSearchParams = new URLSearchParams(
      new URL(route.request().url()).search
    )
    const page = +(urlSearchParams.get('page') || 0)
    const size = +(urlSearchParams.get('size') || 10)
    return route.fulfill({
      json: PAGINABLE_RESPONSE({ page, size, total: 100 }),
    })
  })
  await page.goto(`${BASE_APP_URL}/projects`)
  await expect(page.getByRole('cell', { name: 'Project #100' })).toBeVisible()
  // TODO: Navigate
})
