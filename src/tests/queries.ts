import { screen, within } from '@testing-library/react'

const getMondayRow = () =>
  screen.getByRole('row', {
    name: /monday/i,
  })

const getMondayStartsCell = () =>
  within(getMondayRow()).getAllByRole('textbox')[0]!

const getMondayEndsCell = () =>
  within(getMondayRow()).getAllByRole('textbox')[1]!

const getMondayRoomCell = () => within(getMondayRow()).getAllByRole('cell')[3]

const getMondayRoomCellInput = () => getMondayRoomCell().querySelector('input')!

const getMondaySubjectCell = () =>
  within(getMondayRow()).getAllByRole('cell')[4]

const getMondaySubjectCellInput = () =>
  getMondaySubjectCell().querySelector('input')!

const getMondayNotificationCell = () =>
  within(getMondayRow()).getAllByRole('cell')[5]

const getMondayNotificationCellIconButton = () =>
  within(getMondayNotificationCell()).getByRole('button')

const getMondayNotificationCellIconButtonParent = () =>
  getMondayNotificationCellIconButton().parentElement!

const findMondayNotificationCellIconButtonDisabledTooltip = () =>
  screen.findByText(/set start time to enable notification/i)

const findMondayNotificationCellIconButtonEnabledTooltip = () =>
  screen.findByText(/right-click to configure/i)

const getNotificationSummaryExpandIcon = () =>
  screen.getByTestId('ExpandMoreIcon')

const getNotificationCurrentTimeDropdown = () =>
  screen.getByRole('button', {
    name: /current time/i,
  })

const getNotificationFiveMinutesBeforeOption = () =>
  screen.getByRole('option', {
    name: '5 minutes before',
  })

const getNotificationFiveMinutesBeforeDropdown = () =>
  screen.getByRole('button', {
    name: /5 minutes before/i,
  })

const getNotificationTenMinutesBeforeOption = () =>
  screen.getByRole('option', {
    name: '10 minutes before',
  })

const getNotificationTenMinutesBeforeDropdown = () =>
  screen.getByRole('button', {
    name: /10 minutes before/i,
  })

const getNotificationFifteenMinutesBeforeOption = () =>
  screen.getByRole('option', {
    name: '15 minutes before',
  })

const getNotificationFifteenMinutesBeforeDropdown = () =>
  screen.getByRole('button', {
    name: /15 minutes before/i,
  })

const getNotificationCustomTimeOption = () =>
  screen.getByRole('option', {
    name: /custom time/i,
  })

const getNotificationCustomTimeDropdown = () =>
  screen.getByRole('button', {
    name: /custom time/i,
  })

const getNotificationCustomTimePicker = () =>
  screen.getByRole('textbox', {
    name: /time/i,
  })

const getNotificationTitleTextField = () =>
  screen.getByRole('textbox', {
    name: /title/i,
  })

const getNotificationSaveButton = () =>
  screen.getByRole('button', {
    name: /save/i,
  })

export {
  getMondayRow,
  getMondayStartsCell,
  getMondayEndsCell,
  getMondayRoomCell,
  getMondayRoomCellInput,
  getMondaySubjectCell,
  getMondaySubjectCellInput,
  getMondayNotificationCell,
  getMondayNotificationCellIconButton,
  getMondayNotificationCellIconButtonParent,
  findMondayNotificationCellIconButtonDisabledTooltip,
  findMondayNotificationCellIconButtonEnabledTooltip,
  getNotificationSummaryExpandIcon,
  getNotificationCurrentTimeDropdown,
  getNotificationFiveMinutesBeforeOption,
  getNotificationFiveMinutesBeforeDropdown,
  getNotificationTenMinutesBeforeOption,
  getNotificationTenMinutesBeforeDropdown,
  getNotificationFifteenMinutesBeforeOption,
  getNotificationFifteenMinutesBeforeDropdown,
  getNotificationCustomTimeOption,
  getNotificationCustomTimeDropdown,
  getNotificationCustomTimePicker,
  getNotificationTitleTextField,
  getNotificationSaveButton,
}
