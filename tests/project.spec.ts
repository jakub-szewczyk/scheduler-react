import { setupClerkTestingToken } from '@clerk/testing/playwright'
import { faker } from '@faker-js/faker'
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

test('navigating to the next page', async ({ page, isMobile }) => {
  await setupClerkTestingToken({
    page,
    options: { frontendApiUrl: BASE_APP_URL },
  })
  const url = `${VITE_BASE_API_URL}/projects*`
  await page.route(url, (route) => route.fulfill({ json: PAGINABLE_RESPONSE }))
  let promise = page.waitForResponse(url)
  await page.goto(`${BASE_APP_URL}/projects`)
  if (isMobile) {
    await expect(page.getByText('1/10')).toBeVisible()
  } else {
    await expect(page.getByText('Page 1 of 10')).toBeVisible()
  }
  expect((await promise).url().includes('page=0')).toBeTruthy()
  promise = page.waitForResponse(url)
  await page.getByTestId('next-page').click()
  if (isMobile) {
    await expect(page.getByText('2/10')).toBeVisible()
  } else {
    await expect(page.getByText('Page 2 of 10')).toBeVisible()
  }
  expect((await promise).url().includes('page=1')).toBeTruthy()
})

test('navigating to the previous page', async ({ page, isMobile }) => {
  await setupClerkTestingToken({
    page,
    options: { frontendApiUrl: BASE_APP_URL },
  })
  const url = `${VITE_BASE_API_URL}/projects*`
  await page.route(url, (route) => route.fulfill({ json: PAGINABLE_RESPONSE }))
  let promise = page.waitForResponse(url)
  await page.goto(`${BASE_APP_URL}/projects?page=9`)
  if (isMobile) {
    await expect(page.getByText('10/10')).toBeVisible()
  } else {
    await expect(page.getByText('Page 10 of 10')).toBeVisible()
  }
  expect((await promise).url().includes('page=9')).toBeTruthy()
  promise = page.waitForResponse(url)
  await page.getByTestId('previous-page').click()
  if (isMobile) {
    await expect(page.getByText('9/10')).toBeVisible()
  } else {
    await expect(page.getByText('Page 9 of 10')).toBeVisible()
  }
  expect((await promise).url().includes('page=8')).toBeTruthy()
})

test('navigating to the last page', async ({ page, isMobile }) => {
  await setupClerkTestingToken({
    page,
    options: { frontendApiUrl: BASE_APP_URL },
  })
  const url = `${VITE_BASE_API_URL}/projects*`
  await page.route(url, (route) => route.fulfill({ json: PAGINABLE_RESPONSE }))
  let promise = page.waitForResponse(url)
  await page.goto(`${BASE_APP_URL}/projects`)
  if (isMobile) {
    await expect(page.getByText('1/10')).toBeVisible()
  } else {
    await expect(page.getByText('Page 1 of 10')).toBeVisible()
  }
  expect((await promise).url().includes('page=0')).toBeTruthy()
  promise = page.waitForResponse(url)
  await page.getByTestId('last-page').click()
  if (isMobile) {
    await expect(page.getByText('10/10')).toBeVisible()
  } else {
    await expect(page.getByText('Page 10 of 10')).toBeVisible()
  }
  expect((await promise).url().includes('page=9')).toBeTruthy()
})

test('navigating to the first page', async ({ page, isMobile }) => {
  await setupClerkTestingToken({
    page,
    options: { frontendApiUrl: BASE_APP_URL },
  })
  const url = `${VITE_BASE_API_URL}/projects*`
  await page.route(url, (route) => route.fulfill({ json: PAGINABLE_RESPONSE }))
  let promise = page.waitForResponse(url)
  await page.goto(`${BASE_APP_URL}/projects?page=9`)
  if (isMobile) {
    await expect(page.getByText('10/10')).toBeVisible()
  } else {
    await expect(page.getByText('Page 10 of 10')).toBeVisible()
  }
  expect((await promise).url().includes('page=9')).toBeTruthy()
  promise = page.waitForResponse(url)
  await page.getByTestId('first-page').click()
  if (isMobile) {
    await expect(page.getByText('1/10')).toBeVisible()
  } else {
    await expect(page.getByText('Page 1 of 10')).toBeVisible()
  }
  expect((await promise).url().includes('page=0')).toBeTruthy()
})

test('increasing page size', async ({ page, isMobile }) => {
  await setupClerkTestingToken({
    page,
    options: { frontendApiUrl: BASE_APP_URL },
  })
  const url = `${VITE_BASE_API_URL}/projects*`
  await page.route(url, (route) => route.fulfill({ json: PAGINABLE_RESPONSE }))
  let promise = page.waitForResponse(url)
  await page.goto(`${BASE_APP_URL}/projects`)
  expect((await promise).url().includes('size=10')).toBeTruthy()
  if (isMobile) {
    await expect(page.getByText('1/10')).toBeVisible()
  } else {
    await expect(page.getByText('Page 1 of 10')).toBeVisible()
  }
  promise = page.waitForResponse(url)
  await page.getByRole('combobox').click()
  await page.getByLabel('20').click()
  expect((await promise).url().includes('size=20')).toBeTruthy()
  if (isMobile) {
    await expect(page.getByText('1/5')).toBeVisible()
  } else {
    await expect(page.getByText('Page 1 of 5')).toBeVisible()
  }
  promise = page.waitForResponse(url)
  await page.getByRole('combobox').click()
  await page.getByLabel('50').click()
  if (isMobile) {
    await expect(page.getByText('1/2', { exact: true })).toBeVisible()
  } else {
    await expect(page.getByText('Page 1 of 2')).toBeVisible()
  }
  expect((await promise).url().includes('size=50')).toBeTruthy()
  promise = page.waitForResponse(url)
  await page.getByRole('combobox').click()
  await page.getByLabel('100').click()
  expect((await promise).url().includes('size=100')).toBeTruthy()
  if (isMobile) {
    await expect(page.getByText('1/1')).toBeVisible()
  } else {
    await expect(page.getByText('Page 1 of 1')).toBeVisible()
  }
})

test('sorting by creation date', async ({ page }) => {
  await setupClerkTestingToken({
    page,
    options: { frontendApiUrl: BASE_APP_URL },
  })
  const url = `${VITE_BASE_API_URL}/projects*`
  await page.route(url, (route) => route.fulfill({ json: PAGINABLE_RESPONSE }))
  let promise = page.waitForResponse(url)
  await page.goto(`${BASE_APP_URL}/projects`)
  expect((await promise).url().includes('createdAt=DESC')).toBeTruthy()
  promise = page.waitForResponse(url)
  await page.getByRole('button', { name: 'Created at' }).click()
  expect((await promise).url().includes('createdAt=ASC')).toBeTruthy()
})

test('searching by title', async ({ page }) => {
  await setupClerkTestingToken({
    page,
    options: { frontendApiUrl: BASE_APP_URL },
  })
  const url = `${VITE_BASE_API_URL}/projects*`
  await page.route(url, (route) => route.fulfill({ json: PAGINABLE_RESPONSE }))
  let promise = page.waitForResponse(url)
  await page.goto(`${BASE_APP_URL}/projects`)
  expect((await promise).url().includes('title=')).toBeTruthy()
  promise = page.waitForResponse(url)
  const slug = faker.lorem.slug()
  await page.getByPlaceholder('Search by title').fill(slug)
  expect((await promise).url().includes(`title=${slug}`)).toBeTruthy()
  await expect(page.getByPlaceholder('Search by title')).toHaveValue(slug)
})

// TODO: Test deleting projects
