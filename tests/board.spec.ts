import { setupClerkTestingToken } from '@clerk/testing/playwright'
import { faker } from '@faker-js/faker'
import { expect, test } from '@playwright/test'
import {
  EMPTY_PAGINABLE_RESPONSE,
  PAGINABLE_RESPONSE,
  SUBJECT,
} from '../src/mocks/common'

const APP_BASE_URL = process.env.APP_BASE_URL

const VITE_API_BASE_URL = process.env.VITE_API_BASE_URL

if (!APP_BASE_URL || !VITE_API_BASE_URL)
  throw new Error(
    'missing one of environment variables: [APP_BASE_URL, VITE_API_BASE_URL]'
  )

test.describe('boards page', () => {
  test('rendering title and description', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(`${VITE_API_BASE_URL}/boards*`, (route) =>
      route.fulfill({ json: EMPTY_PAGINABLE_RESPONSE })
    )
    await page.goto(
      `${APP_BASE_URL}/projects/${PAGINABLE_RESPONSE.content[0].id}/boards`
    )
    await expect(page.getByRole('heading', { name: 'Boards' })).toBeVisible()
    await expect(page.getByRole('main')).toContainText(
      'Welcome to your boards page. Here you can view and manage all your kanban boards seamlessly. Create new boards, edit existing ones, and remove those that are no longer relevant. Boards consist of status columns and issue rows, making it easy to track progress and organize tasks. Search by title and sort by creation date to keep everything tidy. Click on any board to see its full details and keep your projects on track.'
    )
  })

  test('rendering empty table', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(`${VITE_API_BASE_URL}/boards*`, (route) =>
      route.fulfill({ json: EMPTY_PAGINABLE_RESPONSE })
    )
    await page.goto(
      `${APP_BASE_URL}/projects/${PAGINABLE_RESPONSE.content[0].id}/boards`
    )
    await expect(page.getByRole('cell', { name: 'No results' })).toBeVisible()
  })

  test('navigating to the next page', async ({ page, isMobile }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    const url = `${VITE_API_BASE_URL}/projects/*/boards*`
    await page.route(url, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    let promise = page.waitForResponse(url)
    await page.goto(
      `${APP_BASE_URL}/projects/${PAGINABLE_RESPONSE.content[0].id}/boards`
    )
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
      options: { frontendApiUrl: APP_BASE_URL },
    })
    const url = `${VITE_API_BASE_URL}/projects/*/boards*`
    await page.route(url, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    let promise = page.waitForResponse(url)
    await page.goto(
      `${APP_BASE_URL}/projects/${PAGINABLE_RESPONSE.content[0].id}/boards?page=9`
    )
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
      options: { frontendApiUrl: APP_BASE_URL },
    })
    const url = `${VITE_API_BASE_URL}/projects/*/boards*`
    await page.route(url, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    let promise = page.waitForResponse(url)
    await page.goto(
      `${APP_BASE_URL}/projects/${PAGINABLE_RESPONSE.content[0].id}/boards`
    )
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
      options: { frontendApiUrl: APP_BASE_URL },
    })
    const url = `${VITE_API_BASE_URL}/projects/*/boards*`
    await page.route(url, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    let promise = page.waitForResponse(url)
    await page.goto(
      `${APP_BASE_URL}/projects/${PAGINABLE_RESPONSE.content[0].id}/boards?page=9`
    )
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
      options: { frontendApiUrl: APP_BASE_URL },
    })
    const url = `${VITE_API_BASE_URL}/projects/*/boards*`
    await page.route(url, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    let promise = page.waitForResponse(url)
    await page.goto(
      `${APP_BASE_URL}/projects/${PAGINABLE_RESPONSE.content[0].id}/boards`
    )
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
      options: { frontendApiUrl: APP_BASE_URL },
    })
    const url = `${VITE_API_BASE_URL}/projects/*/boards*`
    await page.route(url, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    let promise = page.waitForResponse(url)
    await page.goto(
      `${APP_BASE_URL}/projects/${PAGINABLE_RESPONSE.content[0].id}/boards`
    )
    expect((await promise).url().includes('createdAt=DESC')).toBeTruthy()
    promise = page.waitForResponse(url)
    await page.getByRole('button', { name: 'Created at' }).click()
    expect((await promise).url().includes('createdAt=ASC')).toBeTruthy()
  })

  test('searching by title', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    const url = `${VITE_API_BASE_URL}/projects/*/boards*`
    await page.route(url, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    let promise = page.waitForResponse(url)
    await page.goto(
      `${APP_BASE_URL}/projects/${PAGINABLE_RESPONSE.content[0].id}/boards`
    )
    expect((await promise).url().includes('title=')).toBeTruthy()
    promise = page.waitForResponse(url)
    const slug = faker.lorem.slug()
    await page.getByPlaceholder('Search by title').fill(slug)
    expect((await promise).url().includes(`title=${slug}`)).toBeTruthy()
    await expect(page.getByPlaceholder('Search by title')).toHaveValue(slug)
  })

  test('deleting one board', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(`${VITE_API_BASE_URL}/projects/*/boards*`, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    await page.route(`${VITE_API_BASE_URL}/projects/*/boards/*`, (route) =>
      route.fulfill({
        json: {
          id: faker.string.uuid(),
          title: faker.lorem.slug(),
          description: faker.lorem.sentences(),
          createdAt: faker.date.past().toISOString(),
        },
      })
    )
    await page.goto(
      `${APP_BASE_URL}/projects/${PAGINABLE_RESPONSE.content[0].id}/boards`
    )
    await page
      .getByRole('row', { name: 'socius-accusator-corona Tergo' })
      .getByRole('button')
      .click()
    await page.getByRole('menuitem', { name: 'Delete' }).click()
    await expect(
      page
        .getByLabel('Warning: Permanent Deletion')
        .getByText('socius-accusator-corona')
    ).toBeVisible()
    const promise1 = page.waitForResponse(
      (response) => response.request().method() === 'DELETE'
    )
    const promise2 = page.waitForResponse(
      (response) => response.request().method() === 'GET'
    )
    await page.getByRole('button', { name: 'Yes, delete' }).click()
    expect((await promise1).request().method()).toBe('DELETE')
    expect((await promise2).request().method()).toBe('GET')
  })

  test('deleting many boards', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(`${VITE_API_BASE_URL}/projects/*/boards*`, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    await page.route(`${VITE_API_BASE_URL}/projects/*/boards/*`, (route) =>
      route.fulfill({
        json: {
          id: faker.string.uuid(),
          title: faker.lorem.slug(),
          description: faker.lorem.sentences(),
          createdAt: faker.date.past().toISOString(),
        },
      })
    )
    await page.goto(
      `${APP_BASE_URL}/projects/${PAGINABLE_RESPONSE.content[0].id}/boards`
    )
    await page
      .getByRole('row', { name: 'socius-accusator-corona Tergo' })
      .getByRole('checkbox')
      .check()
    await page
      .getByRole('row', { name: 'qui-articulus-confero' })
      .getByRole('checkbox')
      .check()
    await page.getByRole('button', { name: 'Delete selected' }).click()
    await expect(
      page
        .getByLabel('Warning: Permanent Deletion')
        .getByText('socius-accusator-corona, qui-articulus-confero')
    ).toBeVisible()
    const promise1 = page.waitForResponse(
      (response) => response.request().method() === 'DELETE'
    )
    const promise2 = page.waitForResponse(
      (response) => response.request().method() === 'GET'
    )
    await page.getByRole('button', { name: 'Yes, delete' }).click()
    expect((await promise1).request().method()).toBe('DELETE')
    expect((await promise2).request().method()).toBe('GET')
  })

  test('navigating to "New Board" page', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(`${VITE_API_BASE_URL}/projects/*/boards*`, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    await page.route(`${VITE_API_BASE_URL}/projects/*/boards/*`, (route) =>
      route.fulfill({
        json: {
          id: faker.string.uuid(),
          title: faker.lorem.slug(),
          description: faker.lorem.sentences(),
          createdAt: faker.date.past().toISOString(),
        },
      })
    )
    await page.goto(
      `${APP_BASE_URL}/projects/${PAGINABLE_RESPONSE.content[0].id}/boards`
    )
    await page.getByRole('link', { name: 'New Board' }).click()
    expect(page.url()).toBe(
      `${APP_BASE_URL}/projects/${PAGINABLE_RESPONSE.content[0].id}/boards/new`
    )
  })

  test('navigating to "Edit Board" page', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(`${VITE_API_BASE_URL}/projects/*/boards*`, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    const id = faker.string.uuid()
    await page.route(`${VITE_API_BASE_URL}/projects/*/boards/*`, (route) =>
      route.fulfill({
        json: {
          id,
          title: faker.lorem.slug(),
          description: faker.lorem.sentences(),
          createdAt: faker.date.past().toISOString(),
        },
      })
    )
    await page.goto(
      `${APP_BASE_URL}/projects/${PAGINABLE_RESPONSE.content[0].id}/boards`
    )
    await page
      .getByRole('row', { name: 'socius-accusator-corona Tergo' })
      .getByRole('button')
      .click()
    await page.getByRole('menuitem', { name: 'Edit' }).click()
    expect(page.url()).toBe(
      `${APP_BASE_URL}/projects/${PAGINABLE_RESPONSE.content[0].id}/boards/${PAGINABLE_RESPONSE.content[0].id}/edit`
    )
  })

  test('navigating to "Board Details" page using a link', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(`${VITE_API_BASE_URL}/projects/*/boards*`, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    await page.route(`${VITE_API_BASE_URL}/projects/*/boards/*`, (route) =>
      route.fulfill({
        json: {
          id: faker.string.uuid(),
          title: faker.lorem.slug(),
          description: faker.lorem.sentences(),
          createdAt: faker.date.past().toISOString(),
        },
      })
    )
    await page.goto(
      `${APP_BASE_URL}/projects/${PAGINABLE_RESPONSE.content[0].id}/boards`
    )
    await page.getByRole('link', { name: 'socius-accusator-corona' }).click()
    expect(page.url()).toBe(
      `${APP_BASE_URL}/projects/${PAGINABLE_RESPONSE.content[0].id}/boards/${PAGINABLE_RESPONSE.content[0].id}`
    )
  })

  test('navigating to "Board Details" page using the dropdown menu', async ({
    page,
  }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(`${VITE_API_BASE_URL}/projects/*/boards*`, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    await page.route(`${VITE_API_BASE_URL}/projects/*/boards/*`, (route) =>
      route.fulfill({
        json: {
          id: faker.string.uuid(),
          title: faker.lorem.slug(),
          description: faker.lorem.sentences(),
          createdAt: faker.date.past().toISOString(),
        },
      })
    )
    await page.goto(
      `${APP_BASE_URL}/projects/${PAGINABLE_RESPONSE.content[0].id}/boards`
    )
    await page
      .getByRole('row', { name: 'socius-accusator-corona Tergo' })
      .getByRole('button')
      .click()
    await page.getByRole('menuitem', { name: 'Details' }).click()
    expect(page.url()).toBe(
      `${APP_BASE_URL}/projects/${PAGINABLE_RESPONSE.content[0].id}/boards/${PAGINABLE_RESPONSE.content[0].id}`
    )
  })
})

test.describe('new board page', () => {
  test('rendering title and description', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.goto(`${APP_BASE_URL}/projects/${SUBJECT.id}/boards/new`)
    await expect(page.getByRole('heading', { name: 'New Board' })).toBeVisible()
    await expect(page.getByRole('main')).toContainText(
      "Set up your new board by entering a title and description. Choose a title that reflects the purpose of your board and use the description to detail its objectives and the types of tasks it will manage. Once you're done, submit the form to create your kanban board and start organizing your tasks."
    )
  })

  test('title being required', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(
      `${VITE_API_BASE_URL}/projects/*/boards`,
      (route) =>
        route.request().method() === 'POST' &&
        route.fulfill({
          json: {
            id: faker.string.uuid(),
            title: faker.lorem.slug(),
            description: faker.lorem.sentences(),
            createdAt: faker.date.past().toISOString(),
          },
        })
    )
    await page.goto(`${APP_BASE_URL}/projects/${SUBJECT.id}/boards/new`)
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByText('This field is required')).toBeVisible()
  })

  test('creating board', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(
      `${VITE_API_BASE_URL}/projects/*/boards*`,
      (route) =>
        route.request().method() === 'GET' &&
        route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    const id = faker.string.uuid()
    const title = faker.lorem.slug()
    const description = faker.lorem.sentences()
    const json = {
      id,
      title,
      description,
      createdAt: faker.date.past().toISOString(),
    }
    await page.route(
      `${VITE_API_BASE_URL}/projects/*/boards/*`,
      (route) =>
        route.request().method() === 'GET' &&
        route.fulfill({
          json,
        })
    )
    await page.route(
      `${VITE_API_BASE_URL}/projects/*/boards`,
      (route) =>
        route.request().method() === 'POST' &&
        route.fulfill({
          json,
        })
    )
    await page.goto(`${APP_BASE_URL}/projects/${SUBJECT.id}/boards/new`)
    await page.getByPlaceholder('Enter title').fill(title)
    await page.getByPlaceholder('Enter description').fill(description)
    const promise1 = page.waitForResponse(
      (response) => response.request().method() === 'POST'
    )
    const promise2 = page.waitForResponse(
      (response) => response.request().method() === 'GET'
    )
    await page.getByRole('button', { name: 'Submit' }).click()
    expect((await promise1).request().method()).toBe('POST')
    expect((await promise2).request().method()).toBe('GET')
    expect(page.url()).toBe(
      `${APP_BASE_URL}/projects/${SUBJECT.id}/boards/${id}`
    )
    await expect(page.getByText('Board created', { exact: true })).toBeVisible()
    await expect(
      page.getByText(`${title} has been successfully created`, {
        exact: true,
      })
    ).toBeVisible()
  })
})

test.describe('edit board page', () => {
  test('rendering title and description', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    const id = faker.string.uuid()
    await page.route(
      `${VITE_API_BASE_URL}/projects/*/boards/*`,
      (route) =>
        route.request().method() === 'GET' &&
        route.fulfill({
          json: {
            id,
            title: faker.lorem.slug(),
            description: faker.lorem.sentences(),
            createdAt: faker.date.past().toISOString(),
          },
        })
    )
    await page.goto(`${APP_BASE_URL}/projects/${SUBJECT.id}/boards/${id}/edit`)
    await expect(
      page.getByRole('heading', { name: 'Edit Board' })
    ).toBeVisible()
    await expect(page.getByRole('main')).toContainText(
      "Edit your board by updating its title and description. Adjust the title to better reflect the board's current purpose, and revise the description to accurately capture any new objectives or changes in the types of tasks it manages. Once you're done, submit the form to save your updates and keep your kanban board current."
    )
  })

  test('title being required', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    const id = faker.string.uuid()
    await page.route(
      `${VITE_API_BASE_URL}/projects/*/boards/*`,
      (route) =>
        route.request().method() === 'GET' &&
        route.fulfill({
          json: {
            id,
            title: faker.lorem.slug(),
            description: faker.lorem.sentences(),
            createdAt: faker.date.past().toISOString(),
          },
        })
    )
    await page.goto(`${APP_BASE_URL}/projects/${SUBJECT.id}/boards/${id}/edit`)
    await page.getByPlaceholder('Enter title').clear()
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByText('This field is required')).toBeVisible()
  })

  test('updating board', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(
      `${VITE_API_BASE_URL}/projects/*/boards*`,
      (route) =>
        route.request().method() === 'GET' &&
        route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    const id = faker.string.uuid()
    await page.route(
      `${VITE_API_BASE_URL}/projects/${SUBJECT.id}/boards/*`,
      (route) =>
        route.request().method() === 'GET' &&
        route.fulfill({
          json: {
            id,
            title: faker.lorem.slug(),
            description: faker.lorem.sentences(),
            createdAt: faker.date.past().toISOString(),
          },
        })
    )
    const title = faker.lorem.slug()
    const description = faker.lorem.sentences()
    await page.route(`${VITE_API_BASE_URL}/projects/*/boards/${id}`, (route) =>
      route.fulfill({
        json: {
          id,
          title,
          description,
          createdAt: faker.date.past().toISOString(),
        },
      })
    )
    await page.goto(`${APP_BASE_URL}/projects/${SUBJECT.id}/boards/${id}/edit`)
    await page.getByPlaceholder('Enter title').fill(title)
    await page.getByPlaceholder('Enter description').fill(description)
    const promise1 = page.waitForResponse(
      (response) => response.request().method() === 'PUT'
    )
    const promise2 = page.waitForResponse(
      (response) => response.request().method() === 'GET'
    )
    await page.getByRole('button', { name: 'Submit' }).click()
    expect((await promise1).request().method()).toBe('PUT')
    expect((await promise2).request().method()).toBe('GET')
    expect(page.url()).toBe(
      `${APP_BASE_URL}/projects/${SUBJECT.id}/boards/${id}`
    )
    await expect(page.getByText('Board updated', { exact: true })).toBeVisible()
    await expect(
      page.getByText(`${title} has been successfully updated`, {
        exact: true,
      })
    ).toBeVisible()
  })
})
