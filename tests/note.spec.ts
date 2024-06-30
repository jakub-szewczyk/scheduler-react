import { setupClerkTestingToken } from '@clerk/testing/playwright'
import { faker } from '@faker-js/faker'
import { expect, test } from '@playwright/test'
import {
  EMPTY_PAGINABLE_RESPONSE,
  PAGINABLE_RESPONSE,
  SUBJECT,
} from '../src/mocks/common'

const BASE_APP_URL = process.env.BASE_APP_URL

const VITE_BASE_API_URL = process.env.VITE_BASE_API_URL

if (!BASE_APP_URL || !VITE_BASE_API_URL)
  throw new Error(
    'missing one of environment variables: [BASE_APP_URL, VITE_BASE_API_URL]'
  )

test.describe('notes page', () => {
  test('rendering title and description', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: BASE_APP_URL },
    })
    await page.route(`${VITE_BASE_API_URL}/notes*`, (route) =>
      route.fulfill({ json: EMPTY_PAGINABLE_RESPONSE })
    )
    await page.goto(
      `${BASE_APP_URL}/projects/${PAGINABLE_RESPONSE.content[0].id}/notes`
    )
    await expect(page.getByRole('heading', { name: 'Notes' })).toBeVisible()
    await expect(page.getByRole('main')).toContainText(
      'Welcome to your notes page. Manage all your notes effortlessly in one place. Create new notes, edit existing ones, and delete those you no longer need. Enjoy writing your notes in a user-friendly WYSIWYG editor that enhances your writing experience. Use the search function to find notes by title and sort them by creation date to stay organized. Click on any note to see its full details and keep your thoughts well-documented.'
    )
  })

  test('rendering empty table', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: BASE_APP_URL },
    })
    await page.route(`${VITE_BASE_API_URL}/notes*`, (route) =>
      route.fulfill({ json: EMPTY_PAGINABLE_RESPONSE })
    )
    await page.goto(
      `${BASE_APP_URL}/projects/${PAGINABLE_RESPONSE.content[0].id}/notes`
    )
    await expect(page.getByRole('cell', { name: 'No results' })).toBeVisible()
  })

  test('navigating to the next page', async ({ page, isMobile }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: BASE_APP_URL },
    })
    const url = `${VITE_BASE_API_URL}/projects/*/notes*`
    await page.route(url, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    let promise = page.waitForResponse(url)
    await page.goto(
      `${BASE_APP_URL}/projects/${PAGINABLE_RESPONSE.content[0].id}/notes`
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
      options: { frontendApiUrl: BASE_APP_URL },
    })
    const url = `${VITE_BASE_API_URL}/projects/*/notes*`
    await page.route(url, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    let promise = page.waitForResponse(url)
    await page.goto(
      `${BASE_APP_URL}/projects/${PAGINABLE_RESPONSE.content[0].id}/notes?page=9`
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
      options: { frontendApiUrl: BASE_APP_URL },
    })
    const url = `${VITE_BASE_API_URL}/projects/*/notes*`
    await page.route(url, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    let promise = page.waitForResponse(url)
    await page.goto(
      `${BASE_APP_URL}/projects/${PAGINABLE_RESPONSE.content[0].id}/notes`
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
      options: { frontendApiUrl: BASE_APP_URL },
    })
    const url = `${VITE_BASE_API_URL}/projects/*/notes*`
    await page.route(url, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    let promise = page.waitForResponse(url)
    await page.goto(
      `${BASE_APP_URL}/projects/${PAGINABLE_RESPONSE.content[0].id}/notes?page=9`
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
      options: { frontendApiUrl: BASE_APP_URL },
    })
    const url = `${VITE_BASE_API_URL}/projects/*/notes*`
    await page.route(url, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    let promise = page.waitForResponse(url)
    await page.goto(
      `${BASE_APP_URL}/projects/${PAGINABLE_RESPONSE.content[0].id}/notes`
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
      options: { frontendApiUrl: BASE_APP_URL },
    })
    const url = `${VITE_BASE_API_URL}/projects/*/notes*`
    await page.route(url, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    let promise = page.waitForResponse(url)
    await page.goto(
      `${BASE_APP_URL}/projects/${PAGINABLE_RESPONSE.content[0].id}/notes`
    )
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
    const url = `${VITE_BASE_API_URL}/projects/*/notes*`
    await page.route(url, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    let promise = page.waitForResponse(url)
    await page.goto(
      `${BASE_APP_URL}/projects/${PAGINABLE_RESPONSE.content[0].id}/notes`
    )
    expect((await promise).url().includes('title=')).toBeTruthy()
    promise = page.waitForResponse(url)
    const slug = faker.lorem.slug()
    await page.getByPlaceholder('Search by title').fill(slug)
    expect((await promise).url().includes(`title=${slug}`)).toBeTruthy()
    await expect(page.getByPlaceholder('Search by title')).toHaveValue(slug)
  })

  test('deleting one note', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: BASE_APP_URL },
    })
    await page.route(`${VITE_BASE_API_URL}/projects/*/notes*`, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    await page.route(`${VITE_BASE_API_URL}/projects/*/notes/*`, (route) =>
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
      `${BASE_APP_URL}/projects/${PAGINABLE_RESPONSE.content[0].id}/notes`
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

  test('deleting many notes', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: BASE_APP_URL },
    })
    await page.route(`${VITE_BASE_API_URL}/projects/*/notes*`, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    await page.route(`${VITE_BASE_API_URL}/projects/*/notes/*`, (route) =>
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
      `${BASE_APP_URL}/projects/${PAGINABLE_RESPONSE.content[0].id}/notes`
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

  test('navigating to "New Note" page', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: BASE_APP_URL },
    })
    await page.route(`${VITE_BASE_API_URL}/projects/*/notes*`, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    await page.route(`${VITE_BASE_API_URL}/projects/*/notes/*`, (route) =>
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
      `${BASE_APP_URL}/projects/${PAGINABLE_RESPONSE.content[0].id}/notes`
    )
    await page.getByRole('link', { name: 'New Note' }).click()
    expect(page.url()).toBe(
      `${BASE_APP_URL}/projects/${PAGINABLE_RESPONSE.content[0].id}/notes/new`
    )
  })

  test('navigating to "Edit Note" page', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: BASE_APP_URL },
    })
    await page.route(`${VITE_BASE_API_URL}/projects/*/notes*`, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    const id = faker.string.uuid()
    await page.route(`${VITE_BASE_API_URL}/projects/*/notes/*`, (route) =>
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
      `${BASE_APP_URL}/projects/${PAGINABLE_RESPONSE.content[0].id}/notes`
    )
    await page
      .getByRole('row', { name: 'socius-accusator-corona Tergo' })
      .getByRole('button')
      .click()
    await page.getByRole('menuitem', { name: 'Edit' }).click()
    expect(page.url()).toBe(
      `${BASE_APP_URL}/projects/${PAGINABLE_RESPONSE.content[0].id}/notes/${PAGINABLE_RESPONSE.content[0].id}/edit`
    )
  })

  test('navigating to "Note Details" page using a link', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: BASE_APP_URL },
    })
    await page.route(`${VITE_BASE_API_URL}/projects/*/notes*`, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    await page.route(`${VITE_BASE_API_URL}/projects/*/notes/*`, (route) =>
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
      `${BASE_APP_URL}/projects/${PAGINABLE_RESPONSE.content[0].id}/notes`
    )
    await page.getByRole('link', { name: 'socius-accusator-corona' }).click()
    expect(page.url()).toBe(
      `${BASE_APP_URL}/projects/${PAGINABLE_RESPONSE.content[0].id}/notes/${PAGINABLE_RESPONSE.content[0].id}`
    )
  })

  test('navigating to "Note Details" page using the dropdown menu', async ({
    page,
  }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: BASE_APP_URL },
    })
    await page.route(`${VITE_BASE_API_URL}/projects/*/notes*`, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    await page.route(`${VITE_BASE_API_URL}/projects/*/notes/*`, (route) =>
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
      `${BASE_APP_URL}/projects/${PAGINABLE_RESPONSE.content[0].id}/notes`
    )
    await page
      .getByRole('row', { name: 'socius-accusator-corona Tergo' })
      .getByRole('button')
      .click()
    await page.getByRole('menuitem', { name: 'Details' }).click()
    expect(page.url()).toBe(
      `${BASE_APP_URL}/projects/${PAGINABLE_RESPONSE.content[0].id}/notes/${PAGINABLE_RESPONSE.content[0].id}`
    )
  })
})

test.describe('new note page', () => {
  test('rendering title and description', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: BASE_APP_URL },
    })
    await page.goto(`${BASE_APP_URL}/projects/${SUBJECT.id}/notes/new`)
    await expect(page.getByRole('heading', { name: 'New Note' })).toBeVisible()
    await expect(page.getByRole('main')).toContainText(
      "Create a new note by entering a title and description. Choose a title that captures the essence of your note, and use the description to elaborate on the key points or details. Once you're done, submit the form to save your note and keep your information organized."
    )
  })

  test('title being required', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: BASE_APP_URL },
    })
    await page.route(
      `${VITE_BASE_API_URL}/projects/*/notes`,
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
    await page.goto(`${BASE_APP_URL}/projects/${SUBJECT.id}/notes/new`)
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByText('This field is required')).toBeVisible()
  })

  test('creating note', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: BASE_APP_URL },
    })
    await page.route(
      `${VITE_BASE_API_URL}/projects/*/notes*`,
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
      `${VITE_BASE_API_URL}/projects/*/notes/*`,
      (route) =>
        route.request().method() === 'GET' &&
        route.fulfill({
          json,
        })
    )
    await page.route(
      `${VITE_BASE_API_URL}/projects/*/notes`,
      (route) =>
        route.request().method() === 'POST' &&
        route.fulfill({
          json,
        })
    )
    await page.goto(`${BASE_APP_URL}/projects/${SUBJECT.id}/notes/new`)
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
      `${BASE_APP_URL}/projects/${SUBJECT.id}/notes/${id}`
    )
    await expect(page.getByText('Note created', { exact: true })).toBeVisible()
    await expect(
      page.getByText(`${title} has been successfully created`, {
        exact: true,
      })
    ).toBeVisible()
  })
})

test.describe('edit note page', () => {
  test('rendering title and description', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: BASE_APP_URL },
    })
    const id = faker.string.uuid()
    await page.route(
      `${VITE_BASE_API_URL}/projects/*/notes/*`,
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
    await page.goto(`${BASE_APP_URL}/projects/${SUBJECT.id}/notes/${id}/edit`)
    await expect(page.getByRole('heading', { name: 'Edit Note' })).toBeVisible()
    await expect(page.getByRole('main')).toContainText(
      "Edit your note by updating its title and description. Adjust the title to better reflect the note's content, and revise the description to include any new details or changes. Once you're done, submit the form to save your updates and keep your notes current."
    )
  })

  test('title being required', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: BASE_APP_URL },
    })
    const id = faker.string.uuid()
    await page.route(
      `${VITE_BASE_API_URL}/projects/*/notes/*`,
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
    await page.goto(`${BASE_APP_URL}/projects/${SUBJECT.id}/notes/${id}/edit`)
    await page.getByPlaceholder('Enter title').clear()
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByText('This field is required')).toBeVisible()
  })

  test('updating note', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: BASE_APP_URL },
    })
    await page.route(
      `${VITE_BASE_API_URL}/projects/*/notes*`,
      (route) =>
        route.request().method() === 'GET' &&
        route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    const id = faker.string.uuid()
    await page.route(
      `${VITE_BASE_API_URL}/projects/${SUBJECT.id}/notes/*`,
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
    await page.route(`${VITE_BASE_API_URL}/projects/*/notes/${id}`, (route) =>
      route.fulfill({
        json: {
          id,
          title,
          description,
          createdAt: faker.date.past().toISOString(),
        },
      })
    )
    await page.goto(`${BASE_APP_URL}/projects/${SUBJECT.id}/notes/${id}/edit`)
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
      `${BASE_APP_URL}/projects/${SUBJECT.id}/notes/${id}`
    )
    await expect(page.getByText('Note updated', { exact: true })).toBeVisible()
    await expect(
      page.getByText(`${title} has been successfully updated`, {
        exact: true,
      })
    ).toBeVisible()
  })
})
