import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

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

describe('Monday', () => {
  it('sets starts to 08:00 am', async () => {
    render(<App />)
    const user = userEvent.setup()
    await user.type(getMondayStartsCell(), '0800a')
    expect(getMondayStartsCell()).toHaveDisplayValue('08:00 am')
  })

  it('sets ends to 09:30 am', async () => {
    render(<App />)
    const user = userEvent.setup()
    await user.type(getMondayEndsCell(), '0930a')
    expect(getMondayEndsCell()).toHaveDisplayValue('09:30 am')
  })

  it('sets room to 110', async () => {
    render(<App />)
    const user = userEvent.setup()
    await user.dblClick(getMondayRoomCell())
    await user.type(getMondayRoomCellInput(), '110')
    expect(getMondayRoomCellInput()).toHaveDisplayValue('110')
  })

  it('sets subject to mathematics', async () => {
    render(<App />)
    const user = userEvent.setup()
    await user.dblClick(getMondaySubjectCell())
    await user.type(getMondaySubjectCellInput(), 'mathematics')
    expect(getMondaySubjectCellInput()).toHaveDisplayValue('mathematics')
  })
})
