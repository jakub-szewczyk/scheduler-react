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

test.describe('projects page', () => {
  test('rendering title and description', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(`${VITE_API_BASE_URL}/projects*`, (route) =>
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
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(`${VITE_API_BASE_URL}/projects*`, (route) =>
      route.fulfill({ json: EMPTY_PAGINABLE_RESPONSE })
    )
    await page.goto(`${APP_BASE_URL}/projects`)
    await expect(page.getByRole('cell', { name: 'No results' })).toBeVisible()
  })

  test('navigating to the next page', async ({ page, isMobile }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    const url = `${VITE_API_BASE_URL}/projects*`
    await page.route(url, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    let promise = page.waitForResponse(url)
    await page.goto(`${APP_BASE_URL}/projects`)
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
    const url = `${VITE_API_BASE_URL}/projects*`
    await page.route(url, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    let promise = page.waitForResponse(url)
    await page.goto(`${APP_BASE_URL}/projects?page=9`)
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
    const url = `${VITE_API_BASE_URL}/projects*`
    await page.route(url, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    let promise = page.waitForResponse(url)
    await page.goto(`${APP_BASE_URL}/projects`)
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
    const url = `${VITE_API_BASE_URL}/projects*`
    await page.route(url, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    let promise = page.waitForResponse(url)
    await page.goto(`${APP_BASE_URL}/projects?page=9`)
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
    const url = `${VITE_API_BASE_URL}/projects*`
    await page.route(url, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    let promise = page.waitForResponse(url)
    await page.goto(`${APP_BASE_URL}/projects`)
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
    const url = `${VITE_API_BASE_URL}/projects*`
    await page.route(url, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    let promise = page.waitForResponse(url)
    await page.goto(`${APP_BASE_URL}/projects`)
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
    const url = `${VITE_API_BASE_URL}/projects*`
    await page.route(url, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    let promise = page.waitForResponse(url)
    await page.goto(`${APP_BASE_URL}/projects`)
    expect((await promise).url().includes('title=')).toBeTruthy()
    promise = page.waitForResponse(url)
    const slug = faker.lorem.slug()
    await page.getByPlaceholder('Search by title').fill(slug)
    expect((await promise).url().includes(`title=${slug}`)).toBeTruthy()
    await expect(page.getByPlaceholder('Search by title')).toHaveValue(slug)
  })

  test('deleting one project', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(`${VITE_API_BASE_URL}/projects*`, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    await page.route(`${VITE_API_BASE_URL}/projects/*`, (route) =>
      route.fulfill({
        json: {
          id: faker.string.uuid(),
          title: faker.lorem.slug(),
          description: faker.lorem.sentences(),
          createdAt: faker.date.past().toISOString(),
        },
      })
    )
    await page.goto(`${APP_BASE_URL}/projects`)
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

  test('deleting many projects', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(`${VITE_API_BASE_URL}/projects*`, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    await page.route(`${VITE_API_BASE_URL}/projects/*`, (route) =>
      route.fulfill({
        json: {
          id: faker.string.uuid(),
          title: faker.lorem.slug(),
          description: faker.lorem.sentences(),
          createdAt: faker.date.past().toISOString(),
        },
      })
    )
    await page.goto(`${APP_BASE_URL}/projects`)
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

  test('navigating to "New Project" page', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(`${VITE_API_BASE_URL}/projects*`, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    await page.route(`${VITE_API_BASE_URL}/projects/*`, (route) =>
      route.fulfill({
        json: {
          id: faker.string.uuid(),
          title: faker.lorem.slug(),
          description: faker.lorem.sentences(),
          createdAt: faker.date.past().toISOString(),
        },
      })
    )
    await page.goto(`${APP_BASE_URL}/projects`)
    await page.getByRole('link', { name: 'New Project' }).click()
    await expect(
      page.getByRole('heading', { name: 'New Project' })
    ).toBeVisible()
    await expect(page.getByRole('main')).toContainText(
      "Kick off your new project by entering a title and description. Choose a title that captures the essence of your project and use the description to provide an overview of its objectives and key details. Once you're done, submit the form to get your project started."
    )
  })

  test('navigating to "Edit Project" page', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(`${VITE_API_BASE_URL}/projects*`, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    const id = faker.string.uuid()
    await page.route(`${VITE_API_BASE_URL}/projects/*`, (route) =>
      route.fulfill({
        json: {
          id,
          title: faker.lorem.slug(),
          description: faker.lorem.sentences(),
          createdAt: faker.date.past().toISOString(),
        },
      })
    )
    await page.goto(`${APP_BASE_URL}/projects`)
    await page
      .getByRole('row', { name: 'socius-accusator-corona Tergo' })
      .getByRole('button')
      .click()
    await page.getByRole('menuitem', { name: 'Edit' }).click()
    await expect(
      page.getByRole('heading', { name: 'Edit Project' })
    ).toBeVisible()
    await expect(page.getByRole('main')).toContainText(
      "Update your project details by modifying the title and description. Ensure the title accurately represents your project's current direction and use the description to highlight new goals, progress, and essential information. Once you've made your edits, submit the form to keep your project information up-to-date."
    )
  })

  test('navigating to "Project Details" page using a link', async ({
    page,
  }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(`${VITE_API_BASE_URL}/projects*`, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    await page.route(`${VITE_API_BASE_URL}/projects/*`, (route) =>
      route.fulfill({
        json: {
          id: faker.string.uuid(),
          title: faker.lorem.slug(),
          description: faker.lorem.sentences(),
          createdAt: faker.date.past().toISOString(),
        },
      })
    )
    await page.goto(`${APP_BASE_URL}/projects`)
    await page.getByRole('link', { name: 'socius-accusator-corona' }).click()
    expect(page.url()).toBe(
      `${APP_BASE_URL}/projects/89bd9d8d-69a6-474e-80f4-67cc8796ed15`
    )
  })

  test('navigating to "Project Details" page using the dropdown menu', async ({
    page,
  }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(`${VITE_API_BASE_URL}/projects*`, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    await page.route(`${VITE_API_BASE_URL}/projects/*`, (route) =>
      route.fulfill({
        json: {
          id: faker.string.uuid(),
          title: faker.lorem.slug(),
          description: faker.lorem.sentences(),
          createdAt: faker.date.past().toISOString(),
        },
      })
    )
    await page.goto(`${APP_BASE_URL}/projects`)
    await page
      .getByRole('row', { name: 'socius-accusator-corona Tergo' })
      .getByRole('button')
      .click()
    await page.getByRole('menuitem', { name: 'Details' }).click()
    expect(page.url()).toBe(
      `${APP_BASE_URL}/projects/89bd9d8d-69a6-474e-80f4-67cc8796ed15`
    )
  })
})

test.describe('new project page', () => {
  test('rendering title and description', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.goto(`${APP_BASE_URL}/projects/new`)
    await expect(
      page.getByRole('heading', { name: 'New Project' })
    ).toBeVisible()
    await expect(page.getByRole('main')).toContainText(
      "Kick off your new project by entering a title and description. Choose a title that captures the essence of your project and use the description to provide an overview of its objectives and key details. Once you're done, submit the form to get your project started."
    )
  })

  test('title being required', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(
      `${VITE_API_BASE_URL}/projects`,
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
    await page.goto(`${APP_BASE_URL}/projects/new`)
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByText('This field is required')).toBeVisible()
  })

  test('creating project', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(
      `${VITE_API_BASE_URL}/projects*`,
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
      `${VITE_API_BASE_URL}/projects/*`,
      (route) =>
        route.request().method() === 'GET' &&
        route.fulfill({
          json,
        })
    )
    await page.route(
      `${VITE_API_BASE_URL}/projects`,
      (route) =>
        route.request().method() === 'POST' &&
        route.fulfill({
          json,
        })
    )
    await page.goto(`${APP_BASE_URL}/projects/new`)
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
    expect(page.url()).toBe(`${APP_BASE_URL}/projects/${id}`)
    await expect(
      page.getByText('Project created', { exact: true })
    ).toBeVisible()
    await expect(
      page.getByText(`${title} has been successfully created`, {
        exact: true,
      })
    ).toBeVisible()
  })
})

test.describe('edit project page', () => {
  test('rendering title and description', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    const id = faker.string.uuid()
    await page.route(
      `${VITE_API_BASE_URL}/projects/*`,
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
    await page.goto(`${APP_BASE_URL}/projects/${id}/edit`)
    await expect(
      page.getByRole('heading', { name: 'Edit Project' })
    ).toBeVisible()
    await expect(page.getByRole('main')).toContainText(
      "Update your project details by modifying the title and description. Ensure the title accurately represents your project's current direction and use the description to highlight new goals, progress, and essential information. Once you've made your edits, submit the form to keep your project information up-to-date."
    )
  })

  test('title being required', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    const id = faker.string.uuid()
    await page.route(
      `${VITE_API_BASE_URL}/projects/*`,
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
    await page.goto(`${APP_BASE_URL}/projects/${id}/edit`)
    await page.getByPlaceholder('Enter title').clear()
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByText('This field is required')).toBeVisible()
  })

  test('updating project', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(
      `${VITE_API_BASE_URL}/projects*`,
      (route) =>
        route.request().method() === 'GET' &&
        route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    const id = faker.string.uuid()
    await page.route(
      `${VITE_API_BASE_URL}/projects/*`,
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
    await page.route(`${VITE_API_BASE_URL}/projects/${id}`, (route) =>
      route.fulfill({
        json: {
          id,
          title,
          description,
          createdAt: faker.date.past().toISOString(),
        },
      })
    )
    await page.goto(`${APP_BASE_URL}/projects/${id}/edit`)
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
    expect(page.url()).toBe(`${APP_BASE_URL}/projects/${id}`)
    await expect(
      page.getByText('Project updated', { exact: true })
    ).toBeVisible()
    await expect(
      page.getByText(`${title} has been successfully updated`, {
        exact: true,
      })
    ).toBeVisible()
  })
})

test.describe('project details page', () => {
  test('rendering title and description', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(`${VITE_API_BASE_URL}/projects/*`, (route) =>
      route.fulfill({ json: SUBJECT })
    )
    await page.goto(`/projects/${SUBJECT.id}`)
    await expect(
      page.getByRole('heading', { name: 'Project Details' })
    ).toBeVisible()
    await expect(page.getByRole('main')).toContainText(
      "View your project's title, description, and creation date. Easily navigate to the edit page for updates. Additionally, this screen should serve you as a gateway to manage schedules, boards and notes, keeping your project organized and efficient from a single, streamlined hub."
    )
  })

  test('navigating to "Edit Project" page', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(`${VITE_API_BASE_URL}/projects/*`, (route) =>
      route.fulfill({ json: SUBJECT })
    )
    await page.goto(`${APP_BASE_URL}/projects/${SUBJECT.id}`)
    await page.getByRole('link', { name: 'Edit Project' }).click()
    await expect(
      page.getByRole('heading', { name: 'Edit Project' })
    ).toBeVisible()
    await expect(page.getByRole('main')).toContainText(
      "Update your project details by modifying the title and description. Ensure the title accurately represents your project's current direction and use the description to highlight new goals, progress, and essential information. Once you've made your edits, submit the form to keep your project information up-to-date."
    )
  })

  test('rendering project details', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(`${VITE_API_BASE_URL}/projects/*`, (route) =>
      route.fulfill({ json: SUBJECT })
    )
    await page.goto(`${APP_BASE_URL}/projects/${SUBJECT.id}`)
    await expect(page.getByText('Created at')).toBeVisible()
    await expect(page.getByText('August 7,')).toBeVisible()
    await expect(page.getByText('Title', { exact: true })).toBeVisible()
    await expect(page.getByText('alii-spiculum-spectaculum')).toBeVisible()
    await expect(page.getByText('Description', { exact: true })).toBeVisible()
    await expect(
      page.getByText(
        'Custodia curiositas tantum iusto. Undique cras suscipio alo cerno cattus apostolus omnis adsidue. Cogito depopulo cedo degenero defleo esse. Decimus sub ulterius ciminatio damno crastinus tres attollo. Tertius aiunt adstringo solutio subiungo beatae tergo. Tergiversatio stabilis caveo atrox corrumpo aegrus odio absque certe.'
      )
    ).toBeVisible()
  })

  test('previewing five latest schedules', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(
      `${VITE_API_BASE_URL}/projects/*/schedules?size=5`,
      (route) => route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    await page.route(`${VITE_API_BASE_URL}/projects/*`, (route) =>
      route.fulfill({ json: SUBJECT })
    )
    await page.goto(`${APP_BASE_URL}/projects/${SUBJECT.id}`)
    await page.getByRole('tab', { name: 'Schedules' }).click()
    await Promise.all(
      PAGINABLE_RESPONSE.content.flatMap(({ title, description }) => [
        expect(page.getByText(title)).toBeVisible(),
        expect(page.getByText(description)).toBeVisible(),
      ])
    )
  })

  test('previewing five latest boards', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(`${VITE_API_BASE_URL}/projects/*/boards?size=5`, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    await page.route(`${VITE_API_BASE_URL}/projects/*`, (route) =>
      route.fulfill({ json: SUBJECT })
    )
    await page.goto(`${APP_BASE_URL}/projects/${SUBJECT.id}`)
    await page.getByRole('tab', { name: 'Boards' }).click()
    await Promise.all(
      PAGINABLE_RESPONSE.content.flatMap(({ title, description }) => [
        expect(page.getByText(title)).toBeVisible(),
        expect(page.getByText(description)).toBeVisible(),
      ])
    )
  })

  test('previewing five latest notes', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(`${VITE_API_BASE_URL}/projects/*/notes?size=5`, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    await page.route(`${VITE_API_BASE_URL}/projects/*`, (route) =>
      route.fulfill({ json: SUBJECT })
    )
    await page.goto(`${APP_BASE_URL}/projects/${SUBJECT.id}`)
    await page.getByRole('tab', { name: 'Notes' }).click()
    await Promise.all(
      PAGINABLE_RESPONSE.content.flatMap(({ title, description }) => [
        expect(page.getByText(title)).toBeVisible(),
        expect(page.getByText(description)).toBeVisible(),
      ])
    )
  })

  test('navigating to "Schedules" page by "See full details" link', async ({
    page,
  }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(
      `${VITE_API_BASE_URL}/projects/*/schedules?size=5`,
      (route) => route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    await page.route(`${VITE_API_BASE_URL}/projects/*`, (route) =>
      route.fulfill({ json: SUBJECT })
    )
    await page.goto(`${APP_BASE_URL}/projects/${SUBJECT.id}`)
    await page.getByRole('tab', { name: 'Schedules' }).click()
    await page.getByRole('link', { name: 'See full details' }).click()
    expect(page.url()).toBe(`${APP_BASE_URL}/projects/${SUBJECT.id}/schedules`)
  })

  test('navigating to "Schedules" page by "Navigate to the full page" link', async ({
    page,
  }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(
      `${VITE_API_BASE_URL}/projects/*/schedules?size=5`,
      (route) => route.fulfill({ json: EMPTY_PAGINABLE_RESPONSE })
    )
    await page.route(`${VITE_API_BASE_URL}/projects/*`, (route) =>
      route.fulfill({ json: SUBJECT })
    )
    await page.goto(`${APP_BASE_URL}/projects/${SUBJECT.id}`)
    await page.getByRole('tab', { name: 'Schedules' }).click()
    await page.getByRole('link', { name: 'Navigate to the full page' }).click()
    expect(page.url()).toBe(`${APP_BASE_URL}/projects/${SUBJECT.id}/schedules`)
  })

  test('navigating to "Schedule Details" page', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(
      `${VITE_API_BASE_URL}/projects/*/schedules?size=5`,
      (route) => route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    await page.route(`${VITE_API_BASE_URL}/projects/*`, (route) =>
      route.fulfill({ json: SUBJECT })
    )
    await page.goto(`${APP_BASE_URL}/projects/${SUBJECT.id}`)
    await page.getByRole('tab', { name: 'Schedules' }).click()
    await page
      .getByRole('link', { name: PAGINABLE_RESPONSE.content[0].title })
      .click()
    expect(page.url()).toBe(
      `${APP_BASE_URL}/projects/${SUBJECT.id}/schedules/${PAGINABLE_RESPONSE.content[0].id}`
    )
  })

  test('navigating to "New Schedule" page', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(
      `${VITE_API_BASE_URL}/projects/*/schedules?size=5`,
      (route) => route.fulfill({ json: EMPTY_PAGINABLE_RESPONSE })
    )
    await page.route(`${VITE_API_BASE_URL}/projects/*`, (route) =>
      route.fulfill({ json: SUBJECT })
    )
    await page.goto(`${APP_BASE_URL}/projects/${SUBJECT.id}`)
    await page.getByRole('tab', { name: 'Schedules' }).click()
    await page.getByRole('link', { name: 'Create your first entry' }).click()
    expect(page.url()).toBe(
      `${APP_BASE_URL}/projects/${SUBJECT.id}/schedules/new`
    )
  })

  test('navigating to "Boards" page by "See full details" link', async ({
    page,
  }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(`${VITE_API_BASE_URL}/projects/*/boards?size=5`, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    await page.route(`${VITE_API_BASE_URL}/projects/*`, (route) =>
      route.fulfill({ json: SUBJECT })
    )
    await page.goto(`${APP_BASE_URL}/projects/${SUBJECT.id}`)
    await page.getByRole('tab', { name: 'Boards' }).click()
    await page.getByRole('link', { name: 'See full details' }).click()
    expect(page.url()).toBe(`${APP_BASE_URL}/projects/${SUBJECT.id}/boards`)
  })

  test('navigating to "Boards" page by "Navigate to the full page" link', async ({
    page,
  }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(`${VITE_API_BASE_URL}/projects/*/boards?size=5`, (route) =>
      route.fulfill({ json: EMPTY_PAGINABLE_RESPONSE })
    )
    await page.route(`${VITE_API_BASE_URL}/projects/*`, (route) =>
      route.fulfill({ json: SUBJECT })
    )
    await page.goto(`${APP_BASE_URL}/projects/${SUBJECT.id}`)
    await page.getByRole('tab', { name: 'Boards' }).click()
    await page.getByRole('link', { name: 'Navigate to the full page' }).click()
    expect(page.url()).toBe(`${APP_BASE_URL}/projects/${SUBJECT.id}/boards`)
  })

  test('navigating to "Board Details" page', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(`${VITE_API_BASE_URL}/projects/*/boards?size=5`, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    await page.route(`${VITE_API_BASE_URL}/projects/*`, (route) =>
      route.fulfill({ json: SUBJECT })
    )
    await page.goto(`${APP_BASE_URL}/projects/${SUBJECT.id}`)
    await page.getByRole('tab', { name: 'Boards' }).click()
    await page
      .getByRole('link', { name: PAGINABLE_RESPONSE.content[0].title })
      .click()
    expect(page.url()).toBe(
      `${APP_BASE_URL}/projects/${SUBJECT.id}/boards/${PAGINABLE_RESPONSE.content[0].id}`
    )
  })

  test('navigating to "New Board" page', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(`${VITE_API_BASE_URL}/projects/*/boards?size=5`, (route) =>
      route.fulfill({ json: EMPTY_PAGINABLE_RESPONSE })
    )
    await page.route(`${VITE_API_BASE_URL}/projects/*`, (route) =>
      route.fulfill({ json: SUBJECT })
    )
    await page.goto(`${APP_BASE_URL}/projects/${SUBJECT.id}`)
    await page.getByRole('tab', { name: 'Boards' }).click()
    await page.getByRole('link', { name: 'Create your first entry' }).click()
    expect(page.url()).toBe(`${APP_BASE_URL}/projects/${SUBJECT.id}/boards/new`)
  })

  test('navigating to "Notes" page by "See full details" link', async ({
    page,
  }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(`${VITE_API_BASE_URL}/projects/*/notes?size=5`, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    await page.route(`${VITE_API_BASE_URL}/projects/*`, (route) =>
      route.fulfill({ json: SUBJECT })
    )
    await page.goto(`${APP_BASE_URL}/projects/${SUBJECT.id}`)
    await page.getByRole('tab', { name: 'Notes' }).click()
    await page.getByRole('link', { name: 'See full details' }).click()
    expect(page.url()).toBe(`${APP_BASE_URL}/projects/${SUBJECT.id}/notes`)
  })

  test('navigating to "Notes" page by "Navigate to the full page" link', async ({
    page,
  }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(`${VITE_API_BASE_URL}/projects/*/notes?size=5`, (route) =>
      route.fulfill({ json: EMPTY_PAGINABLE_RESPONSE })
    )
    await page.route(`${VITE_API_BASE_URL}/projects/*`, (route) =>
      route.fulfill({ json: SUBJECT })
    )
    await page.goto(`${APP_BASE_URL}/projects/${SUBJECT.id}`)
    await page.getByRole('tab', { name: 'Notes' }).click()
    await page.getByRole('link', { name: 'Navigate to the full page' }).click()
    expect(page.url()).toBe(`${APP_BASE_URL}/projects/${SUBJECT.id}/notes`)
  })

  test('navigating to "Note Details" page', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(`${VITE_API_BASE_URL}/projects/*/notes?size=5`, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    await page.route(`${VITE_API_BASE_URL}/projects/*`, (route) =>
      route.fulfill({ json: SUBJECT })
    )
    await page.goto(`${APP_BASE_URL}/projects/${SUBJECT.id}`)
    await page.getByRole('tab', { name: 'Notes' }).click()
    await page
      .getByRole('link', { name: PAGINABLE_RESPONSE.content[0].title })
      .click()
    expect(page.url()).toBe(
      `${APP_BASE_URL}/projects/${SUBJECT.id}/notes/${PAGINABLE_RESPONSE.content[0].id}`
    )
  })

  test('navigating to "New Note" page', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(`${VITE_API_BASE_URL}/projects/*/notes?size=5`, (route) =>
      route.fulfill({ json: EMPTY_PAGINABLE_RESPONSE })
    )
    await page.route(`${VITE_API_BASE_URL}/projects/*`, (route) =>
      route.fulfill({ json: SUBJECT })
    )
    await page.goto(`${APP_BASE_URL}/projects/${SUBJECT.id}`)
    await page.getByRole('tab', { name: 'Notes' }).click()
    await page.getByRole('link', { name: 'Create your first entry' }).click()
    expect(page.url()).toBe(`${APP_BASE_URL}/projects/${SUBJECT.id}/notes/new`)
  })
})
