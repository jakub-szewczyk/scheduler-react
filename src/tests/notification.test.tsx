import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import {
  findMondayNotificationCellIconButtonDisabledTooltip,
  findMondayNotificationCellIconButtonEnabledTooltip,
  getMondayEndsCell,
  getMondayNotificationCellIconButton,
  getMondayNotificationCellIconButtonParent,
  getMondayRoomCell,
  getMondayRoomCellInput,
  getMondayStartsCell,
  getMondaySubjectCell,
  getMondaySubjectCellInput,
  getNotificationCurrentTimeDropdown,
  getNotificationCustomTimeOption,
  getNotificationCustomTimePicker,
  getNotificationFifteenMinutesBeforeDropdown,
  getNotificationFifteenMinutesBeforeOption,
  getNotificationFiveMinutesBeforeDropdown,
  getNotificationFiveMinutesBeforeOption,
  getNotificationSaveButton,
  getNotificationSummaryExpandIcon,
  getNotificationTenMinutesBeforeDropdown,
  getNotificationTenMinutesBeforeOption,
  getNotificationTitleTextField,
} from './queries'

afterEach(() => localStorage.clear())

describe('Notification', () => {
  it('enables icon button', async () => {
    render(<App />)
    const user = userEvent.setup()
    await user.hover(getMondayNotificationCellIconButtonParent())
    expect(getMondayNotificationCellIconButton()).toBeDisabled()
    expect(
      await findMondayNotificationCellIconButtonDisabledTooltip()
    ).toBeVisible()
    await user.type(getMondayStartsCell(), '0800a')
    await user.hover(getMondayNotificationCellIconButtonParent())
    expect(getMondayNotificationCellIconButton()).toBeEnabled()
    expect(
      await findMondayNotificationCellIconButtonEnabledTooltip()
    ).toBeVisible()
  }, 15000)

  it('saves settings via configuration dialog', async () => {
    render(<App />)
    const user = userEvent.setup()
    await user.type(getMondayStartsCell(), '0800a')
    await user.type(getMondayEndsCell(), '0930a')
    await user.dblClick(getMondayRoomCell())
    await user.type(getMondayRoomCellInput(), '110')
    await user.dblClick(getMondaySubjectCell())
    await user.type(getMondaySubjectCellInput(), 'mathematics')
    fireEvent.contextMenu(getMondayNotificationCellIconButton())
    await user.click(getNotificationSummaryExpandIcon())
    expect(screen.getByText(/subject: mathematics/i)).toBeVisible()
    expect(screen.getByText(/room: 110/i)).toBeVisible()
    expect(screen.getByText(/starts: 08:00 am/i)).toBeVisible()
    expect(screen.getByText(/ends: 09:30 am/i)).toBeVisible()
    expect(screen.getByText(/notification: 08:00 am/i)).toBeVisible()
    await user.click(getNotificationCurrentTimeDropdown())
    await user.click(getNotificationFiveMinutesBeforeOption())
    expect(screen.getByText(/notification: 07:55 am/i)).toBeVisible()
    await user.click(getNotificationFiveMinutesBeforeDropdown())
    await user.click(getNotificationTenMinutesBeforeOption())
    expect(screen.getByText(/notification: 07:50 am/i)).toBeVisible()
    await user.click(getNotificationTenMinutesBeforeDropdown())
    await user.click(getNotificationFifteenMinutesBeforeOption())
    expect(screen.getByText(/notification: 07:45 am/i)).toBeVisible()
    await user.click(getNotificationFifteenMinutesBeforeDropdown())
    await user.click(getNotificationCustomTimeOption())
    await user.clear(getNotificationCustomTimePicker())
    await user.type(
      getNotificationTitleTextField(),
      'Mathematics in 20 minutes'
    )
    await user.click(getNotificationSaveButton())
    expect(screen.getByText(/required/i)).toBeVisible()
    await user.type(getNotificationCustomTimePicker(), '0740a')
    expect(screen.getByText(/notification: 07:40 am/i)).toBeVisible()
    await user.click(getNotificationSaveButton())
  }, 45000)
})
