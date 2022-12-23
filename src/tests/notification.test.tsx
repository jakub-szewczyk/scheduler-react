import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

const getMondayRow = () =>
  screen.getByRole('row', {
    name: /monday/i,
  })

const getMondayStartsCell = () =>
  within(getMondayRow()).getAllByRole('textbox')[0]!

const getMondayNotificationCell = () =>
  within(getMondayRow()).getAllByRole('cell')[5]

const getMondayNotificationCellIconButton = () =>
  within(getMondayNotificationCell()).getByRole('button')

const getMondayNotificationCellIconButtonParent = () =>
  getMondayNotificationCellIconButton().parentElement!

const getMondayNotificationCellIconButtonDisabledTooltip = () =>
  screen.findByText(/set start time to enable notification/i)

const getMondayNotificationCellIconButtonEnabledTooltip = () =>
  screen.findByText(/right-click to configure/i)

describe('Notification', () => {
  it('enables notification icon button', async () => {
    render(<App />)
    const user = userEvent.setup()
    await user.hover(getMondayNotificationCellIconButtonParent())
    expect(getMondayNotificationCellIconButton()).toBeDisabled()
    expect(
      await getMondayNotificationCellIconButtonDisabledTooltip()
    ).toBeVisible()
    await user.type(getMondayStartsCell(), '0800a')
    await user.hover(getMondayNotificationCellIconButtonParent())
    expect(getMondayNotificationCellIconButton()).toBeEnabled()
    expect(
      await getMondayNotificationCellIconButtonEnabledTooltip()
    ).toBeVisible()
  }, 15000)
})
