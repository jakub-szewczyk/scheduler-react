import { clerkSetup } from '@clerk/testing/playwright'
import { test as setup } from '@playwright/test'

setup('global setup', async ({ page }) => {
  const EMAIL = process.env.TEST_ACCOUNT_EMAIL
  const PASSWORD = process.env.TEST_ACCOUNT_PASSWORD
  if (!EMAIL || !PASSWORD)
    throw new Error(
      'missing environment variables: [TEST_ACCOUNT_EMAIL, TEST_ACCOUNT_PASSWORD]'
    )
  await clerkSetup()
  await page.goto('/sign-in')
  await page.getByLabel('Email address').fill(EMAIL)
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await page.getByLabel('Password', { exact: true }).fill(PASSWORD)
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.waitForURL('/')
  await page.context().storageState({ path: 'playwright/.auth/user.json' })
})
