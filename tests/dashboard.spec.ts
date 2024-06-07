import { setupClerkTestingToken } from '@clerk/testing/playwright'
import { expect, test } from '@playwright/test'

const BASE_APP_URL = process.env.BASE_APP_URL

if (!BASE_APP_URL)
  throw new Error('missing environment variables: BASE_APP_URL')

test('renders dashboard', async ({ page }) => {
  await setupClerkTestingToken({
    page,
    options: { frontendApiUrl: BASE_APP_URL },
  })
  await page.goto('/')
  await expect(page.getByText('Dashboard')).toBeVisible()
})
