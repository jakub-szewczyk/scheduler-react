import { setupClerkTestingToken } from '@clerk/testing/playwright'
import { expect, test } from '@playwright/test'
import { addMonths, format, getDate, subMonths } from 'date-fns'
import {
  DAYS,
  EMPTY_PAGINABLE_RESPONSE,
  PAGINABLE_EVENTS_RESPONSE,
} from '../src/mocks/common'
import { faker } from '@faker-js/faker'

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
      `${APP_BASE_URL}/projects/${PAGINABLE_EVENTS_RESPONSE.content[0].id}/schedules/${PAGINABLE_EVENTS_RESPONSE.content[0].id}/events`
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
      `${APP_BASE_URL}/projects/${PAGINABLE_EVENTS_RESPONSE.content[0].id}/schedules/${PAGINABLE_EVENTS_RESPONSE.content[0].id}/events`
    )
    await expect(
      page.getByRole('heading', { name: format(new Date(), 'MMMM') })
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

  test('navigating to the last page', async ({
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
    await page.getByTestId('last-page').click()
    if (isMobile) {
      await expect(page.getByText('10/10')).toBeVisible()
    } else {
      await expect(page.getByText('Page 10 of 10')).toBeVisible()
    }
    expect((await promise).url().includes('page=9')).toBeTruthy()
  })

  test('navigating to the first page', async ({
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

  test('navigating to the next month', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(
      `${VITE_API_BASE_URL}/projects/*/schedules/*/events*`,
      (route) => route.fulfill({ json: PAGINABLE_EVENTS_RESPONSE })
    )
    await page.goto(
      `${APP_BASE_URL}/projects/${PAGINABLE_EVENTS_RESPONSE.content[0].id}/schedules/${PAGINABLE_EVENTS_RESPONSE.content[0].id}/events`
    )
    const prevMonth = subMonths(new Date(), 1)
    const currMonth = new Date()
    const nextMonth = addMonths(new Date(), 1)
    await Promise.all([
      expect(
        page.getByRole('heading', { name: format(currMonth, 'MMMM') })
      ).toBeVisible(),
      expect(
        page.getByRole('button', { name: format(prevMonth, 'MMM') })
      ).toBeVisible(),
      expect(
        page.getByRole('button', { name: format(nextMonth, 'MMM') })
      ).toBeVisible(),
    ])
    await page.getByRole('button', { name: format(nextMonth, 'MMM') }).click()
    await Promise.all([
      expect(
        page.getByRole('heading', { name: format(nextMonth, 'MMMM') })
      ).toBeVisible(),
      expect(
        page.getByRole('button', { name: format(currMonth, 'MMM') })
      ).toBeVisible(),
      expect(
        page.getByRole('button', {
          name: format(addMonths(currMonth, 2), 'MMM'),
        })
      ).toBeVisible(),
    ])
  })

  test('navigating to the previous month', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(
      `${VITE_API_BASE_URL}/projects/*/schedules/*/events*`,
      (route) => route.fulfill({ json: PAGINABLE_EVENTS_RESPONSE })
    )
    await page.goto(
      `${APP_BASE_URL}/projects/${PAGINABLE_EVENTS_RESPONSE.content[0].id}/schedules/${PAGINABLE_EVENTS_RESPONSE.content[0].id}/events`
    )
    const prevMonth = subMonths(new Date(), 1)
    const currMonth = new Date()
    const nextMonth = addMonths(new Date(), 1)
    await Promise.all([
      expect(
        page.getByRole('heading', { name: format(currMonth, 'MMMM') })
      ).toBeVisible(),
      expect(
        page.getByRole('button', { name: format(prevMonth, 'MMM') })
      ).toBeVisible(),
      expect(
        page.getByRole('button', { name: format(nextMonth, 'MMM') })
      ).toBeVisible(),
    ])
    await page.getByRole('button', { name: format(prevMonth, 'MMM') }).click()
    await Promise.all([
      expect(
        page.getByRole('heading', { name: format(prevMonth, 'MMMM') })
      ).toBeVisible(),
      expect(
        page.getByRole('button', {
          name: format(subMonths(currMonth, 2), 'MMM'),
        })
      ).toBeVisible(),
      expect(
        page.getByRole('button', { name: format(currMonth, 'MMM') })
      ).toBeVisible(),
    ])
  })

  test('rendering event details', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(
      `${VITE_API_BASE_URL}/projects/*/schedules/*/events*`,
      (route) => route.fulfill({ json: PAGINABLE_EVENTS_RESPONSE })
    )
    await page.route(
      `${VITE_API_BASE_URL}/projects/*/schedules/*/events/*/notification`,
      (route) => route.fulfill({ json: null })
    )
    await page.goto(
      `${APP_BASE_URL}/projects/${PAGINABLE_EVENTS_RESPONSE.content[0].id}/schedules/${PAGINABLE_EVENTS_RESPONSE.content[0].id}/events`
    )
    await page.getByRole('button', { name: 'porro-solvo-aegrus' }).click()
    await Promise.all([
      expect(
        page.getByRole('dialog').getByText('porro-solvo-aegrus')
      ).toBeVisible(),
      expect(
        page.getByText('Thu 26 Sep 15:49 - Sat 28 Sep 03:24')
      ).toBeVisible(),
      expect(page.getByText('No Notification')).toBeVisible(),
      expect(
        page.getByRole('button', { name: 'Notification Settings' })
      ).toBeVisible(),
    ])
  })

  test('rendering event details through the "+x more" popover', async ({
    page,
  }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(
      `${VITE_API_BASE_URL}/projects/*/schedules/*/events*`,
      (route) => route.fulfill({ json: PAGINABLE_EVENTS_RESPONSE })
    )
    await page.route(
      `${VITE_API_BASE_URL}/projects/*/schedules/*/events/*/notification`,
      (route) => route.fulfill({ json: null })
    )
    await page.goto(
      `${APP_BASE_URL}/projects/${PAGINABLE_EVENTS_RESPONSE.content[0].id}/schedules/${PAGINABLE_EVENTS_RESPONSE.content[0].id}/events`
    )
    await page.getByRole('button', { name: '+2 more' }).click()
    await page
      .getByRole('dialog')
      .getByRole('button', { name: 'porro-solvo-aegrus' })
      .click()
    await Promise.all([
      expect(
        page.getByText('Thu 26 Sep 15:49 - Sat 28 Sep 03:24')
      ).toBeVisible(),
      expect(page.getByText('No Notification')).toBeVisible(),
      expect(
        page.getByRole('button', { name: 'Notification Settings' })
      ).toBeVisible(),
    ])
  })

  test('deleting an event', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(
      `${VITE_API_BASE_URL}/projects/*/schedules/*/events*`,
      (route) => route.fulfill({ json: PAGINABLE_EVENTS_RESPONSE })
    )
    await page.route(
      `${VITE_API_BASE_URL}/projects/*/schedules/*/events/*`,
      (route) => route.fulfill({ json: PAGINABLE_EVENTS_RESPONSE[0] })
    )
    await page.route(
      `${VITE_API_BASE_URL}/projects/*/schedules/*/events/*/notification`,
      (route) => route.fulfill({ json: null })
    )
    await page.goto(
      `${APP_BASE_URL}/projects/${PAGINABLE_EVENTS_RESPONSE.content[0].id}/schedules/${PAGINABLE_EVENTS_RESPONSE.content[0].id}/events`
    )
    await page.getByRole('button', { name: 'porro-solvo-aegrus' }).click()
    await page.getByTestId('delete-event').click()
    await expect(
      page.getByRole('heading', { name: 'Warning: Permanent Deletion' })
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

  test('navigating to "New Event" page', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(
      `${VITE_API_BASE_URL}/projects/*/schedules/*/events*`,
      (route) => route.fulfill({ json: PAGINABLE_EVENTS_RESPONSE })
    )
    await page.route(
      `${VITE_API_BASE_URL}/projects/*/schedules/*/events/*`,
      (route) =>
        route.fulfill({
          json: PAGINABLE_EVENTS_RESPONSE[0],
        })
    )
    await page.goto(
      `${APP_BASE_URL}/projects/${PAGINABLE_EVENTS_RESPONSE.content[0].id}/schedules/${PAGINABLE_EVENTS_RESPONSE.content[0].id}/events`
    )
    await page.getByRole('link', { name: 'New Event' }).click()
    expect(page.url()).toBe(
      `${APP_BASE_URL}/projects/${PAGINABLE_EVENTS_RESPONSE.content[0].id}/schedules/${PAGINABLE_EVENTS_RESPONSE.content[0].id}/events/new`
    )
  })

  test('navigating to "Edit Event" page', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(
      `${VITE_API_BASE_URL}/projects/*/schedules/*/events*`,
      (route) => route.fulfill({ json: PAGINABLE_EVENTS_RESPONSE })
    )
    await page.route(
      `${VITE_API_BASE_URL}/projects/*/schedules/*/events/*`,
      (route) =>
        route.fulfill({
          json: PAGINABLE_EVENTS_RESPONSE[0],
        })
    )
    await page.goto(
      `${APP_BASE_URL}/projects/${PAGINABLE_EVENTS_RESPONSE.content[0].id}/schedules/${PAGINABLE_EVENTS_RESPONSE.content[0].id}/events`
    )
    await page.getByRole('button', { name: 'porro-solvo-aegrus' }).click()
    await page.getByTestId('edit-event').click()
    expect(page.url()).toBe(
      `${APP_BASE_URL}/projects/${PAGINABLE_EVENTS_RESPONSE.content[0].id}/schedules/${PAGINABLE_EVENTS_RESPONSE.content[0].id}/events/${PAGINABLE_EVENTS_RESPONSE.content[9].id}/edit`
    )
  })
})

test.describe('new event page', () => {
  test('rendering title and description', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.goto(
      `${APP_BASE_URL}/projects/${PAGINABLE_EVENTS_RESPONSE.content[0].id}/schedules/${PAGINABLE_EVENTS_RESPONSE.content[0].id}/events/new`
    )
    await expect(page.getByRole('heading', { name: 'New Event' })).toBeVisible()
    await expect(page.getByRole('main')).toContainText(
      "Create a new event by entering a title, description, start date, end date and choosing a color. Choose a title that succinctly describes the event and use the description to provide key details and objectives. Set the start date and end date to define the duration of the event. Select a color to categorize your event visually. Once you're done, submit the form to add your event to the calendar and keep your timeline organized."
    )
  })

  test('title being required', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.goto(
      `${APP_BASE_URL}/projects/${PAGINABLE_EVENTS_RESPONSE.content[0].id}/schedules/${PAGINABLE_EVENTS_RESPONSE.content[0].id}/events/new`
    )
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(
      page.getByTestId('event-title').getByText('This field is required')
    ).toBeVisible()
  })

  test('starts at being required', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.goto(
      `${APP_BASE_URL}/projects/${PAGINABLE_EVENTS_RESPONSE.content[0].id}/schedules/${PAGINABLE_EVENTS_RESPONSE.content[0].id}/events/new`
    )
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(
      page.getByTestId('event-starts-at').getByText('This field is required')
    ).toBeVisible()
  })

  test('ends at being required', async ({ page }) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.goto(
      `${APP_BASE_URL}/projects/${PAGINABLE_EVENTS_RESPONSE.content[0].id}/schedules/${PAGINABLE_EVENTS_RESPONSE.content[0].id}/events/new`
    )
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(
      page.getByTestId('event-ends-at').getByText('This field is required')
    ).toBeVisible()
  })

  test('creating event', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit')
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: APP_BASE_URL },
    })
    await page.route(
      `${VITE_API_BASE_URL}/projects/*/schedules/*/events*`,
      (route) =>
        route.request().method() === 'GET' &&
        route.fulfill({ json: PAGINABLE_EVENTS_RESPONSE })
    )
    const title = faker.lorem.slug()
    const description = faker.lorem.sentences()
    const json = {
      id: faker.string.uuid(),
      title,
      description,
      startsAt: faker.date.recent(),
      endsAt: faker.date.soon(),
      color: 'BLUE',
    }
    await page.route(
      `${VITE_API_BASE_URL}/projects/*/schedules/*/events/*`,
      (route) =>
        route.request().method() === 'GET' &&
        route.fulfill({
          json,
        })
    )
    await page.route(
      `${VITE_API_BASE_URL}/projects/*/schedules/*/events`,
      (route) =>
        route.request().method() === 'POST' &&
        route.fulfill({
          json,
        })
    )
    await page.goto(
      `${APP_BASE_URL}/projects/${PAGINABLE_EVENTS_RESPONSE.content[0].id}/schedules/${PAGINABLE_EVENTS_RESPONSE.content[0].id}/events/new`
    )
    await page.getByPlaceholder('Enter title').fill(title)
    await page.getByPlaceholder('Enter description').fill(description)
    await page.getByLabel('Starts at*').click()
    await page
      .getByRole('gridcell', { name: getDate(new Date()).toString() })
      .click()
    await page.getByLabel('Ends at*').click()
    await page
      .getByRole('gridcell', { name: getDate(new Date()).toString() })
      .nth(1)
      .click()
    const promise1 = page.waitForResponse(
      (response) => response.request().method() === 'POST'
    )
    const promise2 = page.waitForResponse(
      (response) => response.request().method() === 'GET'
    )
    await page.getByRole('button', { name: 'Submit' }).click()
    expect((await promise1).request().method()).toBe('POST')
    expect((await promise2).request().method()).toBe('GET')
    expect(page.url()).toContain(
      `${APP_BASE_URL}/projects/${PAGINABLE_EVENTS_RESPONSE.content[0].id}/schedules/${PAGINABLE_EVENTS_RESPONSE.content[0].id}/events`
    )
    await expect(page.getByText('Event created', { exact: true })).toBeVisible()
    await expect(
      page.getByText(`${title} has been successfully created`, {
        exact: true,
      })
    ).toBeVisible()
  })
})

/**
 * TODO:
 * Test:
 *
 * EVENTS
 * - Validating `startsAt` and `endsAt` dates.
 * - Updating existing events.
 *
 * NOTIFICATIONS
 * - Creating new notifications.
 * - Updating existing notifications.
 * - Enabling/Disabling notification via popover.
 */

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
