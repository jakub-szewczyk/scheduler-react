import { setupClerkTestingToken } from '@clerk/testing/playwright'
import { expect, test } from '@playwright/test'
import { addMonths, format, subMonths } from 'date-fns'
import {
  DAYS,
  EMPTY_PAGINABLE_RESPONSE,
  PAGINABLE_EVENTS_RESPONSE,
  PAGINABLE_RESPONSE,
} from '../src/mocks/common'

const APP_BASE_URL = process.env.APP_BASE_URL

const VITE_API_BASE_URL = process.env.VITE_API_BASE_URL

if (!APP_BASE_URL || !VITE_API_BASE_URL)
  throw new Error(
    'missing one of environment variables: [APP_BASE_URL, VITE_API_BASE_URL]'
  )

test.describe('events page', () => {
  test('rendering title and description', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(
      `${VITE_API_BASE_URL}/projects/*/schedules/*/events*`,
      (route) => route.fulfill({ json: EMPTY_PAGINABLE_RESPONSE })
    )
    await page.goto(
      `${APP_BASE_URL}/projects/${PAGINABLE_RESPONSE.content[0].id}/schedules/${PAGINABLE_RESPONSE.content[0].id}/events`
    )
    await expect(page.getByRole('heading', { name: 'Events' })).toBeVisible()
    await expect(page.getByRole('main')).toContainText(
      'This page provides an overview of all scheduled events related to the project. You can view the events in a calendar format, see details for each event, and add new events to keep the project timeline up-to-date.'
    )
  })

  test('rendering empty calendar', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(
      `${VITE_API_BASE_URL}/projects/*/schedules/*/events*`,
      (route) => route.fulfill({ json: EMPTY_PAGINABLE_RESPONSE })
    )
    await page.goto(
      `${APP_BASE_URL}/projects/${PAGINABLE_RESPONSE.content[0].id}/schedules/${PAGINABLE_RESPONSE.content[0].id}/events`
    )
    await expect(
      page.getByRole('heading', { name: format(new Date(), 'LLLL') })
    ).toBeVisible()
    await expect(page.getByText(format(new Date(), 'yyyy'))).toBeVisible()
    await expect(
      page.getByRole('button', {
        name: format(subMonths(new Date(), 1), 'MMM'),
      })
    ).toBeVisible()
    await expect(
      page.getByRole('button', {
        name: format(addMonths(new Date(), 1), 'MMM'),
      })
    ).toBeVisible()
    await Promise.all(
      DAYS.map((day) =>
        expect(page.getByRole('columnheader', { name: day })).toBeVisible()
      )
    )
  })

  test('navigating to the next page', async ({
    page,
    browserName,
    isMobile,
  }) => {
    test.skip(browserName === 'webkit')
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    const url = `${VITE_API_BASE_URL}/projects/*/schedules/*/events*`
    await page.route(url, (route) =>
      route.fulfill({ json: PAGINABLE_EVENTS_RESPONSE })
    )
    let promise = page.waitForResponse(url)
    await page.goto(
      `${APP_BASE_URL}/projects/${PAGINABLE_EVENTS_RESPONSE.content[0].id}/schedules/${PAGINABLE_EVENTS_RESPONSE.content[0].id}/events`
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

  test('navigating to the previous page', async ({
    page,
    browserName,
    isMobile,
  }) => {
    test.skip(browserName === 'webkit')
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    const url = `${VITE_API_BASE_URL}/projects/*/schedules/*/events*`
    await page.route(url, (route) =>
      route.fulfill({ json: PAGINABLE_EVENTS_RESPONSE })
    )
    let promise = page.waitForResponse(url)
    await page.goto(
      `${APP_BASE_URL}/projects/${PAGINABLE_EVENTS_RESPONSE.content[0].id}/schedules/${PAGINABLE_EVENTS_RESPONSE.content[0].id}/events`
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
    await page.getByTestId('previous-page').click()
    if (isMobile) {
      await expect(page.getByText('1/10')).toBeVisible()
    } else {
      await expect(page.getByText('Page 1 of 10')).toBeVisible()
    }
  })

  test('navigating to the last page', async ({ page, isMobile }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    const url = `${VITE_API_BASE_URL}/projects/*/schedules/*/events*`
    await page.route(url, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    let promise = page.waitForResponse(url)
    await page.goto(
      `${APP_BASE_URL}/projects/${PAGINABLE_EVENTS_RESPONSE.content[0].id}/schedules/${PAGINABLE_EVENTS_RESPONSE.content[0].id}/events`
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
    const url = `${VITE_API_BASE_URL}/projects/*/schedules/*/events*`
    await page.route(url, (route) =>
      route.fulfill({ json: PAGINABLE_RESPONSE })
    )
    let promise = page.waitForResponse(url)
    await page.goto(
      `${APP_BASE_URL}/projects/${PAGINABLE_EVENTS_RESPONSE.content[0].id}/schedules/${PAGINABLE_EVENTS_RESPONSE.content[0].id}/events`
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
    promise = page.waitForResponse(url)
    await page.getByTestId('first-page').click()
    if (isMobile) {
      await expect(page.getByText('1/10')).toBeVisible()
    } else {
      await expect(page.getByText('Page 1 of 10')).toBeVisible()
    }
    expect((await promise).url().includes('page=0')).toBeTruthy()
  })

  /**
   * TODO:
   * Test:
   *
   * EVENTS
   * - Navigating to different months.
   * - Creating new events.
   * - Updating existing events.
   * - Deleting events.
   * - Display event details in a popover.
   * - Display event details in a "+x more" popover.
   *
   * NOTIFICATIONS
   * - Creating new notifications.
   * - Updating existing notifications.
   * - Enabling/Disabling notification via popover.
   */

  // test('deleting an event', async ({ page }) => {
  //   await setupClerkTestingToken({
  //     page,
  //     options: { frontendApiUrl: APP_BASE_URL },
  //   })
  //   await page.route(`${VITE_API_BASE_URL}/projects/*/schedules*`, (route) =>
  //     route.fulfill({ json: PAGINABLE_RESPONSE })
  //   )
  //   await page.route(`${VITE_API_BASE_URL}/projects/*/schedules/*`, (route) =>
  //     route.fulfill({
  //       json: {
  //         id: faker.string.uuid(),
  //         title: faker.lorem.slug(),
  //         description: faker.lorem.sentences(),
  //         createdAt: faker.date.past().toISOString(),
  //       },
  //     })
  //   )
  //   await page.goto(
  //     `${APP_BASE_URL}/projects/${PAGINABLE_RESPONSE.content[0].id}/schedules`
  //   )
  //   await page
  //     .getByRole('row', { name: 'socius-accusator-corona Tergo' })
  //     .getByRole('button')
  //     .click()
  //   await page.getByRole('menuitem', { name: 'Delete' }).click()
  //   await expect(
  //     page
  //       .getByLabel('Warning: Permanent Deletion')
  //       .getByText('socius-accusator-corona')
  //   ).toBeVisible()
  //   const promise1 = page.waitForResponse(
  //     (response) => response.request().method() === 'DELETE'
  //   )
  //   const promise2 = page.waitForResponse(
  //     (response) => response.request().method() === 'GET'
  //   )
  //   await page.getByRole('button', { name: 'Yes, delete' }).click()
  //   expect((await promise1).request().method()).toBe('DELETE')
  //   expect((await promise2).request().method()).toBe('GET')
  // })

  // test('navigating to "New Event" page', async ({ page }) => {
  //   await setupClerkTestingToken({
  //     page,
  //     options: { frontendApiUrl: APP_BASE_URL },
  //   })
  //   await page.route(`${VITE_API_BASE_URL}/projects/*/schedules*`, (route) =>
  //     route.fulfill({ json: PAGINABLE_RESPONSE })
  //   )
  //   await page.route(`${VITE_API_BASE_URL}/projects/*/schedules/*`, (route) =>
  //     route.fulfill({
  //       json: {
  //         id: faker.string.uuid(),
  //         title: faker.lorem.slug(),
  //         description: faker.lorem.sentences(),
  //         createdAt: faker.date.past().toISOString(),
  //       },
  //     })
  //   )
  //   await page.goto(
  //     `${APP_BASE_URL}/projects/${PAGINABLE_RESPONSE.content[0].id}/schedules`
  //   )
  //   await page.getByRole('link', { name: 'New Schedule' }).click()
  //   expect(page.url()).toBe(
  //     `${APP_BASE_URL}/projects/${PAGINABLE_RESPONSE.content[0].id}/schedules/new`
  //   )
  // })

  // test('navigating to "Edit Event" page', async ({ page }) => {
  //   await setupClerkTestingToken({
  //     page,
  //     options: { frontendApiUrl: APP_BASE_URL },
  //   })
  //   await page.route(`${VITE_API_BASE_URL}/projects/*/schedules*`, (route) =>
  //     route.fulfill({ json: PAGINABLE_RESPONSE })
  //   )
  //   const id = faker.string.uuid()
  //   await page.route(`${VITE_API_BASE_URL}/projects/*/schedules/*`, (route) =>
  //     route.fulfill({
  //       json: {
  //         id,
  //         title: faker.lorem.slug(),
  //         description: faker.lorem.sentences(),
  //         createdAt: faker.date.past().toISOString(),
  //       },
  //     })
  //   )
  //   await page.goto(
  //     `${APP_BASE_URL}/projects/${PAGINABLE_RESPONSE.content[0].id}/schedules`
  //   )
  //   await page
  //     .getByRole('row', { name: 'socius-accusator-corona Tergo' })
  //     .getByRole('button')
  //     .click()
  //   await page.getByRole('menuitem', { name: 'Edit' }).click()
  //   expect(page.url()).toBe(
  //     `${APP_BASE_URL}/projects/${PAGINABLE_RESPONSE.content[0].id}/schedules/${PAGINABLE_RESPONSE.content[0].id}/edit`
  //   )
  // })
})

// test.describe('new event page', () => {
//   test('rendering title and description', async ({ page }) => {
//     await setupClerkTestingToken({
//       page,
//       options: { frontendApiUrl: APP_BASE_URL },
//     })
//     await page.goto(`${APP_BASE_URL}/projects/${SUBJECT.id}/schedules/new`)
//     await expect(
//       page.getByRole('heading', { name: 'New Schedule' })
//     ).toBeVisible()
//     await expect(page.getByRole('main')).toContainText(
//       "Set up your new schedule by entering a title and description. Choose a title that encapsulates the focus of your schedule and use the description to outline its key events and timelines. Once you're done, submit the form to start organizing your events."
//     )
//   })
//
//   test('title being required', async ({ page }) => {
//     await setupClerkTestingToken({
//       page,
//       options: { frontendApiUrl: APP_BASE_URL },
//     })
//     await page.route(
//       `${VITE_API_BASE_URL}/projects/*/schedules`,
//       (route) =>
//         route.request().method() === 'POST' &&
//         route.fulfill({
//           json: {
//             id: faker.string.uuid(),
//             title: faker.lorem.slug(),
//             description: faker.lorem.sentences(),
//             createdAt: faker.date.past().toISOString(),
//           },
//         })
//     )
//     await page.goto(`${APP_BASE_URL}/projects/${SUBJECT.id}/schedules/new`)
//     await page.getByRole('button', { name: 'Submit' }).click()
//     await expect(page.getByText('This field is required')).toBeVisible()
//   })
//
//   test('creating schedule', async ({ page }) => {
//     await setupClerkTestingToken({
//       page,
//       options: { frontendApiUrl: APP_BASE_URL },
//     })
//     await page.route(
//       `${VITE_API_BASE_URL}/projects/*/schedules*`,
//       (route) =>
//         route.request().method() === 'GET' &&
//         route.fulfill({ json: PAGINABLE_RESPONSE })
//     )
//     const id = faker.string.uuid()
//     const title = faker.lorem.slug()
//     const description = faker.lorem.sentences()
//     const json = {
//       id,
//       title,
//       description,
//       createdAt: faker.date.past().toISOString(),
//     }
//     await page.route(
//       `${VITE_API_BASE_URL}/projects/*/schedules/*`,
//       (route) =>
//         route.request().method() === 'GET' &&
//         route.fulfill({
//           json,
//         })
//     )
//     await page.route(
//       `${VITE_API_BASE_URL}/projects/*/schedules`,
//       (route) =>
//         route.request().method() === 'POST' &&
//         route.fulfill({
//           json,
//         })
//     )
//     await page.goto(`${APP_BASE_URL}/projects/${SUBJECT.id}/schedules/new`)
//     await page.getByPlaceholder('Enter title').fill(title)
//     await page.getByPlaceholder('Enter description').fill(description)
//     const promise1 = page.waitForResponse(
//       (response) => response.request().method() === 'POST'
//     )
//     const promise2 = page.waitForResponse(
//       (response) => response.request().method() === 'GET'
//     )
//     await page.getByRole('button', { name: 'Submit' }).click()
//     expect((await promise1).request().method()).toBe('POST')
//     expect((await promise2).request().method()).toBe('GET')
//     expect(page.url()).toBe(
//       `${APP_BASE_URL}/projects/${SUBJECT.id}/schedules/${id}`
//     )
//     await expect(
//       page.getByText('Schedule created', { exact: true })
//     ).toBeVisible()
//     await expect(
//       page.getByText(`${title} has been successfully created`, {
//         exact: true,
//       })
//     ).toBeVisible()
//   })
// })

// test.describe('edit event page', () => {
//   test('rendering title and description', async ({ page }) => {
//     await setupClerkTestingToken({
//       page,
//       options: { frontendApiUrl: APP_BASE_URL },
//     })
//     const id = faker.string.uuid()
//     await page.route(
//       `${VITE_API_BASE_URL}/projects/*/schedules/*`,
//       (route) =>
//         route.request().method() === 'GET' &&
//         route.fulfill({
//           json: {
//             id,
//             title: faker.lorem.slug(),
//             description: faker.lorem.sentences(),
//             createdAt: faker.date.past().toISOString(),
//           },
//         })
//     )
//     await page.goto(
//       `${APP_BASE_URL}/projects/${SUBJECT.id}/schedules/${id}/edit`
//     )
//     await expect(
//       page.getByRole('heading', { name: 'Edit Schedule' })
//     ).toBeVisible()
//     await expect(page.getByRole('main')).toContainText(
//       'Modify your existing schedule by updating the title and description. Adjust the title to reflect any changes in focus and use the description to detail revised key events and timelines. Once your updates are complete, submit the form to keep your schedule current.'
//     )
//   })
//
//   test('title being required', async ({ page }) => {
//     await setupClerkTestingToken({
//       page,
//       options: { frontendApiUrl: APP_BASE_URL },
//     })
//     const id = faker.string.uuid()
//     await page.route(
//       `${VITE_API_BASE_URL}/projects/*/schedules/*`,
//       (route) =>
//         route.request().method() === 'GET' &&
//         route.fulfill({
//           json: {
//             id,
//             title: faker.lorem.slug(),
//             description: faker.lorem.sentences(),
//             createdAt: faker.date.past().toISOString(),
//           },
//         })
//     )
//     await page.goto(
//       `${APP_BASE_URL}/projects/${SUBJECT.id}/schedules/${id}/edit`
//     )
//     await page.getByPlaceholder('Enter title').clear()
//     await page.getByRole('button', { name: 'Submit' }).click()
//     await expect(page.getByText('This field is required')).toBeVisible()
//   })
//
//   test('updating schedule', async ({ page }) => {
//     await setupClerkTestingToken({
//       page,
//       options: { frontendApiUrl: APP_BASE_URL },
//     })
//     await page.route(
//       `${VITE_API_BASE_URL}/projects/*/schedules*`,
//       (route) =>
//         route.request().method() === 'GET' &&
//         route.fulfill({ json: PAGINABLE_RESPONSE })
//     )
//     const id = faker.string.uuid()
//     await page.route(
//       `${VITE_API_BASE_URL}/projects/${SUBJECT.id}/schedules/*`,
//       (route) =>
//         route.request().method() === 'GET' &&
//         route.fulfill({
//           json: {
//             id,
//             title: faker.lorem.slug(),
//             description: faker.lorem.sentences(),
//             createdAt: faker.date.past().toISOString(),
//           },
//         })
//     )
//     const title = faker.lorem.slug()
//     const description = faker.lorem.sentences()
//     await page.route(
//       `${VITE_API_BASE_URL}/projects/*/schedules/${id}`,
//       (route) =>
//         route.fulfill({
//           json: {
//             id,
//             title,
//             description,
//             createdAt: faker.date.past().toISOString(),
//           },
//         })
//     )
//     await page.goto(
//       `${APP_BASE_URL}/projects/${SUBJECT.id}/schedules/${id}/edit`
//     )
//     await page.getByPlaceholder('Enter title').fill(title)
//     await page.getByPlaceholder('Enter description').fill(description)
//     const promise1 = page.waitForResponse(
//       (response) => response.request().method() === 'PUT'
//     )
//     const promise2 = page.waitForResponse(
//       (response) => response.request().method() === 'GET'
//     )
//     await page.getByRole('button', { name: 'Submit' }).click()
//     expect((await promise1).request().method()).toBe('PUT')
//     expect((await promise2).request().method()).toBe('GET')
//     expect(page.url()).toBe(
//       `${APP_BASE_URL}/projects/${SUBJECT.id}/schedules/${id}`
//     )
//     await expect(
//       page.getByText('Schedule updated', { exact: true })
//     ).toBeVisible()
//     await expect(
//       page.getByText(`${title} has been successfully updated`, {
//         exact: true,
//       })
//     ).toBeVisible()
//   })
// })
